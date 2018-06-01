GuestHome.controller('GuestController', function GuestController($scope) {
	'use strict';

    const ALL = "all"
    const RESERVED = "reserved"
    const NOT_RESERVED = "not_reserved"

    $scope.mode = ALL
    $scope.currentPage = 0
    $scope.notFirstPage = false;

    $scope.listKey = ""
    $scope.token = ""
    $scope.email = ""

    $scope.firstRow = []
    $scope.secondRow = []
    $scope.allRows = [[], []]


    $scope.fbClicked = function(){
        console.log("fb clicked")
    }

    $scope.all = function(){
        console.log("all clicked")
        $scope.mode = ALL
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.notReserved = function(){
        console.log("not reserved clicked")
        $scope.mode = NOT_RESERVED
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.reserved = function(){
        console.log("reserved clicked")
        $scope.mode = RESERVED
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.suggest = function(){
        console.log("making a suggestion")
    }

    $scope.handleOpenMailModal = function(present){
        console.log("mail modal with present: " + present)
    }

    $scope.client = function(request_dict, callback, error_callback){
        var method = request_dict.method
        var path = request_dict.path
        var entity = request_dict.entity
        var headers_dict = request_dict.headers

        var xobj = new XMLHttpRequest();
        xobj.open(method, path, true);

        for (var header in headers_dict){
            xobj.setRequestHeader(header, headers_dict[header]);
        }

        xobj.onreadystatechange = function() {
            if (xobj.readyState === 4) {
                if(xobj.status === 200){
                    callback(JSON.parse(xobj.responseText))
                }
                else{
                    error_callback(JSON.parse(xobj.responseText))
                }
            }
        };

        xobj.send(JSON.stringify(entity));

    }

    function afterRegistered(response){
        console.log(response)
        $scope.client({method: 'POST', path: '/auth/login', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}, afterLogin)

    }

    function afterLogin(response){
        console.log("after login")
        console.log(response.token)
        $scope.token = response.token
        $scope.client({method: 'GET', path: '/api/list', headers: {'Authorization': "bearer " + response.token}}, afterWishListsLoaded)
    }

    function afterWishListsLoaded(response){
        console.log(response)
        if(response.length == 0) postDefaultWishList();
        else getPresentsFromList(response[0].key)
    }

    function postDefaultWishList(){
		 $scope.client({
		    method: 'POST',
		    path: '/api/list',
		    entity: {
		        listName: "19 urodzinki",
		        suggestions: true,
		        inform: false,
		        color: 'red'
		     },
		    headers: {
		    'Content-Type': 'application/json',
		    'Authorization':  "bearer " + $scope.token
		    },

		 },postDefaultPresents)
    }

    function postDefaultPresents(response){
        console.log("posting default presents as birthday guy to list with the key: " + response.key)
        for (var i = 0; i < 17; i++){
            postDefaultPresent(
                response.key,
                {
                    name: "Kask" + i,
                    description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei",
                    category: "Inne",
                    shopLink: "https://allegro.pl/",
                    imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"
                }
            )

        }
        getPresentsFromList(response.key)
    }

    function postDefaultPresent(listKey, present){
		$scope.client({
		    method: 'POST',
		    path: '/api/list/key/' + listKey + '/present/add',
		    entity: present,
		    headers: {
		        'Content-Type': 'application/json'
		    }
		 }, function(response){console.log("posted present"); console.log(present)})
    }

    function getPresentsFromList(listKey){
        $scope.listKey = listKey
        $scope.client(
            {method: 'GET', path: '/api/list/key/' + listKey + '/present/paged?page=0&size=5',headers: {'Content-Type': 'application/json'}},
            processPresents
        )
    }

    function processPresents(response){
        $scope.firstRow = response.slice(0,2)
        $scope.secondRow = response.slice(2,5)
        $scope.allRows = [$scope.firstRow, $scope.secondRow];
        $scope.$apply();
    }

    $scope.previousPage = function(){
        console.log("previous page clicked")
        if($scope.currentPage == 0) return;
        $scope.client({method: 'GET', path: modeToPageUrl($scope.currentPage - 1), headers: {'Content-Type': 'application/json'}}, onPreviousPageLoaded)
    }

    function onPreviousPageLoaded(response){
        console.log("Previous page loaded")
        console.log(response)
        $scope.currentPage -= 1
        $scope.notFirstPage = $scope.currentPage != 0;
        processPresents(response)
    }

    $scope.nextPage = function(){
        console.log("next page clicked")
        $scope.client({method: 'GET', path: modeToPageUrl($scope.currentPage + 1),headers: {'Content-Type': 'application/json'}}, onNextPageLoaded)
    }

    function onNextPageLoaded(response){
        console.log("Next page loaded")
        console.log(response)
        if(response.length == 0)return
        $scope.currentPage += 1
        $scope.notFirstPage = true;
        processPresents(response)
    }

    $scope.firstPage = function(){
        console.log("Going to first page")
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    function onFirstPageLoaded(response){
        console.log("First page loaded")
        console.log(response)
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        processPresents(response)

    }

   function modeToPageUrl(page){
        if($scope.mode == ALL) return '/api/list/key/' + $scope.listKey + '/present/paged?page=' + page +'&size=5'
        if($scope.mode == NOT_RESERVED) return '/api/list/key/' + $scope.listKey + '/present/paged/notReserved?page=' + page +'&size=5'
        if($scope.mode == RESERVED) return '/api/list/key/' + $scope.listKey + '/present/paged/reserved?page=' + page +'&size=5'
   }

    $scope.client({method: 'POST', path: '/auth/register', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}, afterRegistered, afterRegistered)
})
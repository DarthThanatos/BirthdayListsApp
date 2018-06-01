GuestHome.controller('GuestController', function GuestController($scope) {
	'use strict';

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
    }

    $scope.notReserved = function(){
        console.log("not reserved clicked")
    }

    $scope.reserved = function(){
        console.log("reserved clicked")
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
        postDefaultPresent(response.key, { name: "Kask1", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask2", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask3", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask4", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask5", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask6", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
        postDefaultPresent(response.key, { name: "Kask7", description: "Jako ze poprzedni kask juz mi sie nie podoba, chcialbym dostac nowy, najlepiej w kolorze czarnym, podobnym do tego sprzedawanego w Ikei", category: "Inne", shopLink: "https://allegro.pl/", imageUrl: "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg"})
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

    $scope.client({method: 'POST', path: '/auth/register', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}, afterRegistered, afterRegistered)
})
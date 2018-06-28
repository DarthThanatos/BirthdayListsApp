GuestHome.controller('GuestController', function GuestController($scope, Popeye) {
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

    $scope.searchBarContent = ""
    $scope.searchMode = false
    $scope.currentlySearchedPhrase = ""

    $scope.fbClicked = function(){
        console.log("fb clicked")
    }

    $scope.all = function(){
        $scope.mode = ALL
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.notReserved = function(){
        $scope.mode = NOT_RESERVED
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.reserved = function(){
        $scope.mode = RESERVED
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    $scope.suggest = function(){
        const defaultPresent =
        {
            "name": "Nowy prezent",
            "description": "Opis",
            "category": "Inne",
            "shopLink": "https://allegro.pl/",
            "imageUrl": "https://www.decathlon.pl/media/835/8355467/big_b9e6541f9b2e4e3b927d19916ff1a2f3.jpg",
            wishListKey: $scope.listKey
        }
        presentDialogOpen("Zasugeruj prezent", defaultPresent, '/present/suggestions')
    }

    $scope.editPresent = function(present){
        presentDialogOpen("Edytuj prezent", present, '/present')
    }

    function presentDialogOpen(title, present, linkSuffix){
        var modalScope = $scope.$new();
        modalScope.presentToDisplay = angular.copy(present);

        modalScope.nameErrorMsg = ""
        modalScope.canSubmit = true
        modalScope.disabledMode = false
        modalScope.categoryChoices = ["Inne", "Gry", "Filmy", "Książki"]

        modalScope.presentDialogTitle = title

        modalScope.onNameChanged = function(){
            modalScope.nameErrorMsg = modalScope.presentToDisplay.name == "" ? "Pole nazwy nie może być puste" : ""
            modalScope.canSubmit =  modalScope.presentToDisplay.name != ""
        }

        modalScope.handleSubmit = function(){
            modalScope.disabledMode=true
            $scope.client(
                {
                    method: 'POST', path: 'api/list/key/' + $scope.listKey + linkSuffix,
                    entity: modalScope.presentToDisplay, headers: {'Content-Type': 'application/json'}
                },
                (response) => { modalScope.onAfterPresentSubmitted(response) }
            )
        }

        modalScope.onAfterPresentSubmitted = function (response){
            modalScope.disabledMode=false
            Popeye.closeCurrentModal()
            window.location.reload();
        }

        modalScope.handleClosePresentDialog = function(){
            Popeye.closeCurrentModal()
        }

        var modal = Popeye.openModal({
            templateUrl: "guest_present_dialog.html",
            scope: modalScope,
            click: false,
            keyboard: false
        });
         modalScope.handleClosePresentDialog = function () {
            Popeye.closeCurrentModal()
         }
    }

    $scope.onSearchBarChange = function(){
        if ($scope.searchBarContent == ""){
            $scope.searchMode = false
            $scope.firstPage()
        }
    }

    $scope.onSearchKey = function(event){
        if(event.keyCode == 13){
            $scope.search()
        }
    }

    $scope.search = function(){
        var query = $scope.searchBarContent
        if(query != "") {
            $scope.searchMode = true
            $scope.currentlySearchedPhrase = query
            $scope.firstPage()
        }

    }

    $scope.mailModalOpen = function(present){

        var modalScope = $scope.$new();
        var modal = Popeye.openModal({
            templateUrl: "guest_mail_modal.html",
            scope: modalScope,
            click: false,
            keyboard: false
        });

        modalScope.mailModalSubmit = function(){
            var email = $scope.email == "" ? document.getElementById("emailInput").value : $scope.email

            document.getElementById("emailCancel").hidden = true
            document.getElementById("emailSubmit").hidden = true
            document.getElementById("emailInput").hidden = true
            document.getElementById("emailInfo").innerHTML = ""
            document.getElementById("emailWaitInfo").innerHTML = "Czekaj, rezerwacja w trakcie ..."

            $scope.client({
                method: 'POST',
                path: '/api/reservation',
                entity: {
                    buyerName: "anonim",
                    buyerEmail: email,
                    presentId: present.presentId
                },
                headers: {'Content-Type': 'application/json'}
            }, (response) => afterReservation(response, email))
        }


        function afterReservation(response, email){
            if(response != ""){
                $scope.email = email;
                synchPresentsStates(() => {Popeye.closeCurrentModal(); $scope.$apply();})
            }

        }

        function synchPresentsStates(atEnd){
            $scope.client({method: 'GET', path: modeToPageUrl($scope.currentPage) ,headers: {'Content-Type': 'application/json'}}, response => {processPresents(response); atEnd()})
        }

         function synchPresentsStates_old(atEnd){
            const listKey=$scope.listKey
            const presentsIdsToCoordsDict = getPresentsIdsToCoordsDict()
            const entity= {ids: Object.keys(presentsIdsToCoordsDict)}
            $scope.client({method: 'POST', path: '/api/list/key/' + listKey + '/present/reservationStatus', entity: entity, headers: {'Content-Type': 'application/json'}}, function(response){
                for(var k = 0; k < entity.ids.length; k++){
                    var id = entity.ids[k];
                    var i = presentsIdsToCoordsDict[id][0], j = presentsIdsToCoordsDict[id][1];
                    $scope.allRows[i][j].boughtOrReserved = response[k];
                }
                atEnd()
            });
         }

        function getPresentsIdsToCoordsDict(){
            var res = {}
            for (var i = 0; i < $scope.allRows.length; i++){
                for(var j = 0; j< $scope.allRows[i].length; j++){
                    var id = $scope.allRows[i][j].presentId
                    res[id] = [i,j]
                }
            }
            return res;
        }

        modalScope.mailModalCancel = function(){
            Popeye.closeCurrentModal()
        }

        modal.opened.then(function(){

            document.getElementById("emailCancel").hidden = false
            document.getElementById("emailSubmit").hidden = false
            document.getElementById("emailInput").hidden = false
            document.getElementById("emailInfo").innerHTML = "Podaj swój mail by zarezerwować: " + present.name
            document.getElementById("emailWaitInfo").innerHTML = ""

            if($scope.email != ""){
                modalScope.mailModalSubmit()
            }
        })
    };


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
                    try{
                        callback(JSON.parse(xobj.responseText))
                     }catch(e){
                        callback(xobj.responseText) //simple, non-JSON msg or an empty string
                     }
                }
                else{
                    error_callback(JSON.parse(xobj.responseText))
                }
            }
        };

        xobj.send(JSON.stringify(entity));

    }

    function afterRegistered(response){
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
        for (var i = 0; i < 17; i++){
            postDefaultPresent(
                response.key,
                {
                    name: "Kask" + (i + 1),
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
        if($scope.currentPage == 0) return;
        $scope.client({method: 'GET', path: modeToPageUrl($scope.currentPage - 1), headers: {'Content-Type': 'application/json'}}, onPreviousPageLoaded)
    }

    function onPreviousPageLoaded(response){
        $scope.currentPage -= 1
        $scope.notFirstPage = $scope.currentPage != 0;
        processPresents(response)
    }

    $scope.nextPage = function(){
        $scope.client({method: 'GET', path: modeToPageUrl($scope.currentPage + 1),headers: {'Content-Type': 'application/json'}}, onNextPageLoaded)
    }

    function onNextPageLoaded(response){
        if(response.length == 0)return
        $scope.currentPage += 1
        $scope.notFirstPage = true;
        processPresents(response)
    }

    $scope.firstPage = function(){
        $scope.client({method: 'GET', path: modeToPageUrl(0) ,headers: {'Content-Type': 'application/json'}}, onFirstPageLoaded)
    }

    function onFirstPageLoaded(response){
        $scope.currentPage = 0
        $scope.notFirstPage = false;
        processPresents(response)

    }

   function modeToPageUrl(page){
        if($scope.mode == ALL) return '/api/list/key/' + $scope.listKey + '/present/paged' + ($scope.searchMode ? "/search" : "") + '?page=' + page +'&size=5' + ($scope.searchMode ? "&query=" + $scope.currentlySearchedPhrase : "")
        if($scope.mode == NOT_RESERVED) return '/api/list/key/' + $scope.listKey + '/present/paged' + ($scope.searchMode ? "/search" : "") + '/notReserved?page=' + page +'&size=5' + ($scope.searchMode ? "&query=" + $scope.currentlySearchedPhrase : "")
        if($scope.mode == RESERVED) return '/api/list/key/' + $scope.listKey + '/present/paged' + ($scope.searchMode ? "/search" : "") + '/reserved?page=' + page +'&size=5' + ($scope.searchMode ? "&query=" + $scope.currentlySearchedPhrase : "")
   }

    $scope.client({method: 'POST', path: '/auth/register', entity: {email: "bielas.robert95@gmail.com", password: 'user'},headers: {'Content-Type': 'application/json'}}, afterRegistered, afterRegistered)
})

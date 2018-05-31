GuestHome.controller('GuestController', function GuestController($scope) {
	'use strict';

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
})
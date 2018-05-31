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
})
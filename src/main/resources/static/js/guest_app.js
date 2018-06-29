

var GuestHome = angular.module('GuestHome', ["pathgather.popeye","ngAnimate"],function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}'); }
)

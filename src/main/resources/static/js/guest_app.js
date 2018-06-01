
var GuestHome = angular.module('GuestHome', ["pathgather.popeye"],function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}'); }
)

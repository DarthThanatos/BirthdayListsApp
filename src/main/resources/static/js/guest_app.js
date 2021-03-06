

var GuestHome = angular.module('GuestHome', ["pathgather.popeye","ngAnimate"],function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}'); }
)
GuestHome.directive("pgBalloons", [
    "$interval",
    "$timeout",
    function($interval,
    $timeout) {

      return {
        restrict: "A",
        scope: {
          pgBalloons: "="
        },
        template: "<div class=\"pg-balloon-container ng-animate\" ng-style=\"{ left: offset }\" ng-repeat=\"offset in balloonOffsets track by $index\" >\n  <div pg-balloon ></div>\n</div>",
        link: function(scope,
    element,
    attrs) {
        	console.log(scope.balloons)
          var addBalloon,
    creatingBalloons,
    removeBalloons;
          scope.balloonOffsets = [];
          creatingBalloons = null;
          addBalloon = function() {
            return scope.balloonOffsets.push((Math.random() * 70) + 15 + "%");
          };
          removeBalloons = function() {
            return scope.balloonOffsets = [];
          };
          return scope.$watch("pgBalloons",
    function(newVal,    oldVal) {
      		console.log("newVal " + newVal)
      		console.log("oldVal " + oldVal)
            if (oldVal !== newVal) {
              if (newVal) {
                creatingBalloons = $interval(addBalloon,
    200);
                return $timeout(function() {
                  $interval.cancel(creatingBalloons);
                  return creatingBalloons = null;
                },
    3000);
              } else {
                $interval.cancel(creatingBalloons);
                creatingBalloons = null;
                return removeBalloons();
              }
            }
          });
        }
      };
    }
  ]);

  GuestHome.directive("pgBalloon", function() {
    return {
      restrict: "A",
      template: "<div class=\"pg-balloon\">\n  <div class=\"pg-balloon-knot\">\n    <div class=\"pg-balloon-tail\">\n      <div class=\"pg-balloon-tail\">\n        <div class=\"pg-balloon-tail\">\n          <div class=\"pg-balloon-tail\">\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>"
    };
  });
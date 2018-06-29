mod = angular.module("GuestHome")

console.log("coffee")
console.log(mod)

mod.directive "pgBalloons", ["$interval", "$timeout", ($interval, $timeout) ->
  restrict: "A"
  scope:
    pgBalloons: "="

  template: """
    <div class="pg-balloon-container ng-animate" ng-style="{ left: offset }" ng-repeat="offset in balloonOffsets track by $index" >
      <div pg-balloon ></div>
    </div>
  """
  link: (scope, element, attrs) ->
    scope.balloonOffsets = []
    creatingBalloons = null

    addBalloon = -> scope.balloonOffsets.push((Math.random() * 70) + 15 + "%");
    removeBalloons = -> scope.balloonOffsets = []

    scope.$watch "pgBalloons", (newVal, oldVal) ->
      if oldVal != newVal
        if newVal
          creatingBalloons = $interval(addBalloon, 200)
          $timeout ->
            $interval.cancel(creatingBalloons)
            creatingBalloons = null
          , 3000
        else
          $interval.cancel(creatingBalloons)
          creatingBalloons = null
          removeBalloons()
]

mod.directive "pgBalloon", ->
  restrict: "A"
  template: """
    <div class="pg-balloon">
      <div class="pg-balloon-knot">
        <div class="pg-balloon-tail">
          <div class="pg-balloon-tail">
            <div class="pg-balloon-tail">
              <div class="pg-balloon-tail">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  """

mod.directive "hello", -> 
  template: '<div> hello </div>'

console.log(mod)
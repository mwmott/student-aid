require([
  "app",
  "filters"
], function(app) {

  setInterval(function() {
    var height = document.getElementById("student-aid").offsetHeight;
    window.top.postMessage("responsivechild pym-student-aid " + height, "*");
  }, 100)

  var qsa = function(s) { return Array.prototype.slice.call(document.querySelectorAll(s)) };

  app.controller("studentController", ["$scope", function($scope) {

    $scope.list = window.studentAid.sort(function(a, b) { return b.DRATE1 - a.DRATE1 });

    $scope.sortDescending = true;
    $scope.lastSort = "DRATE1";

    $scope.sort = function(key) {
      qsa(".student-aid input:checked").forEach(function(e) { e.checked = false });
      if ($scope.lastSort == key) {
        $scope.sortDescending = !$scope.sortDescending;
      } else {
        $scope.sortDescending = !(key == "School" || key == "School-type");
      }
      $scope.lastSort = key;
      $scope.list.sort(function(a, b) {
        a = typeof a[key] == "string" ? a[key].toLowerCase() : a[key];
        b = typeof b[key] == "string" ? b[key].toLowerCase() : b[key];
        var result = 0;
        if (a < b) result = -1;
        if (a > b) result = 1;
        if ($scope.sortDescending && result) {
          result *= -1;
        }
        return result;
      });
    };

    $scope.filterExp = "*";

  }]);

  app.directive("sortArrow", function() {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var column = attrs.sortArrow;
        var onSort = function(after, before, $scope) {
          var on = $scope.lastSort;
          element.removeClass("sorted up");
          if (on == column) {
            element.addClass("sorted");
            if (!$scope.sortDescending) {
              element.addClass("up");
            }
          }
        };
        scope.$watch("lastSort", onSort);
        scope.$watch("sortDescending", onSort);

      }
    }
  })

  window.app = app;

  angular.bootstrap(document.querySelector("#student-aid"), ["studentAid"]);

});
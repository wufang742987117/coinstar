'use strict';

angular.module('app')
    .controller('HomeApiController', HomeApiController)
    .filter('trustAsResourceUrl', ['$sce', function($sce) {
      return function(val) {
        return $sce.trustAsResourceUrl(val);
      };
    }]);

  function HomeApiController($scope,$stateParams){
    $scope.urlName = $stateParams.urlName +'';
    var path = 'data/index.html#';
    $scope.pathUrl = path + $scope.urlName;
    console.log( $scope.pathUrl );
  }

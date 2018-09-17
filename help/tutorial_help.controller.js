(function () {
    'use strict';

    angular
        .module('app')
        .controller('TutorialHelpController', TutorialHelpController)
        .controller('QusetionsController', QusetionsController)
        .controller('IntroGccController', IntroGccController)
    function TutorialHelpController($scope) {

        $scope.data = {
            current: 1,
            currents:1
        };
        $scope.actions = {
            setCurrent: function (param) {
                $scope.data.current = param;
                $scope.data.currents = param;
            },
            setCurrents:function (params) {
                $scope.data.currents = params;
            }
        }
    }

    function QusetionsController() {


    }
    function IntroGccController() {

    }
})();



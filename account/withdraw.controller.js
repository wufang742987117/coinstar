'use strict';

angular.module('app')
    .controller('WithdrawController', WithdrawController)
	.controller('HistoryWithdrawController', HistoryWithdrawController)
    .filter('getUsernameFormat', getUsernameFormat);

function getUsernameFormat() {
    return function (username) {
        if(!username)
            return username;
        var phone = /[^\._-][\w\.-]+@(?:[A-Za-z0-9]+\.)+[A-Za-z]+$|^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}|^176\d{8}$/;
        if (phone.test(username) && username.length == 11) {
            var _username = username.substring(0, 3) + "****" + username.substring(7, 11);
        } else {
            var c = username.split("@");
            var c1 = c[0].substr(3);
            var star = "";
            for (var i = 0; i < c1.length; i++) {
                star += "*";
            }
            var _username = c[0].substr(0, 3) + star + c[1];
        }
        return _username;
    };
}

function WithdrawController($scope, ngDialog, PrivateService, $interval, AuthenticationService,PublicService,$stateParams,FlashService) {
    
}
function HistoryWithdrawController() {
	
}


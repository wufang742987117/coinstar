(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserTokenService', UserTokenService);

    UserTokenService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'CONFIG'];

    function UserTokenService($http, $cookies, $rootScope, $timeout, CONFIG) {
        var service = {};

        let SERVER = CONFIG.usertoken;
        let KEEP_ALIVE_TIME = 60*30;

        service.debug = false;
        service.Login = Login;
        service.Refresh = Refresh;
        service.CheckAlive = CheckAlive;
        service.GetToken=GetToken;
        service.KeepAlive = KeepAlive;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.googleSubmit=googleSubmit;
        service.Logout=Logout;

        service.SERVER = SERVER;

        return service;

        //登录
        function Login(params) {
            return _send("get",params);
        }

        function googleSubmit(params) {
            return _send('checkLogin', params);
        }

        // calls a function to validate JSON token
        //function Login(username, password, tfa) {
        //      return _send("get", {
        //          username: username,
        //        password: password,
        //        tfa: tfa
        //      });
        //  }

        function Refresh(token) {
            return _send("refresh", {
                token: token
            });
        }
        // function get/returns token, and test if successful
        // method: get
        // params: username, password, etc
        function _send(method, params) {
            // Get JSON Web token test in private functions
            // res: is object that contains the token
            return $http.post(SERVER + method, params, {headers: {}
            }).then(
                function(res) {
                    if (service.debug)
                        console.log({
                            "method": method,
                            "params": params,
                            "result": res.data
                        });
                    return handleSuccess(res);
                },
                function(res) {
                    return handleError(res);
                });
        } // end _send

        // private functions
        function handleSuccess(res) {
            if (res.data != undefined && res.data.status.success != undefined && res.data.status.success)
                return {
                    success: true,
                    data: res.data.result,
                    message: res.data.status.message
                };

            else
                return handleError(res);
        } // end handleSuccess

        function handleError(res) {
            if (res.data && res.data.status && res.data.status.message)
                return {
                    success: false,
                    message: res.data.status.message
                };
            return {
                success: false,
                message: 'General connection error'
            };
        } // end handleError


        function SetCredentials(token) {
            $rootScope.globals = {
                token: token
            };
            // store userdetails in globals cookie that keeps user logged in for 1 day (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('globals', $rootScope.globals);
            $rootScope.globals.logged_in = true;
        } // end SetCredentials

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.putObject('globals', {});
        } // end of ClearCredentials

        function KeepAlive() {
            $cookies.putObject('alive_till', (new Date()).setSeconds((new Date()).getSeconds() + KEEP_ALIVE_TIME));
        }

        function CheckAlive() {
            return $cookies.getObject('alive_till') > new Date();
        }

        function GetToken() {
            return $cookies.getObject('globals');

        }

        // 登出
        function Logout(params) {
            return _send('out ', params);
        }
    }


})();

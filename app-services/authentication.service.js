(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'CONFIG', '$translate'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout, CONFIG, $translate) {
        var service = {};

        var SERVER = CONFIG.authentication;

        service.debug = true;
        service.Ask = Ask;
        service.AskTPass = AskTPass;
        service.ASKLOGINPass = ASKLOGINPass;
        service.answerLoginVerification=answerLoginVerification;
        service.AskEmail = AskEmail;
        service.AskChangeEmail = AskChangeEmail;
        service.AskPhone = AskPhone;
        service.askLoginPhoneVer=askLoginPhoneVer;
        service.AskChangePhone = AskChangePhone;
        service.AskResetPasswordEmail = AskResetPasswordEmail;
        service.AskResetPasswordPhone = AskResetPasswordPhone;
        service.Answer = Answer;
        service.answerVerification = answerVerification;
        service.AskWithdrawal = AskWithdrawal;
        service.AskLock = AskLock;

        service.askVerification = askVerification;

        service.askResetTpass = askResetTpass;


        service.SERVER = SERVER;

        return service;

        function Askcode(params) {
            return _send("askWithdrawalAddressVerify",params);
        }
        // calls a function to validate JSON token
        function Ask(request_type,number) {
            if(number){
                return _send("ask", {
                    request_type: request_type,
                    bank_id:number
                });
            }else{
                return _send("ask", {request_type: request_type});
            }
        }
        //找回密码获取验证码
        function askVerification(params) {
            return _send("ask",params);
        }


        function AskWithdrawal() {
            return service.Ask('WITHD');
        }

        function AskLock() {
            return service.Ask('LOCK');
        }

        function AskEmail(email) {
            return _send("ask", {
                request_type: 'ADMAI',
                email: email
            });
        }

        function AskTPass(tpass) {
            return _send("askSetTpass", {});
        }

        function ASKLOGINPass(params) {
            return _send("askLoginVerification", params);
        }

        function askLoginPhoneVer(params) {
            return _send("askLoginPhoneVerification", params);
        }

        function answerLoginVerification(emailList) {
            return _send("answerLoginVerification", emailList);
        }

        function askResetTpass() {
            return _send("askResetTpass", {});
        }

        function AskChangeEmail() {
            return _send("ask", {
                request_type: 'CHMAI'
            });
        }

        function AskPhone(phone) {
            return _send("ask", {
                request_type: 'ADPHO',
                phone: phone
            });
        }

        function AskChangePhone() {
            return _send("ask", {
                request_type: 'CHPHO'
            });
        }

        function AskResetPasswordEmail(email){
            return _send("ask", {
                request_type: 'FORGO',
                email: email
            });
        }

        function AskResetPasswordPhone(phone){
            return _send("ask", {
                request_type: 'FORGO',
                phone: phone
            });
        }

        function Answer(params) {
            return _send("answer", params);
        }
        function answerVerification(params) {
            return _send("answerVerification", params);
        }

        // function get/returns token, and test if successful
        // method: get
        // params: username, password, etc
        function _send(method, params) {
            var headers={};
            if(typeof params !== 'undefined') {
				if($translate.use() == 'zh_TW') {
					params.language='zh'
				}else {
					params.language='en'
				}
                // params.language=
            } else{
                params='';
            }
            if($rootScope.globals && $rootScope.globals.token){
                headers={ 'x-access-token': $rootScope.globals.token};
            }
            return $http.post(SERVER + method, params, {headers: headers})
                .then(
                    function(res) {
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
                    message:res.data.status.message
                };
            else
                return handleError(res);
        } // end handleSuccess

        function handleError(res) {
            if(res.data.status.message!==undefined)
                return { success: false, message: res.data.status.message };
            return { success: false, message: 'General connection error' };
        }


    }

})();

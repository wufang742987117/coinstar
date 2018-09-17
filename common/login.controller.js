;(function () {
    'use strict';

    angular
        .module('app')
        .controller('LogoutController', LogoutController)
        .controller('LoginController', LoginController)
        .controller('VerityGoogleController', VerityGoogleController)
        .controller('VerityMailboxController', VerityMailboxController)
        .controller('VerityPhoneController', VerityPhoneController)
        .directive('ngFocus', [function() {
            var FOCUS_CLASS = "ng-focused";
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {
                    ctrl.$focused = false;
                    element.bind('focus', function(evt) {
                        element.addClass(FOCUS_CLASS);
                        scope.$apply(function() {ctrl.$focused = true;});
                    }).bind('blur', function(evt) {
                        element.removeClass(FOCUS_CLASS);
                        scope.$apply(function() {ctrl.$focused = false;});
                    });
                }
            }
        }]);

    function LogoutController($scope,$rootScope,$location,UserTokenService,$cookies) {
        $scope.params={
            "access_token":UserTokenService.GetToken().token
        }
        UserTokenService.Logout($scope.params).then(function (res) {
            UserTokenService.ClearCredentials();
            $cookies.put('username','');
            $rootScope._username =  false;
            $location.path('login');
        })
    }

    LoginController.$inject = ['$scope', 'AuthenticationService', 'UserTokenService', '$location','$cookies','FlashService'];

    function LoginController($scope, AuthenticationService, UserTokenService, $location,$cookies,FlashService) {
        $scope.isshow = false;
        $scope._username = $cookies.get('username');
        $scope.params = {};
        $scope.errorpwd = false;
        $scope.loading = false;
        $scope.init = function () {
            AuthenticationService.Ask('LOGIN').then(function (res) {
                if (res.success == true) {
                    var SERVER = AuthenticationService.SERVER + 'captcha/';
                    $scope.imageUrl = SERVER + res.data.parameter;
                    $scope.params.id = res.data.id;
                } else {
                    console.log(res.message);
                }
            })
        };

		$scope.enter = function(ev) { 
			if (ev.keyCode == 13) {
				$scope.login();
			}
		}
		
        //中间最小高度
        $scope.setMinHeight = function () {
            var _height=$window.innerHeight;
        }

        //$scope.init();
        //点击获取验证码
        $scope.getImages = function () {
            $scope.init();
            $scope.params.secret = '';
        };

        //预验证图片码
        $scope.getVerifyImage = function () {
            if ($scope.params.secret.length < 5) {
                $scope.errormsg = true;
                return;
            }
            AuthenticationService.Answer($scope.params).then(function (res) {
                if (res.success == true) {
                    $scope.errormsg = false;
                    $scope.params.authtoken = res.data.token;
                    $scope.isshow = false;
                } else {
                    $scope.isshow = true;
                    if (res.message == "ERR_AUTH_ANSWER_REJECTED") $scope.errormsg = true;
                    // $scope.init();
                }
            })
        };

        //登录页面接口
        $scope.login = function () {
            $scope.loading = true;
            if($scope.showimage){
                $scope.params.secret = '';
            }
            $scope.params.tfa = '';
            UserTokenService.Login($scope.params).then(function (res) {
                $scope.loading = false;
                if (res.success) {
                    $scope.showimage = false;
                    if(res.message == 'SUC_LOGIN'){
                        FlashService.Toast("LOGIN.SUCCESS", 'success');
                        $location.path('/account/amenu');
                        UserTokenService.SetCredentials(res.data.token);
                        $cookies.put('username', $scope.params.username);
                        $scope.$emit('$login', true);
                    }
                    else if(res.message == 'CODE_CHECK') {

                        // FlashService.Toast("LOGIN.SUCCESS", 'success');
                        // $location.path('/account/amenu');
                        // UserTokenService.SetCredentials(res.data.token);
                        // $cookies.put('username', $scope.params.username);
                        // $scope.$emit('$login', true);
                        $location.path('/google_verify');
                        $cookies.put('token_valid',res.data.token);
                        $cookies.put('username_valid', $scope.params.username);
                    }
                    else if(res.message == 'MAIL_CHECK') {
                        $location.path('/mailbox_verify');
                        $cookies.put('token_valid',res.data.token);
                        $cookies.put('username_valid', $scope.params.username);
                    }
                    else if(res.message == 'PHONE_CHECK') {
                        $location.path('/phone_verify');
                        $cookies.put('token_valid',res.data.token);
                        $cookies.put('username_valid', $scope.params.username);
                    }

                } else {
                    $scope.showimage = true;
                    if(res.message == 'ERR_MAXIMUM_LOGIN_REACHED'){
                        FlashService.Toast("LOGIN.ERROR", 'error');
                    }else{
                        FlashService.Toast("LOGIN.ERROR", 'error');
                    }
                    $scope.errorpwd = true;
                    $scope.showimage = true;
                    $scope.init();
                }
            })
        };

        $scope.getpassword = function(){
            $scope.errorpwd = false;
        }
    }

    function VerityGoogleController($scope, UserTokenService, $location,$cookies,FlashService,$rootScope) {
        $scope.params={
            type:2,
            token:$cookies.get('token_valid')
        };
        // $scope.submit_sending=false;
        // $scope.params.code==null?$scope.submit_sending=false:$scope.submit_sending=true;
        $scope.googleSubmit = function() {
            UserTokenService.googleSubmit($scope.params).then(function (res) {
                $scope.loading = false;
                if (res.success) {
                    $scope.submit_sending=true;
                    UserTokenService.SetCredentials(res.data.token);
                    FlashService.Toast("LOGIN.SUCCESS", 'success');
                    $location.path('/account/amenu');
                    const username=$cookies.get('username_valid');
                    $cookies.put("username",username);
                    $scope.$emit('$login', true);
                }else {
                    FlashService.Toast("LOGIN.ERROR", 'error');
                }
            })
        }
    }
    function VerityMailboxController($scope, $rootScope,AuthenticationService, UserTokenService, $location,$cookies,FlashService,$interval) {

        var vm = this;
        function cancelCount(){
            $interval.cancel(count);
        }
        function cleanupCount(){
            $scope.code_count=false;
            vm.code_sent=false;
        }
        var count;
        function Counter() {
            $scope.code_count = true;
            $scope.counter=60;
            count = $interval(()=>{
                $scope.counter--;
            }, 1000, 60);
            count.then(()=>cleanupCount(), ()=>cleanupCount());
        }
        $scope.params={
            authtoken:$cookies.get('token_valid')

        };
        $scope.emailList= {};

        $scope.submit_data={
            type:1,
            token:$cookies.get('token_valid')
        };
        $scope.askBind=function() {
            $scope.code_sending = true;
            AuthenticationService.ASKLOGINPass($scope.params).then(function (res) {
                $scope.code_sending = false;
                // $scope.loading = false;
                if (res.success) {
                    FlashService.Toast('SETTING.EMAIL_SENT', 'info');
                    vm.code_sent=true;
                    Counter();
                    $scope.emailList.id=res.data.id;
                }else {
                    FlashService.Toast('MESSAGE.ERR_ASK_PHONE', 'error');
                }
            })
        }
        $scope.submit_sending=false;

        $scope.ifSubmit=function () {

            if ($scope.emailList.verificationCode.length != 6) {
                $scope.submit_sending=false;
                return;
            }
            AuthenticationService.answerLoginVerification($scope.emailList).then(function (res) {
                if (res.success) {

                    $scope.errorVcode = false;
                    $scope.submit_sending=true;
                    $scope.submit_data.code = res.data.token;
                } else {
                    $scope.errorVcode = true;
                    $scope.submit_sending=false;
                    $scope.submit_data.code = null;

                }
            }, function (res) {
                console.log(res.message);
            });
            // $scope.emailList.verificationCode==null?$scope.submit_sending=false:$scope.submit_sending=true;
        }

        $scope.bindSubmit=function() {
            UserTokenService.googleSubmit($scope.submit_data).then(function (res) {
                $scope.loading = false;
                if (res.success) {
                    UserTokenService.SetCredentials(res.data.token);
                    FlashService.Toast("LOGIN.SUCCESS", 'success');
                    $location.path('/account/amenu');
                    const username=$cookies.get('username_valid');
                    $cookies.put("username",username);
                    $scope.$emit('$login', true);
                }else {
                    FlashService.Toast("LOGIN.ERROR", 'error');
                }
            })
        }

    }

    function VerityPhoneController($scope,AuthenticationService,FlashService, UserTokenService, $location,$cookies,$interval ) {
        var vm = this;
        $scope.phonelList= {};
        // Code counter on Ask
        function cancelCount(){
            $interval.cancel(count);
        }
        function cleanupCount(){
            $scope.code_count=false;
            vm.code_sent=false;
        }
        var count;
        function Counter() {
            $scope.code_count = true;
            $scope.counter=60;
            count = $interval(()=>{
                $scope.counter--;
        }, 1000, 60);
            count.then(()=>cleanupCount(), ()=>cleanupCount());
        }

        $scope.params={
            authtoken:$cookies.get('token_valid')
        };

        $scope.submit_data={
            type:3,
            token:$cookies.get('token_valid')
        };
        // Catalog of functions
        $scope.askBind = askBind;
        // $scope.answerBind = answerBind;

        //----------- BIND PHONE ------------------------->
        function askBind() {
            // POST authentication
            AuthenticationService.askLoginPhoneVer($scope.params)
                .then(function(res) {
                    if (res.success) {
                        FlashService.Toast('SETTING.PHONE_SENT', 'info');
                        Counter();
                        $scope.phonelList.id=res.data.id;
                    }else {
                        FlashService.Toast('MESSAGE.ERR_ASK_PHONE', 'error');
                    }
            });
        }// end askBind
        $scope.submit_sending=false;
        $scope.ifSubmit=function () {
            if ($scope.phonelList.verificationCode.length != 6) {
                $scope.submit_sending=false;
                return;
            }
            AuthenticationService.answerLoginVerification($scope.phonelList).then(function (res) {
                if (res.success) {
                    $scope.errorVcode = false;
                    $scope.submit_sending=true;
                    $scope.submit_data.code = res.data.token;
                } else {
                    $scope.errorVcode = true;
                    $scope.submit_sending=false;
                    $scope.submit_data.code = null;
                }
            }, function (res) {
                console.log(res.message);
            });
            // $scope.emailList.verificationCode==null?$scope.submit_sending=false:$scope.submit_sending=true;
        }

        $scope.answerBind=function() {
            UserTokenService.googleSubmit($scope.submit_data).then(function (res) {
                $scope.loading = false;
                if (res.success) {
                    UserTokenService.SetCredentials(res.data.token);
                    FlashService.Toast("LOGIN.SUCCESS", 'success');
                    $location.path('/account/amenu');
                    const username=$cookies.get('username_valid');
                    $cookies.put("username",username);
                    $scope.$emit('$login', true);
                }else {
                    FlashService.Toast("LOGIN.ERROR", 'error');
                }
            })
        }
    }

})();

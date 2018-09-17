(function() {
    'use strict';
    angular
        .module('app')
        .controller('SettingController', SettingController)
        .controller('EmailController', EmailController)
        .controller('PhoneController', PhoneController)
        .controller('IdController', IdController)
        .controller('AuthenticatorController', AuthenticatorController)
        .controller('TpassController', TpassController)
        .controller('PasswordController', PasswordController)
        .controller('ApiController', ApiController)
        .controller('C1Controller', C1Controller)
        .controller('C2Controller', C2Controller)
        .controller('realIdentityontroller', realIdentityontroller)
        .controller('keyController', keyController)
        .controller('LoginSafeController', LoginSafeController)
        .controller('TradeSafeController', TradeSafeController)
        .controller('WithdrawSafeController', WithdrawSafeController)
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
    function realIdentityontroller($scope, $translate) {
    }

    function SettingController(PrivateService, AuthenticationService, FlashService, $location, $scope, $translate, ngDialog) {
        $scope.tpass;
        $scope.tpassStatus = {
            disabled: false
        };
				$scope.pcHsow = true;
        $scope.data = {
            current: 1
        };
        $scope.actions = {
            setCurrent: function (param) {
                $scope.data.current = param;
                if($scope.data.current==1) {
                    init();
                }
            }
        };
				
				if(window.screen.width<500) {
					$scope.pcHsow = false;
				}

        init();
        function init() {
            PrivateService.getSettings()
                .then((response) => {
                    if(response.success) {
                        $scope.menu_display = response.data;
                        if($scope.menu_display.tpass) $scope.tpassStatus.disabled = ($scope.menu_display.tpass.trading ? true : false);
                        console.log($scope.menu_display)
                        console.log(($scope.menu_display.tpass.trading ? true : false))
                        console.log($scope.tpassStatus)
                        var sub = $scope.menu_display;

                        $scope.menu_display.url = location.origin+location.pathname + '#!/register?recommended=' + $scope.menu_display.user_id;
                        // setTimeout(() => $scope.qrCode($scope.menu_display.url), 0);
												$scope.menu_display.bindEmail=$scope.menu_display.email;
                        if($scope.menu_display.email != undefined)
                            $scope.menu_display.email = sub.email.substr(0,3)+'****'+sub.email.substr(-6,6);
                        if($scope.menu_display.phone != undefined)
                            $scope.menu_display.phone = sub.phone.substr(0,3)+'*****'+sub.phone.substr(-3,3);
                    } // if
                });
            PrivateService.getSafetySettings()
                .then((response) => {
                    if(response.success) {
                        $scope.check_detail=response.data;

                    } // if
                });

        }

        // $scope.qrCode = function(url) {
        //     var qrcode = document.querySelector('#qrcode');
        //     console.log(qrcode);
        //     qrcode.getContext("2d").clearRect(0,0,qrcode.width,qrcode.height);
        //     qrcodelib.toCanvas(qrcode, url, {
        //         color: {
        //             dark: '#000000'
        //         },
        //         scale: 3
        //     }, (error)=>{
        //         if(error!=null)
        //             console.error(error);
        //     });
        // };

        // 切换是否需要输入资金密码
        $scope.swtichTpass = function () {
            ngDialog.open({
                template: 'template',
                scope:$scope,
                controller: function ($scope) {
                    $scope.confirm = function () {
                        PrivateService.tradingTpass($scope.tpass, $scope.tpassStatus.disabled ? 1 : 0).then(function(res){
                            if(res.success){
                                $scope.closeThisDialog();
                                FlashService.Toast($scope.tpassStatus.disabled ? 'MESSAGE.TPASS_ENABLED' : 'MESSAGE.TPASS_DISABLED', 'success');
                            }else{
                                FlashService.Toast('MESSAGE.' + res.message, 'error');
                                // $scope.tpassStatus.disabled = !$scope.tpassStatus.disabled;
                            }
                        });
                    };
                    $scope.cancel = function () {
                        $scope.tpassStatus.disabled = !$scope.tpassStatus.disabled;
                        $scope.closeThisDialog();
                    };
                }
            });
            ngDialog.close()
        };
    }


    function PasswordController(PrivateService,$scope, FlashService , Util) {
        var vm = this;
        $scope.doubleCheck = { password: true, verify: false };
        $scope.submit_sending = false;


        $scope.PasswordHasStandards = PasswordHasStandards;

        vm.password = password;

        vm.doubleCheckPassword = function(psw1, psw2) {
            $scope.doubleCheck.password = (psw1 == psw2 || psw2 == undefined) ? true : false;
            $scope.doubleCheck.verify = ($scope.doubleCheck.password == true &&
            psw1!='' &&
            psw2!='' &&
            psw1!=undefined &&
            psw2!=undefined) ? true: false;
        };

        function PasswordHasStandards(pwd){
            $scope.error_password=(Util.checkPassword(pwd).length)?Util.checkPassword(pwd)[0]:null;
        };

        function password() {
            if(!Util.checkPassword(vm.newPassword).length) {
                $scope.submit_sending = true;
                PrivateService.SetPassword(vm.oldPassword, vm.newPassword)
                    .then( (response) => {
                        $scope.submit_sending = false;
                        if (response.success)
                            FlashService.Toast('MESSAGE.PASSWORD_CHANGED', 'success', '/logout');
                        else
                            FlashService.Toast('MESSAGE.ERR_CHANGE_PASSWORD', 'errror');
                    });
            } else {
                Util.checkPassword(vm.newPassword).map( (item) => FlashService.Toast(item,'error') );
            }

        } // end password
    } // end PasswordController


    function EmailController(PrivateService, AuthenticationService, $scope, $translate, FlashService, Util, $location, $interval, $timeout) {
        $scope.formData = {};

        $scope.init = function() {
            PrivateService.getSettings()
                .then((response) => {
                    if(response.success) {
                        $scope.setting = response.data;
                    }
                });
        }
        $scope.init();


        var vm = this;

        // Variables to check actions
        vm.code_sent=false;
        $scope.bind = { id: '', secret: ''};
        $scope.change = { id: '', secret: ''};
        $scope.error = { email: false };
        $scope.doubleCheck = { email: true, verify: false };
        $scope.updateEmail = { response: true, check: true };

        // Functions that check users actions
        vm.checkCode = function() {
            $scope.error_message = "";
            vm.code_valid = Util.checkCode(vm.secret);
        };
        vm.checkingEmail = function(email) {
            vm.email_valid = Util.checkMail(email);
            $scope.error.email = (vm.email_valid || email == undefined) ? false : true;
        };
        vm.doubleCheckEmail = function(email1, email2) {
            $scope.doubleCheck.email = (email1 == email2 || email2 == undefined) ? true : false;
            $scope.doubleCheck.verify = ($scope.doubleCheck.email == true && email2 != undefined) ? true: false;
        };


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


        // Catalog of functions
        $scope.askBind = askBind;
        $scope.answerBind = answerBind;


        //----------- BIND EMAIL ------------------------->
        function askBind() {
            $scope.code_sending = true;
            // call authenticatication to ask for code
            AuthenticationService.AskEmail($scope.formData.email)
                .then(function(response) {
                    $scope.code_sending = false;
                    if (response.success) {
                        // collect api id for code
                        $scope.bind.id = response.data.id;
                        FlashService.Toast('SETTING.EMAIL_SENT', 'info');
                        vm.code_sent=true;
                        Counter();
                    } else {
                        FlashService.Toast('MESSAGE.ERR_ASK_EMAIL', 'error');
                    }
                });
        }; // end askBind


        function answerBind() {
            $scope.submit_sending = true;
            // collect users email code
            $scope.bind.secret = vm.secret;
            // call authenticatication for Answer
            AuthenticationService.Answer({id: $scope.bind.id, secret: $scope.formData.secret.toString()})
                .then(function(response) {
                    if(response.success) {
                        // Finally call PrivateService to send new email with valid token
                        PrivateService.BindEmail(response.data.token, $scope.formData.email)
                            .then(function(res) {
                                $scope.submit_sending = false;
                                if(res.success) {
                                    FlashService.Toast('MESSAGE.EMAIL_BINDED', 'success');
                                    history.go(-1);
                                } else {
                                    switch (res.message) {
                                        case"ERR_EMAIL_DUPLICATE":
                                            FlashService.Toast('MESSAGE.ERR_EMAIL_DUPLICATE', 'error');
                                            vm.code_sent=false;
                                            // cancelCount();
                                            break;
                                        default:
                                            FlashService.Toast('MESSAGE.ERR_SND', 'error');
                                            vm.code_sent=false;
                                        // cancelCount();
                                    } // end switch
                                }
                            });
                    } else {
                        FlashService.Toast('MESSAGE.ERR_ANS', 'error');
                        vm.code_sent=false;
                        $scope.submit_sending = false;
                        $scope.counter = undefined;
                        // cancelCount();
                    }
                });
        }; // end answerBind

        //---------------- END BIND EMAIL------------------------------>
    } // end EmailController



    function PhoneController(PrivateService, AuthenticationService, $scope, $translate, FlashService, Util, $timeout, $interval, $location) {
        $scope.formData = {};

        $scope.init = function() {
            PrivateService.getSettings()
                .then((response) => {
                    if(response.success) {
                        $scope.setting = response.data;
                    }
                });
        }
        $scope.init();

        var vm = this;

        // Variables to check users actions
        vm.code_sent=false;
        $scope.bind = { id: '', secret: '' };
        $scope.change = { id: '', secret: '' };
        $scope.error = { phone: false };
        $scope.doubleCheck = { phone: true, verify: false };
        $scope.updatePhone = { response: true, check: true };


        // Functions that check users actions
        vm.checkCode = function(){
            $scope.error_message = "";
            vm.code_valid=Util.checkCode(vm.secret);
        };
        // vm.checkingPhone = function(phone) {
        //   vm.phone_valid = Util.checkPhone(vm.newPhone);
        //   $scope.error.phone = (vm.phone_valid || phone == undefined) ? false : true;
        // };
        // vm.doubleCheckPhone = function(phone1, phone2) {
        //   $scope.doubleCheck.phone = (phone1 == phone2 || phone2 == undefined) ? true : false;
        //   $scope.doubleCheck.verify = ($scope.doubleCheck.phone == true && phone2 != undefined) ? true : false;
        // };


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


        // 手机号码验证
        $scope.phonefalse=false;
        $scope.phonecheck=function() {
            if($scope.formData.phone.length!=11) {
                return;
            }
            PrivateService.checkPhone($scope.formData.phone)
                .then(function(res) {
                    if (res.success) {
                        $scope.phonefalse=false;
                    }else {
                        $scope.phonefalse=true;
                    }
                });
        }

        // Catalog of functions
        $scope.askBind = askBind;
        $scope.answerBind = answerBind;

        //----------- BIND PHONE ------------------------->
        function askBind() {
            $scope.code_sending=true;
            // POST authentication
            AuthenticationService.AskPhone($scope.formData.phone)
                .then(function(response) {
                    $scope.code_sending=false;
                    if (response.success) {
                        // collect api id for code
                        $scope.bind.id = response.data.id;
                        FlashService.Toast('SETTING.SMS_SENT', 'info');
                        // vm.code_sent=true;
                        Counter();
                    } else {
                        FlashService.Toast('MESSAGE.ERR_ASK_PHONE','error');
                        $scope.code_sending=false;
                    }
                }, (error) => {
                    FlashService.Toast('MESSAGE.ERR_ASK_PHONE','error');
                    $scope.code_sending=false;
                });
        }// end askBind

        function answerBind() {
            $scope.submit_sending = true;
            // collect users email code
            $scope.bind.secret = $scope.formData.secret;
            // call authenticatication for Answer
            AuthenticationService.Answer({id: $scope.bind.id, secret: $scope.bind.secret})
                .then(function(response) {
                    // Finally call PrivateService to send new email with valid token
                    if(response.success) {
                        PrivateService.BindPhone(response.data.token, $scope.formData.phone)
                            .then(function(response) {
                                $scope.submit_sending = false;
                                if(response.success) {
                                    FlashService.Toast('MESSAGE.PHONE_BINDED', 'success');
                                    history.go(-1);
                                } else {
                                    switch (response.message) {
                                        case"ERR_PHONE_DUPLICATE":
                                            FlashService.Toast('MESSAGE.ERR_PHONE_DUPLICATE', 'error');
                                            // vm.code_sent=false;
                                            // cancelCount();
                                            break;
                                        default:
                                            FlashService.Toast('MESSAGE.ERR_SND', 'error');
                                        // vm.code_sent=false;
                                        // cancelCount();
                                    } // end switch
                                }
                            });
                    } else {
                        FlashService.Toast('ACCOUNT.ERROR_ANSWER', 'error');
                        // vm.code_sent=false;
                        $scope.submit_sending = false;
                        // cancelCount();
                    }
                });
        } // end answerBind
        //---------------- END ------------------------------>
    } // end PhoneController


    function TpassController(AuthenticationService, PrivateService, $scope, FlashService, $translate, Util, $interval) {
        $scope.formData = {};
        $scope.tpassRepeat = true;
        $scope.bind = { id: '' };

        $scope.init = function() {
            PrivateService.getSettings()
                .then((response) => {
                    if(response.success) {
                        $scope.setting = response.data;
                    }
                });
        }
        $scope.init();


        var vm = this;

        // // Variables to check actions
        // vm.code_sent=false;
        // $scope.bind = { id: '', secret: ''};
        // $scope.change = { id: '', secret: ''};
        // $scope.error = { email: false };
        // $scope.doubleCheck = { email: true, verify: false };
        // $scope.updateEmail = { response: true, check: true };

        // // Functions that check users actions
        // vm.checkCode = function() {
        //   $scope.error_message = "";
        //   vm.code_valid = Util.checkCode(vm.secret);
        // };
        // vm.checkingEmail = function(email) {
        //   vm.email_valid = Util.checkMail(email);
        //   $scope.error.email = (vm.email_valid || email == undefined) ? false : true;
        // };
        // vm.doubleCheckEmail = function(email1, email2) {
        //   $scope.doubleCheck.email = (email1 == email2 || email2 == undefined) ? true : false;
        //   $scope.doubleCheck.verify = ($scope.doubleCheck.email == true && email2 != undefined) ? true: false;
        // };

        // 检测两次password是否相等
        $scope.$watchGroup(['formData.tpass', 'formData.tpass_re'], function() {
            if($scope.formData.tpass != '' && $scope.formData.tpass_re != '') {
                if($scope.formData.tpass===$scope.formData.tpass_re) {
                    $scope.tpassRepeat = true;
                } else {
                    $scope.tpassRepeat = false;
                }
            } else {
                $scope.tpassRepeat = true;
            }
        })


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


        // Catalog of functions
        $scope.askBind = askBind;
        $scope.answerBind = answerBind;


        //----------- BIND EMAIL ------------------------->
        function askBind() {
            $scope.code_sending = true;
            // call authenticatication to ask for code
            ($scope.setting.tpass == false ? AuthenticationService.AskTPass() : AuthenticationService.askResetTpass())
                .then(function(response) {
                    $scope.code_sending = false;
                    if (response.success) {
                        // collect api id for code
                        $scope.bind.id = response.data.id;
                        FlashService.Toast('VALID_MESSAGE_SETSUCCESS', 'info');
                        vm.code_sent=true;
                        Counter();
                    } else {
                        FlashService.Toast('VALID_MESSAGE_ERROR', 'error');
                    }
                });
        }; // end askBind

        function answerBind() {
            $scope.submit_sending = true;
            // call authenticatication for Answer
            AuthenticationService.answerVerification({id: $scope.bind.id, verificationCode: $scope.formData.secret.toString()})
                .then(function(response) {
                    if(response.success) {
                        // Finally call PrivateService to send new tpass with valid token
                        ( $scope.setting.tpass == false ? PrivateService.setTpass(response.data.token, $scope.formData.tpass)
                            : PrivateService.resetTpass(response.data.token, $scope.formData.tpass))
                            .then(function(res) {
                                $scope.submit_sending = false;
                                if(res.success) {
                                    FlashService.Toast('MESSAGE.TPASS_CHANGED', 'success');
                                    history.go(-1);
                                } else {
                                    FlashService.Toast('MESSAGE.TPASS_CHANG_FILED', 'error');
                                    vm.code_sent=false;
                                    cancelCount();
                                }
                            });
                    } else {
                        FlashService.Toast('MESSAGE.ERR_AUTH_ANSWER_REJECTED', 'error');
                        vm.code_sent=false;
                        $scope.submit_sending = false;
                        cancelCount();
                    }
                });
        };

        // var vm = this;

        // (function(){
        // 	PrivateService.getSettings()
        //     	.then(function(response) {
        // 			$scope.settings = response.data;
        //       });

        //   })();

        //   $scope.doubleCheck = { password: true, verify: false };
        //   $scope.submit_sending = false;


        //   $scope.PasswordHasStandards = PasswordHasStandards;

        //  vm.tpass = tpass;

        //  vm.doubleCheckPassword = function(psw1, psw2) {
        // $scope.doubleCheck.password = (psw1 == psw2 || psw2 == undefined) ? true : false;
        //    $scope.doubleCheck.verify = ($scope.doubleCheck.password == true &&
        //                                 psw1!='' &&
        //                                 psw2!='' &&
        //                                 psw1!=undefined &&
        //                                 psw2!=undefined) ? true: false;
        //    console.log($scope.checkTrading);
        //  };

        //  function PasswordHasStandards(pwd){
        //    $scope.error_password=(Util.checkPassword(pwd).length)?Util.checkPassword(pwd)[0]:null;
        //  };

        //   function tpass() {
        //     if(!Util.checkPassword(vm.newPassword).length) {
        //       $scope.submit_sending = true;
        //       if(!$scope.settings.tpass) {
        //         PrivateService.createTpass(vm.oldPassword, vm.newPassword)
        //         	.then((response) => {
        //             $scope.submit_sending = false;
        //             if (response.success)
        //               FlashService.Toast('MESSAGE.PASSWORD_CHANGED', 'success', '/logout');
        //             else
        //               FlashService.Toast('MESSAGE.ERR_CHANGE_PASSWORD', 'errror');
        //           });
        //       } else {
        //         PrivateService.changeTpass(vm.oldPassword, vm.newPassword)
        //           .then( (response) => {
        //             $scope.submit_sending = false;
        //             if (response.success)
        //               FlashService.Toast('MESSAGE.PASSWORD_CHANGED', 'success', '/logout');
        //             else
        //               FlashService.Toast('MESSAGE.ERR_CHANGE_PASSWORD', 'errror');
        //           });
        //       }
        //     } else {
        //       Util.checkPassword(vm.newPassword).map( (item) => FlashService.Toast(item,'error') );
        //     }

        //   } // end password

    }


    function AuthenticatorController(PrivateService, $scope, FlashService, $translate) {
        var vm = this;
        vm.authenticator = authenticator;
        $scope.settings = {};
        $scope.qr_created = false;
        $scope.create = {};
        $scope.enable = {};

        (function(){
            PrivateService.getSettings()
                .then(function(response) {
                    $scope.settings = response.data;
                });
        })();

        $scope.createTfa = function() {
            PrivateService.createTfa()
                .then(function(response) {
                    $scope.qr_created = true;
                    $scope.create = response.data;
                });
        };

        $scope.enableTfa = function(code) {
            PrivateService.enableTfa(code)
                .then(function(response) {
                    if(response.success) {
                        $scope.enable = response.data;
                        FlashService.Toast('MESSAGE.SUCCESS_2FACTOR', 'success', '/logout');
                    } else {
                        FlashService.Toast('MESSAGE.ERROR_2FACTOR', 'error');
                    }
                });
        };

        $scope.deleteTfa = function(code) {
            PrivateService.deleteTfa(code)
                .then(function(response) {
                    console.log(response);
                    if(response.success) {
                        FlashService.Toast('MESSAGE.SUCCESS_2FACTOR', 'success', '/logout');
                    } else {
                        FlashService.Toast('MESSAGE.ERROR_2FACTOR', 'error');
                    }
                });
        };

        function authenticator() {
        } // end authenticator


    } // end AuthenticatorController



    // need to re-evaluate variables
    function IdController(PrivateService, FlashService, SinaPayService, $scope, $cookies ,$http, $stateParams, $rootScope, $location, $q) {
        var vm = this;

        vm.loading={};

        var origin = $rootScope.origin;
        if(origin){
            switch(origin.target){
                case 'withdrawal-fiat':
                    vm.target_level=2;
                    vm.target='/account/fiat/withdrawal/'+origin.currency+'/bank';
                    break;
                case 'deposit-fiat':
                    vm.target_level=1;
                    vm.target='/account/fiat-deposit/'+origin.currency+'/offline';
                    break;
                case 'deposit-digital':
                    vm.target_level=1;
                    vm.target='/account/digital-deposit/'+origin.currency;
                    break;
                case 'withdrawal-digital':
                    vm.target_level=2;
                    vm.target='/account/digital-withdrawal'+origin.currency;
                    break;
            }
        }
        $rootScope.origin={};

        PrivateService.getSettings()
            .then(function(settings){
                vm.level=settings.data.kyc_level;
            });


        function FindActiveMember() {
            return $q((resolve, reject)=> {
                SinaPayService.querySinaInfo({})
                    .then((_)=>{
                        if(_.success)
                            resolve(_.data);
                        else
                            reject(Error('ERR_FIND_ACTIVE_MEMEBER'));
                    });
            });
        }


        function RealNameAuthentication() {
            return $q((resolve, reject)=> {
                var params = {realName: vm.name, identityCard: vm.document_number};
                SinaPayService.realNameAuthentication(params)
                    .then((_)=>{
                        if(_.success)
                            resolve(_);
                        else
                            reject(Error('ERR_REAL_NAME_AUTHENTICATION'));
                    });
            });
        }

        function CreateActiveMember(data) {
            return $q((resolve, reject)=> {
                if(data.length==0 || data[0].is_create_member!=1){

                    SinaPayService.create_activate_member({})
                        .then((innerData)=>{
                            if(innerData.success)
                                resolve(innerData);
                            else
                                reject(Error('ERR_CREATE_ACTIVE_MEMBER_FAILED'));
                        });
                }else{
                    resolve();
                }
            });
        }

        function OhNo(){
            FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error');
            Loading(false);
        }

        function Success(){
            vm.level++;
            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success');
            Loading(false);
        }

        function Loading(state){
            return $q((resolve)=>{
                vm.loading.level_1=state;
                vm.loading.level_2=state;
                resolve();
            });
        }

        PrivateService.KycBasicInfo(vm.name,vm.document_type,vm.document_number)
            .then(function(data) {
                console.log(data);
            }, function(error) {
                console.log(error);
            })

        //initialize?
        //(()=>FindActiveMember())();

        vm.completeOne = function(){

            vm.loading.level_1=true;

            if(vm.document_type == "ID") {
                Loading(true)
                    .then(FindActiveMember)
                    .then(CreateActiveMember)
                    .then(RealNameAuthentication)
                    .then(Success)
                    .catch(OhNo);
            } else {
                PrivateService.KycBasicInfo(vm.name,vm.document_type,vm.document_number)
                    .then(function(){
                        return PrivateService.KycLevelUp(1);
                    })
                    .then(function(){
                        vm.loading.level_1=false;
                        if(vm.target&&vm.target_level==1)
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success', '/setting/amenu');
                        else{
                            vm.level++;
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success');
                        }
                    }, (error)=>{
                        vm.loading.level_1=false;
                        FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error');
                    });
            }
        };

        vm.completeTwo = function(){
            PrivateService.KycLevelUp(2)
                .then(function(response){
                    if(response.success){
                        if(vm.target&&vm.target_level==2)
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success', '/setting/amenu');
                        else
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success', '/setting/amenu');
                    } else{
                        FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error');
                    }
                }, (error) => FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error'));
        };

        $scope.uploaded = {
            "face": false,
            "front" : false,
            "back": false
        };
        $scope.uploading={};

        $scope.uploadFile = function(files,type) {
            $scope.uploading[type]=true;
            var fd = new FormData();
            fd.append("file", files[0], files[0].name);
            $http.post(PrivateService.SERVER + 'kyc/upload/'+type, fd, {
                headers: {'Content-Type': undefined, "x-access-token": $rootScope.globals.token },
                transformRequest: angular.identity
            }).then(function(r){
                if(r.data && r.data.status && r.data.status.success){
                    $scope.uploading[type]=false;
                    $scope.uploaded[type]=true;
                } else{
                    $scope.uploading[type]=false;
                    FlashService.Toast('MESSAGE.ERR_UPLOAD_IMAGE', 'error');
                }
            }, (error)=>{
                $scope.uploading[type]=false;
                FlashService.Toast('MESSAGE.ERR_UPLOAD_IMAGE', 'error');
            });

        };

    } // end IdController


    function ApiController(PrivateService, $scope, $translate, FlashService, Util) {
        var vm = this;
        vm.api = api;

        $scope.api = { needPost: false, haveGet: false};
        $scope.result = {apikey: '', signature: ''};
        $scope.validTpassReponse = false;
        $scope.showTpass = false;
        $scope.hideTpassInput = false;

        (function(){
            PrivateService.getSettings()
                .then((response)=> {
                    $scope.settings = response.data;
                    if($scope.settings.tpass) {
                        $scope.showTpass = true;
                        $scope.showGet = true;
                        FlashService.Toast("MESSAGE.ERR_GET_API", "info");
                    } else {
                        api();
                        $scope.showTpass = true;
                        $scope.hideTpassInput = true;
                    }
                    Util.init(vm);
                });
        })();

        $scope.postApi = function() {
            $scope.submit_sending = true;
            if(!$scope.settings.tpass || $scope.validTpassReponse) {
                $scope.validTpassReponse = false;
                PrivateService.postApi($scope.tpass)
                    .then(function(response) {
                        if(response.success) {
                            $scope.tpass = undefined;
                            $scope.submit_sending = false;
                            $scope.api.needPost=true;
                            $scope.result.apikey = response.data.apikey;
                            $scope.result.signature = response.data.signature;
                        } else {
                            FlashService.Toast('MESSAGE.ERR_TPASS_WRONG', 'error');
                            $scope.submit_sending = false;
                        }
                    });
            } else {
                $scope.validTpassReponse = true;
                $scope.postApi();
            }
        };

        function api() {
            PrivateService.getApi($scope.tpass)
                .then(function(response) {
                    $scope.api.haveGet = (response.success) ? true : false;
                    if($scope.api.haveGet) {
                        $scope.tpass = undefined;
                        $scope.result.apikey = response.data.apikey;
                        $scope.result.signature = response.data.signature;
                    } else {
                        // FlashService.Toast('SETTING.ERROR', 'info');
                        $scope.showGet = false;
                    }
                });
        }


        $scope.getApi = function() {
            PrivateService.getApi($scope.tpass)
                .then(function(response) {
                    $scope.api.haveGet = (response.success) ? true : false;
                    if($scope.api.haveGet) {
                        $scope.tpass = undefined;
                        $scope.result.apikey = response.data.apikey;
                        $scope.result.signature = response.data.signature;
                        $scope.showGet = false;
                    } else {
                        FlashService.Toast('MESSAGE.ERR_TPASS_WRONG', 'error');
                    }
                });
        };

    } // ApiController

    // C1
    function C1Controller(SinaPayService, PrivateService, $scope, $translate, FlashService, Util, $q) {
        // 表单数据
        $scope.formData = {}
        $scope.loading = false;

        // 是否验证通过
        $scope.verifyedIdNo = undefined;
        // setting
        PrivateService.getSettings()
            .then(function(settings){
                $scope.level=settings.data.kyc_level;
                if($scope.level!=0) history.go(-1);
            });

        function FindActiveMember() {
            return $q((resolve, reject)=> {
                SinaPayService.querySinaInfo({})
                    .then((_)=>{
                        console.log(_);
                        // resolve(_.data);
                        if(_.success)
                            resolve(_.data);
                        else
                            reject(Error('ERR_FIND_ACTIVE_MEMEBER'));
                    });
            });
        }

        $scope.IdTypeChange = function() {
            if($scope.verifyedIdNo!==undefined) {
                $scope.verifyedIdNo = $scope.verifyIdNo();
            }
        }

        $scope.IdNoChange = function() {
            $scope.verifyedIdNo = $scope.verifyIdNo();
        }

        $scope.verifyIdNo = function() {
            switch($scope.formData.id_type) {
                case 'ID':
                    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test($scope.formData.id_no)
                    break;
                case 'PASSPORT':
                    return  /^[a-zA-Z]{5,17}$/.test($scope.formData.id_no) || /^[a-zA-Z0-9]{5,17}$/.test($scope.formData.id_no);
                case 'OTHER':
                    return $scope.formData.id_no && $scope.formData.id_no.length > 0;
                default:
                    return false;
            }
        }

        function RealNameAuthentication() {
            return $q((resolve, reject)=> {
                var params = {realName: $scope.formData.name, identityCard: $scope.formData.id_no};
                SinaPayService.realNameAuthentication(params)
                    .then((_)=>{
                        if(_.success)
                            resolve(_);
                        else
                            reject(Error('ERR_REAL_NAME_AUTHENTICATION'));
                    });
            });
        }

        function CreateActiveMember(data) {
            return $q((resolve, reject)=> {
                if(data.length==0 || data[0].is_create_member!=1){
                    SinaPayService.create_activate_member({})
                        .then((_)=>{
                            if(_.success)
                                resolve(_);
                            else
                                reject(Error('ERR_CREATE_ACTIVE_MEMBER_FAILED'));
                        });
                }else{
                    resolve();
                }
            });
        }

        function OhNo(){
            $scope.loading = false;
            FlashService.Toast('MESSAGE.ERR_ID_CARD', 'error');
        }

        function Success(){
            $scope.loading = false;
            FlashService.Toast('MESSAGE.SUC_KYC_C1_STATUS_UPDATEED', 'success');
        }

        $scope.completeOne = function(){
            $scope.loading = true;
            if($scope.formData.id_type == "ID") {
                FindActiveMember()
                    .then(data => {
                        if(data.length==0) {
                            return CreateActiveMember(data)
                                .then(() => RealNameAuthentication());
                        } else {
                            return RealNameAuthentication();
                        }
                    })
                    .then(Success)
                    .catch(OhNo);
            } else {
                PrivateService.KycBasicInfo($scope.formData.name,$scope.formData.id_type,$scope.formData.id_no)
                    .then(function(){
                        return PrivateService.KycLevelUp(1);
                    })
                    .then(function(){
                        $scope.loading = false;
                        FlashService.Toast('MESSAGE.SUC_KYC_C1_STATUS_UPDATEED', 'success');
                        history.go(-1);
                    }, (error)=>{
                        $scope.loading = false;
                        FlashService.Toast('MESSAGE.ERR_ID_CARD', 'error');
                    });
            }
        }
    }

    // C2
    function C2Controller(SinaPayService, PrivateService, $scope, $translate, FlashService, Util, $cookies ,$http, $stateParams, $rootScope, $location, $q) {
        var vm = this;

        vm.loading={};

        // var origin = $rootScope.origin;
        // if(origin){
        //   switch(origin.target){
        //   case 'withdrawal-fiat':
        //     vm.target_level=2;
        //     vm.target='/account/fiat/withdrawal/'+origin.currency+'/bank';
        //     break;
        //   case 'deposit-fiat':
        //     vm.target_level=1;
        //     vm.target='/account/fiat-deposit/'+origin.currency+'/offline';
        //     break;
        //   case 'deposit-digital':
        //     vm.target_level=1;
        //     vm.target='/account/digital-deposit/'+origin.currency;
        //     break;
        //   case 'withdrawal-digital':
        //     vm.target_level=2;
        //     vm.target='/account/digital-withdrawal'+origin.currency;
        //     break;
        //   }
        // }
        // $rootScope.origin={};

        PrivateService.getSettings()
            .then(function(settings){
                vm.level=settings.data.kyc_level;
                if(vm.level!=1) history.go(-1);
            });

        // 获取level1认证信息
        PrivateService.KycInfo()
            .then(function(data) {
                console.log(data);
                if(data.data) {
                    console.log(data);
                    $scope.kycInfo = data.data;
                }
            })

        // 注册change
        document.querySelector('#upload_face').onchange = function() { $scope.uploadFile(this.files, 'face') }
        document.querySelector('#upload_front').onchange = function() { $scope.uploadFile(this.files, 'front') }
        document.querySelector('#upload_back').onchange = function() { $scope.uploadFile(this.files, 'back') }

        $scope.selectPic = function(type) {
            if($scope.uploading[type]) return;
            document.querySelector('#upload_' + type).click();
        }


        vm.completeTwo = function(){
            PrivateService.KycLevelUp(2)
                .then(function(response){
                    if(response.success){
                        if(vm.target&&vm.target_level==2){
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success');
                            history.go(-1);
                        }
                        else{
                            FlashService.Toast('MESSAGE.SUC_KYC_STATUS_UPDATEED', 'success');
                            history.go(-1);
                        }
                    } else{
                        FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error');
                    }
                }, (error) => FlashService.Toast('MESSAGE.ERR_UNABLE_TO_SUBMIT', 'error'));
        };

        $scope.uploaded = {};
        $scope.uploading={};

        $scope.uploadFile = function(files,type) {

            var canvas = document.querySelector('#canvas_' + type);
            var ctx=canvas.getContext("2d");
            var img = new Image();
            img.src = window.URL.createObjectURL(files[0]);
            img.onload = function(e) {
                window.URL.revokeObjectURL(this.src);
                ctx.drawImage(img,0,0,canvas.width,canvas.height);
            }

            $scope.uploading[type]=true;
            var fd = new FormData();
            fd.append("file", files[0], files[0].name);
            $http.post(PrivateService.SERVER + 'kyc/upload/'+type, fd, {
                headers: {'Content-Type': undefined, "x-access-token": $rootScope.globals.token },
                transformRequest: angular.identity
            }).then(function(r){
                if(r.data && r.data.status && r.data.status.success){
                    $scope.uploading[type]=false;
                    $scope.uploaded[type]=true;
                } else{
                    $scope.uploading[type]=false;
                    $scope.uploaded[type]=false;
                    FlashService.Toast('MESSAGE.ERR_UPLOAD_IMAGE', 'error');
                }
            }, (error)=>{
                $scope.uploading[type]=false;
                $scope.uploaded[type]=false;
                FlashService.Toast('MESSAGE.ERR_UPLOAD_IMAGE', 'error');
            });
        }
    }

    function keyController($http,$scope, PrivateService,AuthenticationService, UserTokenService, $location,$cookies,FlashService) {
      $scope.isshow=false;
      $scope.errorpwd = false;
      $scope.loading = false;

      // $scope.isBackUp={
      //      set:false
      //   }
        $scope.googlekey="";
        $scope.data={
            step:'1'
        }
        $scope.remark=function (param) {
            $scope.data.step=param;
        }
        $scope.params={
            user_password:"",
            google_code:''
        }
        getCode();
        function getCode () {
            PrivateService.googleCodeget()
              .then((response) => {
                  if(response.success) {
                     $scope.google_key=response.data.secret_key;
                  }
              });
        }
        $scope.googleSubmit=function () {
            $scope.loading = true;
            PrivateService.googleCodeset($scope.params.user_password,$scope.google_key,$scope.params.google_code)
                .then((response) => {
                    $scope.loading = false;
                    if(response.success) {
                        FlashService.Toast("SET.SUCCESS", 'success');
                        $location.path('/setting/menu');
                    }else {
                        if(response.message=="ERR_LOGIN_PASSWORD") {
                            FlashService.Toast("ERR_LOGIN_PASSWORD", 'error');
                        }
                        else if(response.message=="ERR_CREDENTIALS"){
                            FlashService.Toast("ERR_CREDENTIALS", 'error');
                        }
                        else if(response.message=="ERR_AUTH_FAILED"){
                            FlashService.Toast("ERR_AUTH_FAILED", 'error');
                        }
                    }
                });
        }
        $scope.getpassword = function(){
            $scope.errorpwd = false;
        }

    }
    function LoginSafeController(PrivateService, $scope, $translate, FlashService, Util,$location,$rootScope) {
        $scope.buttondefault=false;

        $scope.radioClick=function () {
            $scope.buttondefault=true;
        }
        $scope.secSubmit=function() {

            PrivateService.setSecurity(0,$scope.security)
                .then((response) => {
                    if(response.success==1) {
                        FlashService.Toast("SET.SUCCESS", 'success');
                        $location.path('/setting/menu');
                    }else  {
                        if(response.message=="TAC_UPDATE_ERR") {
                            FlashService.Toast("TAC_UPDATE_ERR", 'error');
                        }
                        else if(response.message=="ERR_CREATE_TAC") {
                            FlashService.Toast("ERR_CREATE_TAC", 'error');
                        }else if(response.message=="SECRET_NOT_EXITS") {
                            FlashService.Toast("SECRET_NOT_EXITS", 'error');
                        }else if(response.message=="PHONE_NOT_EXITS") {
                            FlashService.Toast("PHONE_BIND_WARN", 'error');
                            if($scope.verify.LOGIN.safety_way) {
                                $scope.security=$scope.verify.LOGIN.safety_way;
                            }
                            else {
                                $scope.security=9;
                            }
                        }else if(response.message=="EMAIL_NOT_EXITS"){
                            if($scope.verify.LOGIN.safety_way!=null){
                                $scope.security=$scope.verify.LOGIN.safety_way;
                            }else {
                                $scope.security=9;
                            }
                            FlashService.Toast("EMAIL_BIND_WARN", 'error');
                        }
                    }
                });
        }

        //获取安全验证方式
        $scope.initVerifys = function() {
            console.log($rootScope._username)
            if($rootScope._username) {
                PrivateService.getSafetySettings(1)
                    .then((response) => {
                        $scope.verify=response.data;
                    });
            }
        }
        $scope.initVerifys();

    }
    function TradeSafeController(PrivateService, $scope, $translate, FlashService, Util,$location,$rootScope) {
        $scope.buttondefault=false;

        $scope.radioClick=function () {
            $scope.buttondefault=true;
        }
        $scope.secSubmit=function() {
            PrivateService.setSecurity(1,$scope.security)

                .then((response) => {
                    if(response.success==1) {
                        FlashService.Toast("SET.SUCCESS", 'success');
                        $location.path('/setting/menu');
                    }else  {
                        if(response.message=="TAC_UPDATE_ERR") {
                            FlashService.Toast("TAC_UPDATE_ERR", 'error');
                        }
                        else if(response.message=="ERR_CREATE_TAC") {
                            FlashService.Toast("ERR_CREATE_TAC", 'error');
                        }else if(response.message=="SECRET_NOT_EXITS") {
                            FlashService.Toast("SECRET_NOT_EXITS", 'error');
                        }else if(response.message=="PHONE_NOT_EXITS") {
                            FlashService.Toast("PHONE_BIND_WARN", 'error');
                            if($scope.verify.TRANS.safety_way) {
                                $scope.security=$scope.verify.TRANS.safety_way;
                            }else {
                                $scope.security=9;
                            }
                        }
                    }
                });
        }
        //获取安全验证方式
        $scope.initVerifys = function() {
            console.log($rootScope._username)
            if($rootScope._username) {
                PrivateService.getSafetySettings(1)
                    .then((response) => {
                        $scope.verify=response.data;
                    });
            }
        }
        $scope.initVerifys();
    }
    function WithdrawSafeController(PrivateService, $scope, $translate, FlashService, Util,$location,$rootScope) {
        $scope.buttondefault=false;

        $scope.radioClick=function () {
            $scope.buttondefault=true;

        }

        $scope.defaultSelect=1;
        //获取安全验证方式
        $scope.initVerifys = function() {
            console.log($rootScope._username)
            if($rootScope._username) {
                PrivateService.getSafetySettings(1)
                    .then((response) => {
                    $scope.verify=response.data;
                    if($scope.verify.WITHDRAW.safety_way==null) {
                        if($scope.settings.phone) {
                            $scope.defaultSelect=2;
                        }
                        if(!$scope.settings.phone&&$scope.settings.email) {
                            $scope.defaultSelect=1
                        }
                    }else {
                        $scope.defaultSelect=$scope.verify.WITHDRAW.safety_way;
                    }
                    $scope.security=$scope.defaultSelect;
                });
            }
        }


        PrivateService.getSettings().then(function (response) {
            $scope.settings = response.data;
            $scope.initVerifys();

        });

        $scope.secSubmit=function() {
            PrivateService.setSecurity(2,$scope.security)
                .then((response) => {
                    if(response.success==1) {
                        FlashService.Toast("SET.SUCCESS", 'success');
                        $location.path('/setting/menu');
                    }else  {
                        if(response.message=="TAC_UPDATE_ERR") {
                            FlashService.Toast("TAC_UPDATE_ERR", 'error');
                        }
                        else if(response.message=="ERR_CREATE_TAC") {
                            FlashService.Toast("ERR_CREATE_TAC", 'error');
                        }else if(response.message=="SECRET_NOT_EXITS") {
                            if($scope.verify.WITHDRAW.safety_way!=null){
                                $scope.security=$scope.verify.WITHDRAW.safety_way;
                            }else {
                                $scope.security=$scope.defaultSelect
                            }
                            FlashService.Toast("SECRET_NOT_EXITS", 'error');
                        }else if(response.message=="PHONE_NOT_EXITS") {
                            if($scope.verify.WITHDRAW.safety_way!=null){
                                $scope.security=$scope.verify.WITHDRAW.safety_way;
                            }else {
                                $scope.security=$scope.defaultSelect;
                            }
                            FlashService.Toast("PHONE_BIND_WARN", 'error');
                        }else if(response.message=="EMAIL_NOT_EXITS"){
                            if($scope.verify.WITHDRAW.safety_way!=null){
                                $scope.security=$scope.verify.WITHDRAW.safety_way;
                            }else {
                                $scope.security=$scope.defaultSelect
                            }
                            FlashService.Toast("EMAIL_BIND_WARN", 'error');
                        }
                    }
                });
        }
    }
})();

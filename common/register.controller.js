(function () {
    'use strict';

    angular.module('app')
        .controller('ResetPasswordController', ResetPasswordController)
        .controller('RegisterController', RegisterController)
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
        }])
				.directive('clickAndDisable', function() {
					return {
						scope: {
							clickAndDisable: '&'
						},
						link: function(scope, iElement, iAttrs) {
							iElement.bind('click', function() {
								iElement.prop('disabled',true);
								scope.clickAndDisable().finally(function() {
									iElement.prop('disabled',false);
								})
							});
						}
					};
				})
    //RegisterController
    function RegisterController($scope,$cookies,$translate, AuthenticationService, PrivateService, RegisterService, $interval, $location, ngDialog,FlashService) {
				$scope.isshow = true;
        $scope.loading = false;
        $scope.params = {};
        $scope.errorInviterId=false;
				if(!$scope.language) {
					$scope.language = $translate.use();
				}
        $scope.getParams = function() {
          var tempArr = window.location.hash.split('?');
          var str = tempArr[1];
          str = decodeURI(str);
          var params = {};
          params._url = tempArr[0];
          if(!str) { return params; }
          var arr = str.split('&');
          if(arr.length == 0) { return params;}
          else {
            for(var i = 0; i<arr.length; i++) {
              var temp = arr[i].split('=');
              if(temp.length == 2) {
                params[temp[0]] = temp[1];
              }
            }
            return params;
          }
        }

        $scope.urlParams = $scope.getParams();
        if(parseInt($scope.urlParams.recommended) > 0) {
            $scope.urlParams.recommended = parseInt($scope.urlParams.recommended);
            $scope.params.recommended = $scope.urlParams.recommended;
        }

        //$scope.params.ischecked = true;
        //初始化代码
        $scope.init = function () {
            RegisterService.askRegister().then(function (res) {
                if (res.success) {
                    var SERVER = AuthenticationService.SERVER + 'captcha/';
                    $scope.imageUrl = SERVER + res.data.parameter;
                    $scope.params.id = res.data.id;
                } else {
                    console.log(res.message);
                }
            }, function (res) {
                console.log(res.message);
            })
        };
        $scope.init();

        //点击获取验证码
        $scope.getImages = function () {
            $scope.init();
            $scope.params.secret = '';
        };

        //预验证图片码
        $scope.getVerifyImage = function () {
            if ($scope.params.secret.length < 5) {
                // $scope.errormsg = true;
                return;
            }
            AuthenticationService.Answer($scope.params).then(function (res) {
                $scope.errormsg = false;
                if (res.success) {
                    $scope.errormsg = false;
                    $scope.params.authtoken = res.data.token;
                    if ($scope.params.username && $scope.myForm.username.$valid) {
                        $scope.checkUsername();
                    }
                } else {
                    if (res.message == "ERR_AUTH_ANSWER_REJECTED") {
                        $scope.errormsg = true;
                    }
                    // $scope.init();
                    $scope.isshow = true;
                }
            })
        };

        //检查手机号码是否注册
        $scope.getusername = function () {
            if ($scope.params.username && $scope.myForm.username.$valid) {
                $scope.init();
                $scope.errorusername = false;
            }
        };
        $scope.checkUsername = function () {
            PrivateService.checkUserName($scope.params).then(function (res) {
                if (res.success) {
                    $scope.myForm.username.$valid = true;
                    $scope.isshow = false;
                } else {
                    $scope.errorusername = true;
                    $scope.myForm.code.$valid = true;
                }
            }, function (res) {
                console.log(res.message);
            });
        };

        //获取手机验证码
        $scope.getVerifyCode = function () {
            $scope.errorVcode = false;
            $scope.myForm.vcode.$valid  = true;

            if(!$scope.params.username){
                return;
            }
            PrivateService.checkUserName($scope.params).then(function (res) {
                if (res.success) {
                    $scope.myForm.username.$valid = true;
                    $scope.isshow = true;
                    setTimeInterval();
                    RegisterService.askVerification($scope.params).then(function (res) {
                        if (res.success) {
                            $scope.params.id = res.data.id;
                            FlashService.Toast("VALID_MESSAGE_SETSUCCESS", 'success');
                        } else {
                            $scope.isshow = true;
                            if (res.message == "ERR_AUTH_ANSWER_REJECTED") $scope.errorVcode = true;
                        }
                    }, function (res) {
                        console.log(res.message);
                    });
                } else {
                    $scope.errorusername = true;
                    $scope.myForm.code.$valid = true;
                }
            }, function (res) {
                console.log(res.message);
            });
        };

        //预验证手机验证码
        $scope.getVerifyphoneCode = function () {
            if ($scope.params.verificationCode.length < 6) {
                $scope.errorVcode = true;
                return;
            }
            AuthenticationService.answerVerification($scope.params).then(function (res) {
                if (res.success) {
                    $scope.errorVcode = false;
                    $scope.params.authtoken = res.data.token;
                } else {
                    if (res.message == "ERR_AUTH_ANSWER_REJECTED") $scope.errorVcode = true;
                }
            }, function (res) {
                console.log(res.message);
            });

        };

        //创建或者注册用户
        $scope.greatAccount = function () {
            PrivateService.registerUser($scope.params).then(function (res) {
                $scope.loading = false;
                if (res.success) {
                    $location.path('/login');
										FlashService.Toast("REGISTER.SUCCESS", 'success');
                }else{
                     FlashService.Toast("LOGIN.ERROR", 'error');
                }
            });
        };


        //验证码倒计时
        $scope.text = '獲取驗證碼';
        $scope.en_text = 'request code';
        function setTimeInterval() {
            $scope.countDown = 60;
            // debugger
            var seq = $interval(function () {
                $scope.isshow = true;
                $scope.countDown--;
                $scope.text = $scope.countDown + " 's";
                $scope.en_text = $scope.countDown + " 's";
                if ($scope.countDown <= 0) {
                    clearTime(seq);
                }
            }, 1000);
        }


        function clearTime(time) {
            $interval.cancel(time);
            $scope.isshow = false;
            $scope.countDown = '';
            $scope.text = '獲取驗證碼';
            $scope.en_text = 'request code';
        }


        //去除空格的方法验证
        $scope.getpassword = function () {
            if (/\s/.test($scope.params.password)) {
                $scope.passworderror = true;
            } else {
                $scope.passworderror = false;
            }
        };

        $scope.openComponentModal = function () {
            ngDialog.open({
                templateUrl: 'myModalContent',
                width:800,
                controller: function ($scope) {
                    $scope.modelcancel = function () {
                        $scope.closeThisDialog();
                    }
                }
            });
        };

    }


    //ResetPasswordController
    function ResetPasswordController($scope,$translate, AuthenticationService,FlashService, $interval, $location, PrivateService) {
        $scope.isshow = true;
				$scope.language = $translate.use();
        $scope.step = 1;
        $scope.params = {};
				$scope.data = {};
        $scope.errorIdtype = false;
        //初始化代码
        $scope.init = function () {
            AuthenticationService.Ask('HUMAN').then(function (res) {
                if (res.success == true) {
                    var SERVER = AuthenticationService.SERVER + 'captcha/';
                    $scope.imageUrl = SERVER + res.data.parameter;
                    $scope.params.id = res.data.id;
                } else {
                    console.log(res.message);
                }
            });
        };
        $scope.init();

        //点击获取验证码
        $scope.getImages = function () {
            $scope.init();
            $scope.params.secret = '';
        };

        //预验证图片码
        $scope.getVerifyImage = function () {
            if ($scope.params.secret.length < 5) {
                $scope.myForm.code.$valid = false;
                return;
            }
            AuthenticationService.Answer($scope.params).then(function (res) {
                $scope.errormsg = false;
                if (res.success) {
                    $scope.errormsg = false;
                    $scope.params.authtoken = res.data.token;
                    if ($scope.params.username && $scope.myForm.username.$valid) {
                        $scope.checkUsername();
                    }
                } else {
                    if (res.message == "ERR_AUTH_ANSWER_REJECTED") $scope.errormsg = true;
                    // $scope.init();
                    $scope.isshow = true;
                }
            })
        };

        //检查手机号码是否注册
        $scope.getusername = function () {
            $scope.errorusername = false;
            $scope.myForm.code.$valid = true;
            if ($scope.params.username && $scope.myForm.username.$valid) {
                $scope.init();
            }
        };
        $scope.checkUsername = function () {
            PrivateService.checkUserName($scope.params).then(function (res) {
                if (res.success) {
                    $scope.errorusername = true;
                    $scope.myForm.code.$valid = true;
                } else {
                    $scope.myForm.username.$valid = true;
                    $scope.isshow = false;
                }
            });
        };


        //获取手机验证码
        $scope.getVerifyCode = function () {
            //验证用户是否注册，已注册return
            $scope.params.humantoken = $scope.params.authtoken;
            if ($scope.params.humantoken) {
                setTimeInterval();
                $scope.params.request_type = 'FORGO';
                AuthenticationService.askVerification($scope.params).then(function (res) {
                    if (res.success) {
                        //获取状态
                        $scope.params.id = res.data.id;
                    } else {
                        if (res.message == "ERR_AUTH_ANSWER_REJECTED") $scope.errorVcode = true;
                    }
                });
            }
            return false;
        };
				
        //预验证手机验证码
        $scope.getVerifyphoneCode = function () {
						$scope.date = $scope.params;
            $scope.data.secret = $scope.params.verificationCode;
						$scope.data.id = $scope.params.id;
						$scope.data.username = $scope.params.username;
						$scope.data.verificationCode = $scope.params.verificationCode;
						$scope.data.authtoken = $scope.params.authtoken;
            if ($scope.params.verificationCode.length==6) {
                AuthenticationService.Answer($scope.data).then(function (res) {
                    if (res.success) {
												$scope.errorVcode = false;
                        $scope.params.authtoken = res.data.token;
                        //$scope.getUserIDstatus();
                    } else {
                        if (res.message == "ERR_AUTH_ANSWER_REJECTED")
                            $scope.errorVcode = true;
                    }
                });
            }
        };

        //获取身份证件类型的状态
        //$scope.getUserIDstatus = function () {
        //    PrivateService.getUserID($scope.params).then(function (res) {
        //        if (res.success) {
        //            $scope.errorVcode = false;
        //            $scope.params.id_type = res.data;
        //            if ($scope.params.id_type == 'ID') {
        //                $scope.params.have_type = '身份证';
        //            } else if ($scope.params.id_type == 'PASSPORT') {
        //                $scope.params.have_type = '护照';
        //            } else if ($scope.params.id_type == 'OTHER') {
        //                $scope.params.have_type = '军人证';
        //            }
        //        }
        //    }, function (res) {
        //        console.log(res);
        //    });
        //};


        //重置密码提交
        $scope.reserPassword = function () {
            PrivateService.resetpwd($scope.params).then(function (res) {
                if (res.success) {
                    FlashService.Toast("COMMON.PWD_COMPLETE", 'success');
										$location.path('/login');
                }
            }, function (res) {
                console.log(res);
            });
        };

        //验证码倒计时
        $scope.text = '獲取驗證碼';
        $scope.en_text = 'request code';
        function setTimeInterval() {
            $scope.countDown = 60;
            var seq = $interval(function () {
                $scope.isshow = true;
                $scope.countDown--;
                $scope.text = $scope.countDown + " 's";
                $scope.en_text = $scope.countDown + " 's";
                if ($scope.countDown <= 0) {
                    clearTime(seq);
                }
            }, 1000);
        }

        //清除倒计时
        function clearTime(time) {
            $interval.cancel(time);
            $scope.isshow = false;
            $scope.countDown = '';
            $scope.text = '獲取驗證碼';
            $scope.en_text = 'request code';
        }


        //去除空格的方法验证
        $scope.getpassword = function () {
            if (/\s/.test($scope.params.password)) {
                $scope.passworderror = true;
            } else {
                $scope.passworderror = false;
            }
        };

        //监听证件验证方法
        $scope.getIdNumber = function () {
            $scope.errorIdtype = false;
            //身份证正则表达式(18位)
            var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            //身份证正则表达式(15位)
            var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;

            if ($scope.params.id_no && $scope.params.id_no.length == 18 && $scope.params.id_type == 'ID') {
                if (isIDCard2.test($scope.params.id_no)) {
                    $scope.kyc_verify();
                    $scope.errorIdtype = false;
                } else {
                    $scope.errorIdtype = true;
                    return;
                }
            } else if ($scope.params.id_no && $scope.params.id_no.length == 15 && $scope.params.id_type == 'ID') {
                if (isIDCard1.test($scope.params.id_no)) {
                    $scope.kyc_verify();
                    $scope.errorIdtype = false;
                } else {
                    $scope.errorIdtype = true;
                    return;
                }
            } else if ($scope.params.id_no && $scope.params.id_type == 'OTHER'|| $scope.params.id_type == 'PASSPORT') {
                $scope.errorIdtype = false;
            } else {
                $scope.errorIdtype = true;
            }
        };

        //验证身份证号
        $scope.kyc_verify = function () {
            PrivateService.verify($scope.params).then(function (res) {
                if (res.success) {
                    $scope.errorIdtype = false;
                } else {
                    $scope.errorIdtype = true;
                }
            });
        };

        //下一步事件
        $scope.step1 = true;
        $scope.next = function (step) {
            switch (step) {
                case 1:
                    $scope.step = 2;
                    $scope.step2 = $scope.step1;
                    break;
                case 2:
                    $scope.step = 3;
                    $scope.step3 = $scope.step2 = $scope.step1;
                    break;
                case 3:
                    $scope.reserPassword();
                    break;
                default:
                    break;
            }
        }

    }
})();

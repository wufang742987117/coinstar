'use strict';

angular.module('app')
    .controller('BankAndAddressController', BankAndAddressController)
// 	.directive('clickAndDisable', function() {
// 		return {
// 			scope: {
// 			clickAndDisable: '&'
// 			},
// 			link: function(scope, iElement, iAttrs) {
// 			iElement.bind('click', function() {
// 				iElement.prop('disabled',true);
// 				scope.clickAndDisable().finally(function() {
// 				iElement.prop('disabled',false);
// 				})
// 			});
// 			}
// 		};
// 	})

function BankAndAddressController($scope, ngDialog, $translate,PrivateService,$stateParams, AuthenticationService, $interval, FlashService) {
	
	$scope.AssetType = $stateParams.type;
    $scope.params = {};
    //获取币种类型
//     $scope.getPairs = function () {
//         PrivateService.getAssets().then(function (res) {
//             if (res.success) {
//                 $scope.balances = res.data.data;
//             }
//         });
// 
//     };
	$scope.params.remarks = $scope.AssetType;
	if(!$scope.language) {
		$scope.language = $translate.use();
	}
	
    //认证状态
//     $scope.getSettingState = function () {
//         PrivateService.getSettings().then(function (response) {
//             $scope.settings = response.data;
//         }, function (error) {
//             console.log('Error:', error);
//         });
//     };

//     $scope.getAssetType = function (type) {
//         $scope.type = type;
//         $scope.errmessage = '';
//         $scope.params = {};
//         if (type == 'bank') {
//             $scope.getbankList('CNY');
//         } else {
//             $scope.getFundName('BTC')
//         }
//     };
//     $scope.init = function () {
//         $scope.getAssetType('address');
//         $scope.getSettingState();
//         $scope.getPairs();
//     };

//     $scope.getFundName = function (cur,item) {
//         $scope.params.remarks = cur;
//         $scope.activeBalance = item;
//         $scope.isactive = cur;
//         $scope.getAddress(cur);
//     };
	
    $scope.getAddress = function () {
        PrivateService.ListAssetAccounts($stateParams.type).then(function (res) {
			
            $scope.address = res.data.data;
        })

    };
	$scope.getAddress();
    //获取验证码
    $scope.getVerifyCode = function () {
        setTimeInterval();
        if ($scope.type !== 'bank') {
            AuthenticationService.Ask("WADDR").then(function (res) {
                if (res.success) {
                    $scope.params.id = res.data.id;
                }
            });
        } else {
            AuthenticationService.Ask("BACCT").then(function (res) {
                if (res.success) {
                    $scope.params.id = res.data.id;

                }
            });
        }

    };

    //预验证手机验证码
    $scope.getVerifyphoneCode = function () {
        if ($scope.params.secret.length == 6) {
            AuthenticationService.Answer($scope.params).then(function (res) {
                if (res.success) {
                    $scope.params.authtoken = res.data.token;
                    $scope.errorVcode = false;
                } else {
                    $scope.errorVcode = true;
                }
            });
        }
    };


    //验证码倒计时
    $scope.text = '獲取驗證碼';
    $scope.en_text = 'request code';
    function setTimeInterval() {
        $scope.countDown = 60;
        $scope.seq = $interval(function () {
            $scope.isshow = true;
            $scope.countDown--;
            $scope.text = $scope.countDown + " 's";
            $scope.en_text = $scope.countDown + " 's";
            if ($scope.countDown <= 0) {
                clearTime($scope.seq);
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

    ////添加银行账号
    //$scope.addAccount = function () {
    //    ngDialog.open({
    //        template: 'templates',
    //        scope: $scope,
    //        controller: function ($scope) {
    //            $scope.confirm = function () {
    //                //绑定银行卡
    //                $scope.params.name = $scope.settings.name;
    //                $scope.params.remark = $scope.params.remark ? $scope.params.remark : '';
    //                PrivateService.AddCNYBankAccount('', 'CNY', $scope.params.bank_name, $scope.params.address, $scope.params.number, $scope.params.name, $scope.params.remark,$scope.params.authtoken)
    //                    .then(function (res) {
    //                    if (res.success) {
    //                        FlashService.Toast("MESSAGES.SUCCESS_ADD_BANK", 'success');
    //                        $scope.getbankList('CNY');
    //                        $scope.closeThisDialog();
    //                    } else {
    //                        $scope.errMessage = res.message;
    //                    }
    //                })
    //            };
    //        }
    //    });
    //};

    //添加币种地址
    $scope.confirm = function () {
    	//$scope.params.remarks = $scope.params.remarks ? $scope.params.remarks : $scope.params.remark;
    	PrivateService.AddAssetAccountaddress($scope.AssetType, $scope.params.address, $scope.params.remarks, $scope.params.address_part_two, $scope.params.authtoken).then(function (res) {
			if (res.success) {
    			FlashService.Toast("ACCOUNT.BIND_ACCOUNT_ADDRESS", 'success');
				clearTime(0);
				$scope.params.address = '';
				$scope.params.secret = ''
				$scope.getAddress();
    		} else {
    			$scope.errmessage = res.message;
    		}
    	})
    };

    ////获取银行账号
    //$scope.getbankList = function (_type) {
    //    PrivateService.ListBankAccounts(_type).then(function (res) {
    //        $scope.bankaccount = res.data;
    //    })
    //};
    ////删除银行卡
    //$scope.deletebankmessage = function (item,id) {
    //    ngDialog.open({
    //        template: 'template',
    //        scope:$scope,
    //        controller: function ($scope) {
    //            $scope.confirm = function () {
    //                $scope.id = id;
    //                PrivateService.UnbindBankAccount($scope.id).then(function(res){
    //                    if(res.success){
    //                        $scope.closeThisDialog();
    //                        $scope.bankaccount.splice($scope.bankaccount.indexOf(item), 1);
    //                    }else{
    //
    //                    }
    //                });
    //            };
    //            $scope.cancel = function () {
    //                $scope.closeThisDialog();
    //            };
    //        }
    //    });
    //};

    //获取提币账号
    $scope.getbalanceAccount = function (_type) {
        PrivateService.ListAssetAccounts(_type).then(function (res) {
            $scope.balanc_account = res.data.data;
        })
    };
	
	$scope.deleteAddressmessage = function(item,id) {
		ngDialog.open({
            template: 'templateId',
            scope: $scope,
            controller: function ($scope) {
                $scope.confirm = function () {
                    $scope.id = id;
                    PrivateService.UnbindAddress($scope.id).then(function (res) {
                        if (res.success) {
                            FlashService.Toast("ACCOUNT.DELETE_ACCOUNT_ADDRESS", 'success');
                            $scope.getAddress();
							$scope.closeThisDialog();
                        } else {
							
                        }
                    });
                };
                $scope.cancel = function () {
                    $scope.closeThisDialog();
                };
            }
        });
// 		PrivateService.UnbindAddress(id).then(function (res) {
// 			if (res.success) {
// 				FlashService.Toast("ACCOUNT.DELETE_ACCOUNT_ADDRESS", 'success');
// 				$scope.getAddress();
// 			} else {
// 
// 			}
// 		});
	} 

//     //删除提币地址
//     $scope.deleteAddressmessage = function (item, id) {
//         ngDialog.open({
//             template: 'templateId',
//             scope: $scope,
//             controller: function ($scope) {
//                 $scope.confirm = function () {
//                     $scope.id = id;
//                     PrivateService.UnbindAddress($scope.id).then(function (res) {
//                         if (res.success) {
//                             $scope.closeThisDialog();
//                             $scope.getFundName($scope.isactive);
//                         } else {
// 
//                         }
//                     });
//                 };
//                 $scope.cancel = function () {
//                     $scope.closeThisDialog();
//                 };
//             }
//         });
//     };

//     $scope.confirm = function (msg) {
//         $scope.dialog.close();
//     };
    // $scope.init();
}






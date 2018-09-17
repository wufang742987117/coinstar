'use strict';

angular.module('app')
    .controller('AccountController', AccountController)
		.controller('TaiwanAssetController', TaiwanAssetController)
    .filter('getDate', getDate)
		.filter('dateFilter', function () {
        return function (date) {

            var newDate = new Date(date);
            newDate = newDate.getTime();
            return newDate;
        }

    })
    .filter('getpairFormat', getpairFormat)
    .filter('getPriceAsset', getPriceAsset)
		.filter('amount', function () {
			return function (number) {
				var number = parseInt(number);
				if (number.toString() == 'NaN') number = 0;

				return number / Math.pow(10, 8);
			};
		})
		.filter('statusFilter', function () {
        return function (sta, lang) {
            if (lang == 'zh') {
                if (sta == 1) {
                    var staName = '待確認';
                } else if (sta == 2) {
                    staName = '確認中';
                } else if (sta == 3) {
                    staName = '完成';
                } else if (sta == 4) {
                    staName = '已撤銷';
                } else if (sta == 0) {
                    staName = '待審核';
                }
            }
            if (lang == 'en') {
                if (sta == 1) {
                    staName = 'To be confirmed';
                } else if (sta == 2) {
                    staName = 'Confirmation';
                } else if (sta == 3) {
                    staName = 'complete';
                } else if (sta == 4) {
                    staName = 'Revoked';
                } else if (sta == 0) {
                    staName = 'be audited';
                }
            }
            return staName;
        }
    })


function getpairFormat() {
    return function (username) {
       var name =  username.split('');
        return name.join("").substring(0,name.length-3);
    };
}

function getDate() {
    return function (date) {
       var name =  date.substr(0,9).split('-');
        return name[0]+"年"+name[1]+'月'+name[2]+'日';
    };
}
function getPriceAsset() {
    return function (price) {
        var newPrice=price.substr(3,3);
        return newPrice; 
    };
}
function AccountController($scope,ngDialog,$window,$translate, PrivateService, PublicService,$location) {
    $scope.balances = [];
    $scope.dataList = [];
		$scope.btcTotal = 0;
		$scope.usdtTotal = 0;
		$scope.usdtTotal = 0;
		$scope.cnyAmount = 0;
		$scope.btcAmount = 0;
		if(!$scope.language) {
			$scope.language = $translate.use();
		}
    $scope.params = {
        currentPage: 1,
        pagesize: 20
    };
    $scope.data = {
        cur_page: 1,
        items_page: 10
    };
    $scope.assets = {
        balance: 0,
        frozen: 0
    };
		
    //获取币种类型
    //$scope.getPairs = function () {
    //    PrivateService.getTradingPairs().then(function (res) {
    //        if (res.success) {
    //            $scope.balances = res.data.data;
    //            $scope.getAssetsBalances();
    //            $scope.getTicks();
    //            $scope.getbalanceAssets();
    //        }
    //    });
    //
    //};
    //获取充提权限
    $scope.getbalanceAssets = function () {
        PrivateService.getAssets().then(function (res){
            $scope.balances = $scope.assetsdata = res.data.data;
            $scope.getAssetsBalances();
        })
    };
    //$scope.getAssetsverify = function () {
    //    for (var b = 0; b < $scope.assetsdata.length; b++) {
    //        for (var c = 0; c < $scope.balances.length; c++) {
    //            if ($scope.balances[c].bid_asset_symbol == $scope.assetsdata[b].symbol) {
    //                $scope.balances[c].deposit = $scope.assetsdata[b].deposit;
    //                $scope.balances[c].withdraw = $scope.assetsdata[b].withdraw;
    //                $scope.balances[c].locked = $scope.assetsdata[b].locked;
    //                break;
    //            }
    //        }
    //    }
    //};

    //获取币种账户信息
    $scope.getAssetsBalances = function () {
        PrivateService.Balances().then(function (res) {
            if (res.success) {
                $scope.balance_num = res.data;
								
								for(var i=0;i<$scope.balance_num.length;i++) {
									$scope.balance_num[i].totalAssets = $scope.balance_num[i].balance / Math.pow(10, 8)+$scope.balance_num[i].frozen / Math.pow(10, 8);
									if($scope.balance_num[i].asset=='BTC') {
										$scope.btc_before = $scope.balance_num[i].balance / Math.pow(10, 8)+$scope.balance_num[i].frozen / Math.pow(10, 8);
									}else if($scope.balance_num[i].asset=='USDT') {
										$scope.usdt_before = $scope.balance_num[i].balance / Math.pow(10, 8)+$scope.balance_num[i].frozen / Math.pow(10, 8);
									}
								}
                $scope.getCallback();
								$scope.getMess();
            }
        });
    };
		
		//获取账户总额
		PublicService.GetTickers().then(function (res) {
				if (res.success) {
						$scope.balance_tickes = res.data;
						
				}
		});
		$scope.getMess = function() {
			PrivateService.getTradingPairs().then(function (res) {
				if (res.success) {
					$scope.balance_pairs= res.data.data;
					PublicService.GetTickers().then(function (res) {
						if (res.success) {
							$scope.balance_tickes = res.data;
							for(var i=0;i<$scope.balance_pairs.length;i++) {
								for(var j=0;j<$scope.balance_tickes.length;j++) {
									if($scope.balance_tickes[j].market==$scope.balance_pairs[i].name)
									$scope.balance_tickes[j].symbols=$scope.balance_pairs[i].bid_asset_symbol;
								}
							}
							for(var c=0;c<$scope.balance_tickes.length;c++) {
								if($scope.balance_tickes[c].market=="BTCUSDT") {
										$scope.btcTOusdt=$scope.balance_tickes[c].last/ Math.pow(10, 8);
								}
							}
							for(var a=0;a<$scope.balance_num.length;a++) {
								for(var b=0;b<$scope.balance_tickes.length;b++) {
									if($scope.balance_num[a].asset+'BTC'==$scope.balance_tickes[b].market) {
										console.log($scope.balance_num[a].asset,($scope.balance_num[a].balance/ Math.pow(10, 8)+$scope.balance_num[a].frozen/ Math.pow(10, 8)));
										console.log($scope.balance_tickes[b].last/ Math.pow(10, 8))
										$scope.btcTotal += ($scope.balance_num[a].balance/ Math.pow(10, 8)+$scope.balance_num[a].frozen/ Math.pow(10, 8))*$scope.balance_tickes[b].last/ Math.pow(10, 8);
										delete $scope.balance_num[a];
										for(var i=0; i<$scope.balance_num.length; i++){
											if($scope.balance_num[i] == "" || typeof($scope.balance_num[i]) == "undefined"){
												 $scope.balance_num.splice(i,1);
														i--;
											}
										}
									}
								}
							}
						$scope.btcTotal = $scope.btcTotal+$scope.btc_before;
						for(var a=0;a<$scope.balance_num.length;a++) {
							for(var b=0;b<$scope.balance_tickes.length;b++){
								if(($scope.balance_num[a].asset+'USDT'==$scope.balance_tickes[b].market)&&$scope.balance_tickes[b].market!="BTCUSDT") {
									$scope.usdtTotal+= ($scope.balance_num[a].balance/ Math.pow(10, 8)+$scope.balance_num[a].frozen/ Math.pow(10, 8))*$scope.balance_tickes[b].last/ Math.pow(10, 8);
								}
							}
						}
						
						
						
						
						$scope.usdtTotal = $scope.usdtTotal+$scope.usdt_before;
						$scope.userTotal = $scope.usdtTotal;
						if($scope.btcTotal) {
							$scope.userTotal= $scope.btcTotal*$scope.btcTOusdt+$scope.usdtTotal;
						}else {
							$scope.userTotal = $scope.usdtTotal;
						}
						
// 						if($scope.btcTOusdt!=0) {
// 							$scope.btcAmount=$scope.btcTotal+($scope.usdtTotal/$scope.btcTOusdt);
// 						}
// 						else 
						if($scope.userTotal!=0) {
							$scope.btcAmount = $scope.btcTotal;
							if($scope.btcTOusdt!=0) {
									$scope.btcAmount=($scope.userTotal/$scope.btcTOusdt).toFixed(8);
							}
							
							$scope.cnyAmount=($scope.userTotal*6.47).toFixed(2);
						}
						else {
							$scope.btcAmount = 0;
							$scope.cnyAmount = 0;
						}
					}
					});
				}
			})
		}
		

//     //获取币种费率
//     $scope.getTicks = function () {
//        PublicService.GetTickers().then(function (res) {
//            if (res.success) {
//                $scope.balance_tickes = res.data;
//                $scope.getbalanceTicks();
//            }
//        });
//     };
//     
    
    $scope.getCallback = function () {
        for (var i = 0; i < $scope.balances.length; i++) {
            for (var j = 0; j < $scope.balance_num.length; j++) {
                if ($scope.balances[i].symbol == $scope.balance_num[j].asset) {
                    $scope.balances[i].balance = $scope.balance_num[j].balance / Math.pow(10, 8);
                    $scope.balances[i].frozen = $scope.balance_num[j].frozen / Math.pow(10, 8);
                    $scope.balances[i].total = $scope.balances[i].balance + $scope.balances[i].frozen;
                    //$scope.balances[i].cnyTotal = $scope.balances[i].total * $scope.balances[i].last;
                    break;
                } else {
                    $scope.balances[i].balance = 0;
                    $scope.balances[i].frozen = 0;
                    $scope.balances[i].total = 0;
                    //$scope.balances[i].cnyTotal = 0;
                }
            }
        }

        //获取账户资产总额
        //if ($scope.balance_num.length > 0) {
        //    for (var ii = 0; ii < $scope.balances.length; ii++) {
        //        $scope.assets.balance += ($scope.balances[ii].balance * $scope.balances[ii].last);
        //        $scope.assets.frozen += ($scope.balances[ii].frozen * $scope.balances[ii].last);
        //    }
        //    $scope.assets.total = $scope.assets.balance + $scope.assets.frozen;
        //} else {
        //    $scope.assets.balance = 0;
        //    $scope.assets.frozen = 0;
        //    $scope.assets.total = 0;
        //}
        $scope.sortTickersAction();

    };

    // 排序操作
    $scope.sortTickersAction = function () {
        $scope.balances.sort(((field, sort) => {
            return function (obj1, obj2) {
                var val1 = obj1[field];
                var val2 = obj2[field];
                if (val1 < val2) {
                    return sort ? -1 : 1;
                } else if (val1 > val2) {
                    return sort ? 1 : -1;
                } else {
                    return 0;
                }
            }
        })('balance',false,true))
    };

    //获取ETP锁仓记录
    $scope.getETPLocks = function(){
        PrivateService.getETPLocks().then(function(res){
            if(res.success){
                $scope.etp_lock = res.data;
            }
        })
    };

    $scope.init = function () {
        $scope.getFundList('charge');
        $scope.getbalanceAssets();
        $scope.getETPLocks();
    };

    //获取资产明细列表
    $scope.getFundList = function (cur) {
        $scope.isselect = cur;
        switch (cur) {
            case 'deposit':
                $scope.getFundDepositList('CNY');
                break;
            case 'withdraw':
                $scope.getFundWithdrawList('CNY');
                break;
            case 'charge':
                $scope.getFundName('BTC');
                break;
            case 'currency':
                $scope.getFundName('BTC');
                break;
            case 'store':
                $scope.getFundName('GCC');
            case 'trade':
                $scope.getTradeList();
                break;
            case 'lock':
                $scope.getLockList();
                break;
            default:
                break;
        }
    };

    $scope.getFundDepositList = function (type) {
        PrivateService.getDepositFiatHistory(type, $scope.params).then(function (res) {
            if (res.success) {
                $scope.params.depositList = res.data.data;
                $scope.params.totalItems = res.data.count;
            }
        });
    };

    $scope.getFundWithdrawList = function (type) {
        PrivateService.getWithdrawalFiatHistory(type, $scope.params).then(function (res) {
            if (res.success) {
                $scope.params.withdrawList = res.data.data;
                $scope.params.totalItems = res.data.count;
            }
        });
    };

    $scope.getFundName = function (current) {
        $scope.isactive = current;
        if ($scope.isselect == 'charge') {
            PrivateService.getDepositCoinHistory(current, $scope.params).then(function (res) {
                $scope.params.deposit_list = res.data.data;
                $scope.params.totalItems = res.data.count;
            });
        } else if ($scope.isselect == 'currency') {
            $scope.params.withdrawList = [];
            PrivateService.withdrawalsHash(current,$scope.params).then(function (res) {
                $scope.params.withdraw_list = res.data.data;
                $scope.params.totalItems = res.data.count;
            });
        }else if($scope.isselect == 'store') {
            PrivateService.getStoreHistory(current,$scope.params).then(function (res) {
                $scope.params.store_list = res.data.result.data;
                $scope.params.totalItems = res.data.result.count;
            });
        }
    };


    //交易列表
    $scope.getTradeList = function () {
        PrivateService.getOrdersHistory($scope.params).then(function (res) {
            $scope.params.orders = res.data.orders;
            $scope.params.totalItems = res.data.count;
        });
    };
    //锁仓列表
    $scope.getLockList = function () {
        PrivateService.getLockActive('etp', $scope.params).then(function (res) {
            $scope.params.locks = res.data;
            $scope.params.totalItems = res.data.count;
        });
    };

    $scope.selectPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.currentPage);
        if ($scope.isselect == 'deposit') {
            $scope.getFundDepositList('CNY');
        } else if ($scope.isselect == 'withdraw') {
            $scope.getFundWithdrawList('CNY');
        } else if ($scope.isselect == 'charge' || $scope.isselect == 'currency') {
            $scope.getFundName('BTC');
        }
        else if($scope.isselect == 'store') {
            $scope.getFundName('GCC');
        }
        else if ($scope.isselect == 'trade') {
            $scope.getTradeList();
        } else {
            $scope.getLockList();
        }

    };

    $scope.getWithdrawLink = function(type){
        $location.path('/account/withdraw/'+ type);
    };
		
		//充值弹窗
		$scope.openDeposit = function(i) {
				ngDialog.open({
					template: 'deposit-template',
					controller: function ($scope, $interval,PrivateService,AuthenticationService,FlashService) {
							$scope.imType = i;
							$scope.digitalResResult = {
								tickersArr:[],
								depositaddress:'',
								memo:'',
								digitalhistoryArr:[]
							};
						
							//获取充值地址
							PrivateService.getDepositAddress(i)
								.then(function(response){
									if(response.success){
										$scope.digitalResResult.depositaddress = response.data;
										var qrcode = document.getElementById('qrcode');
										qrcode.getContext("2d").clearRect(0,0,qrcode.width,qrcode.height);
										if($scope.digitalResResult && $scope.digitalResResult.depositaddress) {
											$scope.qrCode($scope.digitalResResult.depositaddress);
										}
									}else{
										//$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
									}
							});
							$scope.qrCode = function(url) {
								qrcodelib.toCanvas(document.getElementById('qrcode'), url, {
									color: {
										dark: '#000000'
									},
									scale: 4
								}, (error)=>{
									if(error!=null)
									console.error(error);
							});
						};
					}
			});
		}
		
		
		//提现弹窗
		$scope.openWithdraw = function (i) {
        ngDialog.open({
            //template: 'templateId',
            //template: 'templates',
            template: 'withdraw-template',
						scope: $scope,
            controller: function ($scope, $interval,$window,PrivateService,AuthenticationService,FlashService,$translate) {
								$scope.myshow = false;
								$scope.isshow = false;
								$scope.errorVcode = false;
								$scope.loading = false;
								$scope.balances = [];
								$scope.isactive = i;
								$scope.settings = {};
								$scope.params = {};
								$scope.page = {
										currentPage: 1,
										pagesize: 10
								};
								$scope.assets = {
										balance: 0,
										frozen: 0,
										_balance: 0,
										_frozen: 0
								};
                $scope.confirm = function () {
                };
								
								//认证状态
								PrivateService.getSettings().then(function (response) {
										$scope.settings = response.data;
								}, function (error) {
										console.log('Error:', error);
								});
								
								$scope.goTpass = function() {
										$scope.closeThisDialog();
										$location.path('/setting/tpass');	
								}
								
								//获取提现币种
								PrivateService.ListAssetAccounts(i).then(function (res) {
										$scope.balanc_account = res.data.data;
								})
								//获取币种限额i
								PrivateService.getWithdrawalAmount(i).then(function (res) {
										$scope.limit = res.data;
								})
								
                $scope.cancel = function () {
                    $scope.closeThisDialog();
                };
								
								 $scope.getVerifyCode = function () {
										setTimeInterval();
										if($scope.iscurrent=='CNY'){
												AuthenticationService.Ask("FIATW",$scope.params.bank_id).then(function (res) {
														if (res.success) {
																$scope.params.id = res.data.id;
														}
												});
										}else{
												AuthenticationService.Ask("COINW").then(function (res) {
														if (res.success) {
																$scope.params.id = res.data.id;
														}
												});
										}
								};
								
								//验证邮箱验证码
								$scope.getVerifyWithdraw = function () {
										if ($scope.params.verificationCode.length!==6) {
												$scope.errorVcode1 = true;
												return;
										}else{
												$scope.data ={
														id:$scope.params.id,
														secret:$scope.params.verificationCode
												};
												AuthenticationService.Answer($scope.data).then(function (res) {
														if (res.success) {
																$scope.params.authtoken = res.data.token;
																$scope.errorVcode1 = false;
														} else {
																$scope.errorVcode1 = true;
														}
												});
										}
								};
								
								$scope.askBind = function () {
											AuthenticationService.Ask("WIDPH").then(function (res) {
													if (res.success) {
															$scope.params.id = res.data.id;
															Counter();
													}
											});
								};
								
								//确认提现
								$scope.withdrawBalance = function () {
										$scope.loading = true;
										PrivateService.coinnewWithdrawal(
												$scope.params.address_id,
												0,
												$scope.params.number * Math.pow(10, 8),
												$scope.isactive,
												$scope.params.authtoken,
												$scope.params.fundPwd,
												$scope.limit.current_withdrawal_limit,
												$scope.params.verify,
												$scope.isphone
										).then(function (res) {
												$scope.loading= false;
												if (res.success) {
														FlashService.Toast("ACCOUNT.SUC_WITHDRAWAL_LIMIT", 'success');
														$scope.getAssetsBalances();
														$scope.closeThisDialog();
														
												} else {
														if(res.message == 'ERR_NO_USER_INFO_EXIT') {
															FlashService.Toast("WITH_REAL_NAME", 'error');
														}else
														FlashService.Toast("ACCOUNT.ERROR_WITH", 'error');
												}
										})
								};
								
								
								var vm =this;
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
														
											
								//验证码倒计时
								$scope.text = '獲取驗證碼';
								$scope.en_text = 'request code';

								

								function setTimeInterval() {
										$scope.countDown = 60;
										$scope.seq = $interval(function () {
												$scope.isshow = true;
												$scope.countDown--;
												$scope.text = $scope.countDown + " 's";
												$scope.en_text =  $scope.countDown + " 's";
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
            }
        });
    };
    $scope.confirm = function (msg) {
        $scope.dialog.close();
    };
		
		

    $scope.init();
}

function TaiwanAssetController($scope, C2cService,$translate, FlashService, PrivateService, $http, $cookies,$rootScope,BelowService) {
		$scope.twdrecharges = false;
		$scope.twdwithdraws = false;
		$scope.usdtbuys = false;
		$scope.usdtsells = false;
		$scope.twddialog = false;
		$scope.account = {};
		$scope.type = 'TWD';
		$scope.typeRole = 5;
		$scope.TWDbanace = 0;
		$scope.USDTbanace = 0;
		$scope.list_type = 1;
		$scope.ifConfirm = false;
		$scope.params = {
			
		}
		$scope.History = function(type) {
			$scope.type = type;
		}
		$scope.openDia = function(type) {
			if(type=="twdRecharge") {
				$scope.twdrecharges = true;
			}else if(type=="twdWithdraw") {
				$scope.twdwithdraws = true;
			}else if(type=="usdtbuy") {
				$scope.usdtbuys = true;
			}else {
				$scope.usdtsells = true;
			}
		}
		if(!$scope.language) {
			$scope.language = $translate.use();
		}
		$scope.closeDia = function() {
			$scope.twdrecharges = false;
			$scope.twdwithdraws = false;
			$scope.usdtbuys = false;
			$scope.usdtsells = false;
			$scope.twddialog = false;
		}
		
		// 撤销订单
		$scope.revoke = function (order_id) { //撤销此笔订单
        BelowService.cancelOrder(
            order_id
        ).then(function (res) {
            if (!res.success) {
                FlashService.Toast("C2CORDERCANCEL.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDERCANCEL.SUCCESS", 'success');
                BelowService.queryOrder(2,1,10).then(function (res) {
                		$scope.TWD_userData = res.data.data;
                });
            }
        })
    }
		
		//获取会员类型
		BelowService.checkBussiness().then(function (res) {
				$scope.typeRole = res.data.business_type;
				if($scope.typeRole == 1) {
					
					//平台获取TWD资产明细
					if($scope.type == 'TWD') {
						BelowService.queryOrder(1,1,10).then(function (res) {
								$scope.TWD_userData = res.data.data;
								
						});
					}
				}
				if($scope.typeRole == 5) {
					
					//获取会员余额
					PrivateService.Balances().then(function (res) {
            if (res.success) {
                $scope.balance_num = res.data;
								for(var i=0;i<$scope.balance_num.length;i++) {
									if($scope.balance_num[i].asset=="TWD") {
											$scope.TWDbanace = $scope.balance_num[i].balance / Math.pow(10, 8)
									}if($scope.balance_num[i].asset=="USDT") {
										$scope.USDTbanace = $scope.balance_num[i].balance / Math.pow(10, 8)
									}
								}
            }
					});
					
					//TWD资产明细
					if($scope.type == 'TWD') {
						BelowService.queryOrder(2,1,10).then(function (res) {
								$scope.TWD_userData = res.data.data;
						});
					}
					
				}
		});
		
		// 会员充值/提现确认
		$scope.confirm = function(type) {
			BelowService.createOrder(type,'TWD',$scope.params.asset_amount).then(function (res) {
					if(type==1) {
						if(res.success) {
							$scope.ifConfirm = true;
							$scope.params.real_name = res.data.real_name;
							$scope.params.bank_name = res.data.bank_name;
							$scope.params.bank_account_no = res.data.bank_account_no;
							$scope.params.asset_amount = res.data.asset_amount;
							$scope.params.remit_code = res.data.remit_code;
						}else{
							if(res.message == 'ORDER_UN_LIMIT') {
								FlashService.Toast("ORDER_UN_LIMIT", 'error');
							}
						}
					}else {
						debugger;
						if(res.success) {
							$scope.confirmSure();
						}
					}
					
			});
		}
		$scope.confirmSure = function() {
			$scope.twdrecharges = false;
			$scope.twdwithdraws = false;
			$scope.ifConfirm = false;
			$scope.params.asset_amount = null;
			BelowService.queryOrder(2,1,10).then(function (res) {
					$scope.TWD_userData = res.data.data;
			});
		}
		
		$scope.popStatus = function(orderId, price, amount, code) {
				$scope.twddialog = true;
				$scope.account = '';
				$scope.asset_price = '';
				$scope.asset_amount = '';
				$scope.remit_code = '';
				$scope.order_type='';
				$scope.orderId='';
				$scope.status='';
				$scope.getBankInfo(orderId, price, amount, code);
		}
		
		$scope.getBankInfo = function (id, price, amount, code,order_type,status) {
			BelowService.querybusinessInfo(
            id
        ).then(function (res) {
            $scope.account = res.data;
            $scope.asset_price = price;
            $scope.asset_amount = amount;
            $scope.remit_code = code;
            $scope.order_type=order_type;
            $scope.orderId=id;
            $scope.status=status;
        })
		}
		
		$scope.confirmOrder = function(id) {
				BelowService.confirmOrder(
            id,
        ).then(function (res) {
            if (!res.success) {
                FlashService.Toast("C2CORDER.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDER.SUCCESS", 'success');
            }
        })
		}
		
		$scope.search = function(type,remit_code,create_time_start,create_time_end) {
			create_time_start=new Date(create_time_start).getTime();
      create_time_end=new Date(create_time_end).getTime();
			BelowService.queryOrder_business(
				type,
				remit_code,
				create_time_start,
				create_time_end,
				1,
				10
			).then(function (res) {
					$scope.TWD_userData = res.data.data;
			});
		}
}
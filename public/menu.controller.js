
    'use strict';
    angular
        .module('app')
        .controller('MenuController', MenuController)
        .controller('FooterController', FooterController)
        .controller('LangController', LangController)
        .controller('AgreementController', AgreementController)
        .controller('WorkOrderController', WorkOrderController)
		.controller('ConstructionController', ConstructionController)
        .filter('getUsernameFormat', getUsernameFormat).filter('amount', function() {
        return function(number) {
            var number = parseInt(number);
            if (number.toString() == 'NaN') number = 0;
            return number / Math.pow(10, 8);
        };
    })

    function getUsernameFormat() {
        return function (username) {
            if(!username)
                return username;
            var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (phone.test(username) && username.length == 11) {
                var _username = username.substring(0, 3) + "****" + username.substring(7, 11);
                return _username;
            } else {
                var c = username.split("@");
                var c1 = c[0].substr(3);
                var star = "";
                for (var i = 0; i < c1.length; i++) {
                    star += "*";
                }
                var _username = c[0].substr(0, 3) + star + c[1];
                return _username;
            }
        };
    }

    function FooterController($scope) {
        $scope.pageChange = function() {
// 			if(window.screen.width<768) {
// 				$('.nav_list,.right_zt a').addClass('ng-hide');
// 			}
		}
    }

    function LangController($scope, $cookies, $translate, $rootScope,tmhDynamicLocale,$window,$timeout) {
		$scope.reloadRoute = function () {
			$window.location.reload();
		};
		
        $scope.lang_flag = $translate.use();
        var languages = $translate.getAvailableLanguageKeys();
		
        $scope.changeLanguage = function (language) {
            $rootScope.$broadcast('changeLang', language);
            $scope.lang_flag = $translate.use();
            for (var i = 0; i < languages.length; i++) {
                if (language && language == languages[i]) {
                    changeLang(language);
                } else if (!language && languages[i] == $scope.lang_flag) {
                    changeLang(languages[(i + 1) % languages.length]);
                }
            }	
        };

        function changeLang(new_language) {
			$timeout(function(){
				$translate.use(new_language).then(function (lang) {
					$scope.lang_flag = lang;
					$rootScope.language = lang;
					$cookies.put('language', lang);
					$scope.reloadRoute();
				});
				tmhDynamicLocale.set(new_language);
			},0);
        }
        // $scope.changeLanguage('zh_TW');
        $scope.homeLang = function (new_language) {
            $translate.use(new_language).then(function (lang) {
                $scope.lang_flag = lang;
                $cookies.put('language', lang);
            });

            // // Re-Initialize slidebra
            // $(document).ready(function () {
            //     $('#sidebar').sidr({
            //         name: 'sidr-right',
            //         side: 'right',
            //         source: '#menu_main, #menu_logout'
            //     });
            // });
        }; // end homeLang
		$scope.language_type = '繁體中文';
		if($scope.lang_flag == 'en') {
			$scope.language_type = 'English';
		}
		$scope.setLanguage = function(type) {
			$scope.language_type = type;
			if(type=='English') {
				$scope.changeLanguage('en');
			}else {
				$scope.changeLanguage('zh_TW');
			}
			$(".select_lang dd").hide(0);
		}

		$(".select_lang").hover(function(){
			$(".select_lang dd").show(0);
		},function(){
			$(".select_lang dd").hide(0);
		});
		
		$(".select_lang dd a").hover(function(){
			$(this).addClass('lan_select');
		},function(){
			$(this).removeClass('lan_select');
		});
		

    }

    function AgreementController($scope) {

    }

    function MenuController(PrivateService, $rootScope, $scope, $cookies, $translate, $location) {
		
		
        $scope.downIos=function() {
            window.open("itms-services://?action=download-manifest&url=https://www.idaec.com/ios/Info.plist");
        }
        $scope.istoggle = function(){
            $("#navbarApp").toggle();
        };

        $("#navbarApp li").on('click',function(){
            $("#navbarApp").fadeOut();
        });

        $rootScope.$on('login', function (event) {
            if ($rootScope.globals && $rootScope.globals.logged_in) {
                loadSettings();
            }
        });

        if ($rootScope.globals && $rootScope.globals.logged_in) {
            loadSettings();
        }

        function loadSettings() {
            $scope.load_settings = true;
            PrivateService.getSettings().then(function (response) {
                $scope.load_settings = false;
                $scope.settings = response.data;
                console.log(1234)
            }, function (error) {
                $scope.load_settings = false;
                console.log('Error:', error);
            });
        }
		
        window.onhashchange = function () {
            var path = location.hash.split('/');
            $rootScope.ishash = path[1];
            $rootScope.ishashtwo = path[2];
            $rootScope.ishashthree = path[3];
            if($rootScope.ishash == 'trade'){
                $('.top_main').css("top",'0');
                // $(".common-container").addClass('tophead');
            }
// 			if($rootScope.ishash != 'home') {
// 				window.onscroll= function(){
// 					var t = document.documentElement.scrollTop||document.body.scrollTop;
// 					var scrollup = document.getElementById('header-common');
// 					if(t>=100){
// 							scrollup.style.display="none";
// 							$scope.rightToggleShow = false;
// 						
// 					}else{          //恢复正常
// 							scrollup.style.display="block";
// 					}
// 					$scope.$apply();
// 				}
// 			}
            if ($rootScope.ishash == 'home') {
				window.onscroll= function(){
					var t = document.documentElement.scrollTop||document.body.scrollTop;
// 					var scrollup = document.getElementById('header-home');
// 					if(window.screen.width>500) {
// 						if(t>=180){
// 								scrollup.style.display="none";
// 								$scope.rightToggleShow = false;
// 							
// 						}else{          //恢复正常
// 								scrollup.style.display="block";
// 						}
// 						$scope.$apply();
// 					}
				}
				
                // Pace.start();
                $(".common-container").removeClass('tophead');
                $(".navbar").addClass('nobackground');
                // $(".menu_bod").css('top','180px');
                var height = window.innerHeight;
                $(window).scroll(function () {
                    var _hh = $(".balance-type").height();
                    var _h = document.body.scrollTop + 96 + _hh;
                    if (_h && _h > height) {
                        $(".navbar").removeClass('nobackground');
                    } else {
                        $(".navbar").addClass('nobackground');
                    }
                });
            } else {
                // Pace.stop();
                $(".navbar").removeClass('nobackground');
                $(window).unbind('scroll');
				$(".menu_bod").css('top','80px');

            }
        };
        window.onhashchange();

        // 头部右侧导航

        $scope.rightToggChange = function() {
            $scope.rightToggleShow = false;
        }
		
		$scope.rightToggChange_mobile = function() {
			if(window.screen.width<768) {
				$scope.rightToggleShow_mobile = false;
			}
			
		}
		$scope.rightToggleShow_mobile = true;
        $scope.rightToggleShow = false;
		
		if(window.screen.width<768) {
			$scope.rightToggleShow_mobile = false;
		}
		else {
			$scope.rightToggleShow_mobile = true;
		}
        $scope.rightToggle = function () {
            if($scope.rightToggleShow == false) {
                $scope.rightToggleShow = true
            }else
                $scope.rightToggleShow = false;
        }
		
		$scope.rightToggle_mobile = function () {
// 			if($('.nav_list,.right_zt a').hasClass('ng-hide')) {
// 				$('.nav_list,.right_zt a').removeClass('ng-hide');
// 			}
			if($scope.rightToggleShow_mobile == false) {
// 				if($('.nav_list,.right_zt a').is(':hidden')) {
// 					$('.nav_list,.right_zt a').show();
// 				}else
				$scope.rightToggleShow_mobile = true;	
			}else
				$scope.rightToggleShow_mobile = false;
				
		}
    }

    function WorkOrderController($scope,PublicService,$translate,$location,CONFIG,PrivateService,$rootScope,FlashService) {
		
		$scope.params = {
			page: 10,
			totalItems: 0,
			currentPage: 1
		}
		$scope.type = 'now';

		// 获取交易对信息
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
									$scope.balance_tickes[j].symbols=$scope.balance_pairs[i].bid_asset_symbol+'-'+$scope.balance_pairs[i].ask_asset_symbol;
								}
							}
							localStorage.setItem('_asset_select_list_',JSON.stringify($scope.balance_tickes));
						}
					});
				}
			})
		}
		
		
		//切换当前啊委托/历史成交
		$scope.detailShow = function(i) {
			$scope.type = i;
			$scope.showMessages(2,i);
		}
		
		//交易对切换
		$scope.marketChange = function() {
			if($scope.type == 'now') {
				$scope.showMessages(2,'now');
			}else {
				$scope.showMessages(2,'history');
			}
		};
		
		$scope.selectPage = function (pageNo) {
			$scope.params.currentPage = pageNo;
		};
		
		$scope.pageChanged = function () {
			$scope.marketChange();
		};
		
		//显示当前委托/历史成交
		$scope.showMessages = function(i,j) {
				if(localStorage.getItem('_asset_select_list_')){
					$scope.balance_tickes = JSON.parse(localStorage.getItem('_asset_select_list_'))
				}
				else $scope.getMess();
				if(i == 1){
					$scope.selectAsset = $scope.balance_tickes[0].market;
				}
				if(j=='now') {
					console.log(111111,$scope.selectAsset);
					PrivateService.getCurrentTCommission($scope.selectAsset).then(function (res) {
						if (res.success) {
							$scope.detail_now_List = res.data;
							var temp = [];
							for (var i = 0; i < $scope.detail_now_List.length; i++) {
								for (var j = 0; j < $scope.detail_now_List[i].orders.length; j++) {
								temp.push($scope.detail_now_List[i].orders[j]);
								}
							}
							$scope.orderCurrentData = temp;
							$scope.totalItems = res.data.count;
						}
					});
				}
				else if(j=='history') {
					PrivateService.getHistoryTCommission($scope.selectAsset,$scope.params.currentPage - 1,$scope.params.pageSize).then(function (res) {
						if (res.success) {
							$scope.orderHistoryData = res.data.data;
							$scope.params.totalItems = res.data.count;
						}
					});
				}
			
			//撤单
			$scope.cancelOrder = function(v) {
				 PrivateService.deleteOrder($scope.selectAsset,v.id).then(function (res){
						if (res.success) {
							FlashService.Toast('MESSAGE.ORDER_CANCEL_INFO', 'info');
							$scope.orderCurrentData.splice($scope.orderCurrentData.indexOf(v), 1);
						}
						else {
							FlashService.Toast('MESSAGE.ORDER_CANCEL_ERROR', 'error');
						}
				})
			}
			
// 			PublicService.GetTickers().then(function (res){
// 				if (res.success) {
// 					$scope.balance_tickes = res.data.data;
// 					if(i == 1){
// 						$scope.selectAsset = $scope.balance_tickes[0];
// 					}
// 					if(j =='now') {
// 						PrivateService.getCurrentTCommission($scope.selectAsset.market).then(function (res) {
// 							debugger;
// 							if (res.success) {
// 								$scope.detailList = res.data.data;
// 								$scope.totalItems = res.data.count;
// 							}
// 						});
// 					}
// 					else if(j =='history') {
// 						PrivateService.withdrawalsHash($scope.selectAsset.symbol,$scope.params).then(function (res) {
// 							if (res.success) {
// 								$scope.detailList = res.data.data;
// 								$scope.totalItems = res.data.count;
// 							}
// 						});
// 					}
// 				}
// 			})
		}
		
		$scope.showMessages(1,'now');
		
    }

	function ConstructionController() {
		
	}
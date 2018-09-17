;(function () {
    'use strict';
    // Fake back requires: ngMockE2E, [edit private-fake-backend & index.html] 'hj.gsapifyRouter',
    angular.module('app', ['ui.router', 'ui.bootstrap', 'ngCookies', 'pascalprecht.translate',
        'angularUtils.directives.dirPagination', 'toastr', 'ngDialog', 'rzModule','720kb.datepicker','tmh.dynamicLocale'])
        .config(config)
        .filter('satoshi', function () {
            // return function (input, decimals, asset, fallback) {
            //     var out = '';
            //     if (!decimals)
            //         decimals = 2;
            //     if (!input)
            //         out = fallback;
            //     else {
            //         out = parseFloat(input / 100000000).toFixed(decimals);
            //         if (asset)
            //             out += ' ' + asset;
            //     }
            //     return out;
            // };

            return function (number) {
                var number = parseInt(number);
                if (number.toString() == 'NaN') number = 0;
                return number / Math.pow(10, 8);
            };
        })
        .directive('autoHeight',[function () {
            return {
                restrict : 'A',
                scope : {},
                link : function($scope, element, attrs) {
                    var winowHeight = window.innerHeight; //获取窗口高度
					
                    var headerHeight = 160;
                    var footerHeight = 100;
					if(window.screen.width>768) {
						element.css('min-height',
							(winowHeight - footerHeight) + 'px');
					}
                }
            };
        }])
        .config(function (toastrConfig) {
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                newestOnTop: true,
                positionClass: 'toast-top-right',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body'
            });
        })
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
            $compileProvider.commentDirectivesEnabled(false);
            $compileProvider.cssClassDirectivesEnabled(false);
        }])
        .config(function ($translateProvider, $stateProvider) {
            // gsapifyRouterProvider
            // gsapifyRouterProvider.defaults = {
            //     enter: 'fadeDelayed',
            //     leave: 'fade'
            // };
            $translateProvider.useStaticFilesLoader({
                prefix: 'lang/',
                suffix: '.json'
            }).registerAvailableLanguageKeys(['zh_TW', 'en'], {
                'en-US': 'en',
                'en-UK': 'en',
				'zh-ZH': 'zh_TW',
				'zh-CN': 'zh_TW'
            }).useSanitizeValueStrategy('escapeParameters')
                .preferredLanguage('zh_TW')
                .fallbackLanguage('en');
        })
        .config(['tmhDynamicLocaleProvider', function ($tmhDynamicLocaleProvider) {
        	$tmhDynamicLocaleProvider.localeLocationPattern('./lang/angular-locale_{{locale}}.js');
        }])
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    // 修改
    function config($stateProvider, $urlRouterProvider) {
        $stateProvider.state('logout', {
            url: '/logout',
            controller: 'LogoutController'
        })


            .state('menu.footer.login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'common/login.view.html',
                controllerAs: 'vm'
            })

            .state('menu.footer.register', {
                url: '/register',
                controller: 'RegisterController',
                templateUrl: 'common/register.view.html',
                controllerAs: 'vm'
            })

            .state('menu.footer.reset', {
                url: "/reset",
                templateUrl: "common/forget.view.html",
                controller: 'ResetPasswordController',
                controllerAs: 'vm'
            })

            .state('menu', {
                abstract: true,
                controller: 'MenuController',
                templateUrl: 'public/mainMenu.view.html'
            })

            // .state('menu.footer ', {
            //     url: "/help/tutorialhelp",
            //     abstract: true,
            //     controller: 'TutorialHelpController',
            //     templateUrl: 'help/tutorial_help.view.html'
            // })

            .state('menu.footer', {
                abstract: true,
                controller: 'FooterController',
                templateUrl: 'public/footer.view.html'
            })

            .state('menu.down', {
                // abstract: true,
                url: '/down',
                controller: 'MenuController',
                templateUrl: 'public/downIos.view.html'
            })

            //.state('menu.footer.news', {
            //		url: '/news/:id',
            //  controller: 'NewsController',
            //  templateUrl: 'news/news.view.html'
            //})

            //.state('newsMobile', {
            //  url: '/newsMobile/:id',
            //  controller: 'NewsController',
            //  templateUrl: 'news/newsMobile.view.html'
            //})
			
			.state('menu.footer.contactUs', {
            	url: '/contactUs',
            	controller: 'ContactUsController',
            	templateUrl: 'public/contactUs.view.html'
            })
            
            .state('menu.footer.feeRate', {
            	url: '/feeRate',
            	controller: 'FeeRateController',
            	templateUrl: 'public/feeRate.view.html'
            })


            .state('menu.footer.news', {
                url: '/news',
                controller: 'NewsListController',
                templateUrl: 'news/news.view.html'
            })
			
						.state('menu.footer.newsMore', {
							url: '/newsMore',
							controller: 'NewsMoreController',
							templateUrl: 'news/newMore.view.html'
						})
						
						.state('menu.footer.noticeMore', {
							url: '/noticeMore',
							controller: 'NoticeMoreController',
							templateUrl: 'news/noticeMore.view.html'
						})
				
            .state('menu.footer.c2c', {
                url: '/c2c',
                controller: 'C2ctradeController',
                templateUrl: 'c2c/c2c_trade.view.html'
            })
            .state('menu.footer.c2crealIdentity', {
                // abstract: true,
                url: '/c2c/c2crealIdentity',
                controller: 'C2crealIdentityController',
                templateUrl: 'c2c/c2crealIdentity.view.html',
                controllerAs: 'vm'
            })
            .state('menu.footer.c2cpersonrecord', {
                url: '/c2c/c2cpersonrecord',
                controller: 'c2cpersonrecordController',
                templateUrl: 'c2c/c2cpersonrecord.view.html',
            })
            .state('menu.footer.c2cpersonrecordshop', {
                url: '/c2c/c2cpersonrecordshop',
                controller: 'c2cpersonrecordshopController',
                templateUrl: 'c2c/c2cpersonrecordshop.view.html',
            })
            .state('menu.footer.newsdetail', {
                url: '/news/detail/:id',
                controller: 'NewsDetailController',
                templateUrl: 'news/newsdetail.view.html'
            })
            .state('menu.footer.account', {
                url: '/account/details',
                controller: 'AccountController',
                templateUrl: 'account/account.view.html'
            })
            .state('menu.footer.account_recharge', {
                url: '/account/recharge/:type',
                controller: 'RechargeController',
                templateUrl: 'account/recharge.view.html'
            })
            .state('menu.footer.account_recharges', {
                url: '/account/recharge',
                controller: 'RechargeController',
                templateUrl: 'account/recharge.view.html'
            })
            .state('menu.footer.account_withdraw', {
                url: '/account/withdraw/:type',
                controller: 'WithdrawController',
                templateUrl: 'account/withdraw.view.html'
            })
            .state('menu.footer.account_withdraws', {
                url: '/account/withdraw',
                controller: 'WithdrawController',
                templateUrl: 'account/withdraw.view.html'
            })

            .state('menu.footer.trial_course', {
                url: '/help/trialcourse',
                controller: 'TutorialHelpController',
                templateUrl: 'help/tutorial_help.view.html'
            })

            .state('menu.footer.question_common', {
                url: '/help/questions',
                controller: 'QusetionsController',
                templateUrl: 'help/question_common.view.html'
            })

            .state('menu.footer.gcc_intro', {
                url: '/help/intro_gcc',
                controller: 'IntroGccController',
                templateUrl: 'help/intro_gcc.view.html'
            })

            // 账户--数据分析
            // author: hjj
            // date: 2017/12/14

            .state('menu.footer.account_dataanalysis', {
                url: '/account/dataanalysis',
                controller: 'DataAnalysisController',
                templateUrl: 'account/dataanalysis.view.html'
            })

            .state('menu.footer.bankandaddress', {
                url: '/account/bankandaddress/:type',
                controller: 'BankAndAddressController',
                templateUrl: 'account/bankandaddress.view.html'
            })


            .state('menu.footer.account_lock', {
                url: '/account/lock',
                controller: 'BalanceLockController',
                templateUrl: 'account/lock.view.html'
            })

            .state('menu.footer.help', {
                url: '/support/details',
                templateUrl: 'help/help.view.html'
            })
            .state('menu.footer.help_deposit', {
                url: '/support/deposit',
                templateUrl: 'help/help_deposit.view.html'
            })
            .state('menu.footer.help_withdraw', {
                url: '/support/withdraw',
                templateUrl: 'help/help_withdraw.view.html'
            })


            .state('menu.linkMobile', {
                url: '/linkMobile',
                controller: 'MobileController',
                templateUrl: 'public/linkMobile.view.html'
            })
            .state('menu.linkSina', {
                url: '/linkSina',
                controller: 'MobileController',
                templateUrl: 'public/link.sina.view.html'
            })

            .state('menu.footer.about', {
                url: '/footer/about',
                templateUrl: 'public/about.view.html'
            })

            // .state('aboutMobile', {
            //     url: '/home/aboutMobile',
            //     templateUrl: 'public/aboutMobile.view.html'
            // })

            .state('menu.footer.help_fee', {
                url: '/support/fee',
                templateUrl: 'help/fee.view.html'
            })

            // .state('feeMobile', {
            //     url: '/home/feeMobile',
            //     templateUrl: 'public/feeMobile.view.html'
            // })

            .state('menu.footer.terms', {
                url: '/footer/terms',
                templateUrl: 'public/terms.view.html'
            })

            // .state('termsMobile', {
            //     url: '/home/termsMobile',
            //     templateUrl: 'public/termsMobile.view.html'
            // })

            .state('menu.footer.legal', {
                url: '/footer/legal',
                templateUrl: 'public/legal.view.html'
            })

            // .state('legalMobile', {
            //     url: '/home/legalMobile',
            //     templateUrl: 'public/legalMobile.view.html'
            // })

            .state('menu.account.fiat-bar', {
                abstract: true,
                controller: 'FiatDepositController',
                templateUrl: 'account/pages/fiat-bar.view.html'
            })

            .state('menu.selector', {
                abstract: true,
                controller: 'TradingDeskSelectorController',
                templateUrl: 'trading-desk/selector.view.html'
            })

            .state('footer', {
                abstract: true,
                controller: 'FooterController',
                templateUrl: 'public/footer.view.html'
            })


            .state('menu.trade.asset', {
                url: '/trade/:trading_pair',
                controller: 'TradeController',
                templateUrl: 'trade/trade.view.html',
                controllerAs: 'vm'
            })
			
			.state('menu.footer.trade_tc', {
				url: '/trade_tc',
				controller: 'Trade_tcController',
				templateUrl: 'trade/trade_tc.view.html',
				controllerAs: 'vm'
			})
			
			.state('menu.footer.taiwan_asset', {
				url: '/taiwan_asset',
				controller: 'TaiwanAssetController',
				templateUrl: 'account/taiwanasset.view.html',
				controllerAs: 'vm'
			})
			
// 			.state('menu.footer.account', {
// 				url: '/account/details',
// 				controller: 'AccountController',
// 				templateUrl: 'account/account.view.html'
// 			})

            .state('footer.trade', {
                url: '/trade',
                // abstract: true,    // abstract: true,
                controller: 'TradeController',
                templateUrl: 'trade/trade.view.html',
                controllerAs: 'vm'
            })


            .state('tradeapp', {
                url: '/tradeapp/:type',
                controller: 'TradeController',
                templateUrl: 'trade/tradeapp.view.html',
                controllerAs: 'vm'
            })

            .state('menu.footer.home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })


            .state('menu.footer.setting', {
                url: '/setting/menu',
                templateUrl: 'setting/pages/menu.view.html',
                controller: 'SettingController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_tpass', {
                url: '/setting/tpass',
                templateUrl: 'setting/pages/tpass.view.html',
                controller: 'TpassController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_phone', {
                url: '/setting/phone',
                templateUrl: 'setting/pages/phone.view.html',
                controller: 'PhoneController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_change_phone', {
                url: '/setting/change_phone',
                templateUrl: 'setting/pages/change_phone.view.html',
                controller: 'PhoneController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_email', {
                url: '/setting/email',
                templateUrl: 'setting/pages/email.view.html',
                controller: 'EmailController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_change_email', {
                url: '/setting/change_email',
                templateUrl: 'setting/pages/change_email.view.html',
                controller: 'EmailController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_id', {
                url: '/setting/id',
                templateUrl: 'setting/pages/id.view.html',
                controller: 'IdController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_authenticator', {
                url: '/setting/authenticator',
                templateUrl: 'setting/pages/authenticator.view.html',
                controller: 'AuthenticatorController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_password', {
                url: '/setting/password',
                templateUrl: 'setting/pages/password.view.html',
                controller: 'PasswordController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_c1', {
                url: '/setting/c1',
                templateUrl: 'setting/pages/c1.view.html',
                controller: 'C1Controller',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_c2', {
                url: '/setting/c2',
                templateUrl: 'setting/pages/c2.view.html',
                controller: 'C2Controller',
                controllerAs: 'vm'
            })
            .state('menu.footer.setting_realIdentity', {
                url: '/setting/realIdentity',
                templateUrl: 'setting/pages/realIdentity.view.html',
                controller: 'realIdentityontroller',
                controllerAs: 'vm'
            })


            .state('menu.api', {
                url: '/footer/:urlName',
                templateUrl: 'api/api.view.html',
                controller: 'HomeApiController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_api', {
                url: '/setting/api',
                templateUrl: 'setting/pages/api.view.html',
                controller: 'ApiController',
                controllerAs: 'vm'
            })

            .state('menu.footer.setting_key', {
                url: '/setting/backupskey',
                templateUrl: 'setting/pages/backupskey.view.html',
                controller: 'keyController',
                controllerAs: 'vm'
            })

            // .state('menu.footer.setting_phone', {
            //     url: '/setting/phonebind',
            //     templateUrl: 'setting/pages/linkPhone.view.html',
            //     controller: 'PhoneBindController',
            //     controllerAs: 'vm'
            // })


            .state('menu.footer.setting_safe', {
                url: '/setting/loginsafe',
                templateUrl: 'setting/pages/loginsafe_setting.view.html',
                controller: 'LoginSafeController',
                controllerAs: 'vm'
            })

            .state('menu.footer.trade_safe', {
                url: '/setting/tradesafe',
                templateUrl: 'setting/pages/tradesafe_setting.view.html',
                controller: 'TradeSafeController',
                controllerAs: 'vm'
            })

            .state('menu.footer.extract_safe', {
                url: '/setting/withdrawsafe',
                templateUrl: 'setting/pages/withdrawsafe_setting.view.html',
                controller: 'WithdrawSafeController',
                controllerAs: 'vm'
            })

            .state('menu.footer.google_verify', {
                url: '/google_verify',
                templateUrl: 'common/login_google_verify.view.html',
                controller: 'VerityGoogleController',
                controllerAs: 'vm'
            })

            .state('menu.footer.mailbox_verify', {
                url: '/mailbox_verify',
                templateUrl: 'common/login_mailbox_verify.view.html',
                controller: 'VerityMailboxController',
                controllerAs: 'vm'
            })
            .state('menu.footer.phone_verify', {
                url: '/phone_verify',
                templateUrl: 'common/login_phone_verify.view.html',
                controller: 'VerityPhoneController',
                controllerAs: 'vm'
            })
            .state('menu.footer.agreement', {
                url: '/agreement',
                templateUrl: 'public/serviceAgreement.view.html',
                controller: 'AgreementController',
                controllerAs: 'vm'
            })
            .state('menu.footer.order', {
                url: '/order',
                templateUrl: 'public/workerOrder.view.html',
                controller: 'WorkOrderController',
                controllerAs: 'vm'
            })
			.state('menu.footer.constr', {
				url: '/constr',
				templateUrl: 'public/construction.view.html',
				controller: 'ConstructionController',
				controllerAs: 'vm'
			})

        $urlRouterProvider.otherwise('/home');

    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$httpBackend', '$translate', 'UserTokenService', 'FlashService', 'tmhDynamicLocale'];

    function run($rootScope, $location, $cookies, $http, $httpBackend, $translate, UserTokenService, FlashService, tmhDynamicLocale) {

        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        $rootScope._username = $cookies.get('username');
        if ($cookies.get('language')) {
        	tmhDynamicLocale.set($cookies.get('language'));
            $translate.use($cookies.get('language'));
        }

        $rootScope.$on('$login', function (event) {
            //$rootScope.$broadcast('login',true);
            $rootScope._username = $cookies.get('username');
        });

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            //$rootScope.globals = $cookies.getObject('globals') || {};
            //var re = new RegExp('^\/([a-zA-Z0-9-]*)');
            //var locationarray = re.exec($location.path());
            //var restrictedPage = locationarray === null || $.inArray(String(locationarray[0]), ["/reset", "/home", "/login", "/register", "/account","/trade", "/support", "/news", "/supportMobile", "/newsMobile", "/linkMobile", '/linkSina']) === -1;
            if ($rootScope.globals && $rootScope.globals.token) {
                $rootScope.globals.logged_in = true;
                //} else if (restrictedPage) {
                //    $rootScope.globals.logged_in = false;
                //    $location.path('/home');
            } else {
                $rootScope.globals.logged_in = false;
                $rootScope._username = $cookies.remove('username');
            }
            UserTokenService.KeepAlive();

            // Re-Initialize slidebra
            // $(document).ready(function () {
            //     $('#sidebar').sidr({
            //         name: 'sidr-right',
            //         side: 'right',
            //         source: '#menu_main, #menu_logout'
            //     });
            // });

        });

        //function refreshToken() {
        //    $rootScope.globals = $cookies.getObject('globals');
        //    if ($rootScope.globals && $rootScope.globals.token) {
        //        if (!UserTokenService.CheckAlive()) {
        //            UserTokenService.ClearCredentials();
        //            $translate("MESSAGE.ERROR_USERTOKEN_VERIFY")
        //                .then(function (data) {
        //                    FlashService.Error(data, true);
        //                    $location.url('/login');
        //                });
        //        }
        //        UserTokenService.Refresh($rootScope.globals.token)
        //            .then(function (response) {
        //                if (response.success)
        //                    UserTokenService.SetCredentials(response.data.token);
        //                else {
        //                    if (response.message === 'ERR_TOKEN_INVALID') {
        //                        $translate("MESSAGE.ERROR_USERTOKEN_VERIFY")
        //                            .then(function (data) {
        //                                FlashService.Error(data, true);
        //                                $location.url('/login');
        //                            });
        //                    }
        //                }
        //            });
        //    }
        //}

        //setInterval(function () {
        //    refreshToken();
        //}, 10000);
    }

})();

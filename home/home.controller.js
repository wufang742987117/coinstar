(function () {
  'use strict';

  angular
      .module('app')
      .controller('HomeController', HomeController)
    .filter('amount', function() {
        return function(number) {
            var number = parseInt(number);
            if (number.toString() == 'NaN') number = 0;
            return number / Math.pow(10, 8);
        };
    }).directive("goDown", function() {
      return {
          restrict : "E",
          link : function(scope, element, attr) {
              var e = $(element);
              var bottomDivHeight = $('body').outerHeight();
              e.click(function() {
                  $('body, html').animate({
                      "scrollTop" : bottomDivHeight
                  },500)
              })
          }
      }
  });
  function HomeController($scope,$rootScope,$location,NewsService, PrivateService, PublicService, $filter, $interval, FlashService, $q, $translate,$stateParams,$http) {
      // $('.carousel').carousel({
      //   interval: 3000
      // })
			
			
// 			$(".top_main").headroom( {
// 				"tolerance" : 80,
// 				"offset" : 5,
// 				"classes" : {
// 					"initial" : "animated",
// 					"pinned" : "flipInX",
// 					"unpinned" : "flipOutX"
// 				}
// 			});
			
      $scope.timers = 6;
			$scope.plateDateArr = [];
      $scope.param = {
          newslist: [],
          noticeslist: [],
          newcount: 3,
          noticecount: 3
      };
			if(!$scope.language) {
				$scope.language = $translate.use();
			}
//       $scope.newData=[];
//       $scope.noticeData=[];
//       (function init() {
//           queryNewsList('NEWS', 'zh', $scope.param.newcount);
//           queryNoticeList('NOTICE', 'zh', $scope.param.noticecount);
//       })();
// 
//       //查询新闻列表
//       var keepGoing = true;
//       var keepGoing2= true;
//       function queryNewsList(topic, language, count) {
//           NewsService.ListArticles(topic, language, count)
//               .then(function (response) {
//                   if (response.success) {
//                       $scope.newData=response.data.data;
//                       $scope.newData.forEach(function (val,index,arr) {
//                           if(keepGoing){
//                               if(index === 2){
//                                   keepGoing = false;
//                               }
//                               $scope.param.newslist.push($scope.newData[index]);
//                           }
//                       });
//                   }
//               });
//       }

//       $scope.getDetailUrl = function (id) {
//           $location.path('/news/detail/' + id);
// 
//       }
			// $scope.plateDateArr[j].data = [];
			PublicService.getPlates().then(function (res) {
				 $scope.plateDateArr = res.data;
				 $scope.service('getTradingPairs', [], (data) => {
				 		if (data.success) {
				 				$scope.tradingPairsData = data.data.data;
								for(var i=0;i<$scope.tradingPairsData.length;i++) {
									for(var j=0;j<$scope.plateDateArr.length;j++) {
										if(!$scope.plateDateArr[j].data) {
												$scope.plateDateArr[j].data = [];
										}
										$scope.plateDateArr[j].trading_pairs = angular.fromJson($scope.plateDateArr[j].trading_pairs);
										for(var z=0;z<$scope.plateDateArr[j].trading_pairs.length;z++) {
											if($scope.plateDateArr[j].trading_pairs[z] == $scope.tradingPairsData[i].name) {
												$scope.plateDateArr[j].data.push({
													"assets":$scope.tradingPairsData[i].bid_asset_symbol+"/"+$scope.tradingPairsData[i].ask_asset_symbol,
													"name":$scope.plateDateArr[j].trading_pairs[z]
												})
											}
										}
									}
								}
								// console.log($scope.plateDateArr);
				 				$scope.getTickers();
				 				$scope.loopGetTickers();
				 		}
				 })
			})
			
      //查询公告列表
      function queryNoticeList(topic, language, count) {
          NewsService.ListArticles(topic, language, count)
              .then(function (response) {
                  if (response.success) {
                     // $scope.param.noticeslist = response.data.data;
                      $scope.noticeData=response.data.data;
                      $scope.noticeData.forEach(function (val,index,arr) {
                          if(keepGoing2){
                              if(index === 2){
                                  keepGoing2 = false;
                              }
                              $scope.param.noticeslist.push($scope.noticeData[index]);
                          }
                      });
                  }
              });
      }

      $scope.getTickers = function() {
					
          $scope.service('GetTickers', [], (data) => {
              if (data.success) {
              $scope.tickersData = data.data;
							for(var i=0;i<$scope.tickersData.length;i++) {
								for(var j=0;j<$scope.plateDateArr.length;j++) {
									for(var z=0;z<$scope.plateDateArr[j].data.length;z++) {
										if($scope.plateDateArr[j].data[z].name == $scope.tickersData[i].market) {
											$scope.plateDateArr[j].data[z].last = $scope.tickersData[i].last;
											$scope.plateDateArr[j].data[z].high24h = $scope.tickersData[i].high24h;
											$scope.plateDateArr[j].data[z].low24h = $scope.tickersData[i].low24h;
											$scope.plateDateArr[j].data[z].vol24h = $scope.tickersData[i].vol24h;
											$scope.plateDateArr[j].data[z].quote_change = Math.round(($scope.tickersData[i].last /$scope.tickersData[i].last24h - 1) * 10000) / 100;
											if($scope.plateDateArr[j].data[z].quote_change.toString() == 'NaN'||$scope.plateDateArr[j].data[z].quote_change =='Infinity') {
												$scope.plateDateArr[j].data[z].quote_change = 0;
											}
// 											$scope.plateDateArr[j].data[z].push({
// 												"last":$scope.tickersData[i].last,
// 												"high24h":$scope.tickersData[i].high24h,
// 												"low24h":$scope.tickersData[i].low24h,
// 												"vol24h":$scope.tickersData[i].vol24h,
// 												"quote_change":Math.round(($scope.tickersData[i].last /$scope.tickersData[i].last24h - 1) * 10000) / 100
// 											})
										}
									}
								}
							}
							for(var i=0;i<$scope.plateDateArr.length;i++) {
									$scope.plateDateArr[i].zh_Name = $scope.plateDateArr[i].name.split('|')[0];
									$scope.plateDateArr[i].en_Name = $scope.plateDateArr[i].name.split('|')[1];
							}
							console.log($scope.plateDateArr);
// 							$scope.tickersData.forEach(function (val,index,arr) {
// 										if(val.market === 'BTCUSDT'){
// 											$scope.btcUsdtDataList=$scope.tickersData[index];
// 											}
// 									if(val.market === 'ETHUSDT'){
// 											$scope.ethUsdtDataList=$scope.tickersData[index];
// 									}
// 									if(val.market === 'DSCBUSDT'){
// 											$scope.dscbUsdtDataList=$scope.tickersData[index];
// 									}
// 							});
//               $scope.tickersData.forEach(v => {
//                   // v.asset = v.market.substr(0, v.market.length - 3);
//                   if(v.market=='BTCUSDT') {
//                       $scope.btcUsdtDataList.quote_change=Math.round((v.last / v.last24h - 1) * 10000) / 100;
//                       if ($scope.btcUsdtDataList.quote_change.toString() == 'NaN') $scope.btcUsdtDataList.quote_change = 0;
//                   }
//                   if(v.market=='ETHUSDT') {
//                       $scope.ethUsdtDataList.quote_change=Math.round((v.last / v.last24h - 1) * 10000) / 100;
//                       if ($scope.ethUsdtDataList.quote_change.toString() == 'NaN') $scope.ethUsdtDataList.quote_change = 0;
//                   }
//                   if(v.market=='DSCBUSDT') {
//                       $scope.dscbUsdtDataList.quote_change=Math.round((v.last / v.last24h - 1) * 10000) / 100;
//                       if ($scope.dscbUsdtDataList.quote_change.toString() == 'NaN') $scope.dscbUsdtDataList.quote_change = 0;
// 									}
//               v.difference = v.last - v.last24h;
// 						})
          }
      })
      }

      // private api
      $scope.privateMethod = ['getSettings', 'createTransactionOrder', 'getCurrentTCommission', 'getHistoryTCommission', 'getTradesFromOrders', 'getWithdrawalHistory', 'checkTpass', 'deleteOrder', 'getOrderHistory', 'getTradingPairs', 'Balances'];
      // 网络请求
      $scope.service = function(reqMethod, params, callback) {
          if ($scope.loading[reqMethod]) return;
          $scope.loading[reqMethod] = true;
          if ($scope.privateMethod.indexOf(reqMethod) != -1) {
              PrivateService[reqMethod](...params)
                  .then((data) => {
                      $scope.loading[reqMethod] = false;
                      callback(data);
                  })
          } else {
              PublicService[reqMethod](...params)
                  .then((data) => {
                      $scope.loading[reqMethod] = false;
                      callback(data);
                  })
          }
      }
			
			$scope.advantage_bod_type = 1;
			
			$('.advantage_bod ul li').hover(function(){
					$(this).addClass('advantage-select').siblings('li').removeClass('advantage-select');
					$scope.advantage_bod_type = $(this).attr('data-id');
					$scope.$apply();
			},function(){
					
			});
	
      //加载主页banner图
      $scope.bannerList=[];
      PublicService.GetBanner()
          .then(function (response) {
              if (response.success) {
                  $scope.bannerList=response.data.data;
              }
          });

      // loop get tickers
      $scope.loopGetTickers = function() {
          $scope.timeMachine = $interval(function() {
              $scope.getTickers();
          }, $scope.timers * 1000);
      }

      // 是否正在加载
      $scope.loading = {
          GetTickers: false,
          GetBTCtoUSDT:false,
          ticker: false,
          delegate: false,
          realtime: false,
          userCurrentDelegate: false,
          GetUStoRMB:false,
          GetGoldPrice: false
      }
      // 清除定时器定时
      $scope.$on('$destroy', function() {
          $interval.cancel($scope.timeMachine);
      });

      // 小数位
      $scope.getTradingPairs = function() {
          
      }
			
			$scope.startBanner = function() {
      $('.jquery-reslider').reSlider({
      	speed:1000,//设置轮播的高度
      	delay:10000,//设置轮播的延迟时间
      	imgCount:6,//设置轮播的图片数
      	dots:true,//设置轮播的序号点
      	autoPlay:true//设置轮播是否自动播放
      });
    }
    $scope.startBanner()

			
      $scope.getTradingPairs();

      $scope.data = {
          current: 1
      };
      $scope.actions =
          {
              setCurrent: function (param) {
                  $scope.data.current = param;
              }
          }
  }
})()


  // function HomeController($scope, PublicService, PrivateService, $interval, $filter) {
  //   $scope.firstLoadPage = true;
  //   // 行情数据
  //   $scope.tickersData = {};
  //   // 当前选择币种
  //   $scope.activeTicker = {};
  //   // 默认选择币种
  //   $scope.defaultMarket= 'ETHBTC';
  //   // 首页显示币种
  //   $scope.homeMarkets = ['ETHBTC'];
  //
  //   // 第一次加载
  //   $scope.candlestickFirst = true;
  //   // 交易量数据
  //   $scope.candlestickData = [];
  //   // 交易新数据点缓冲区
  //   $scope.candlestickDataBuffer = [];
  //
  //   $scope.go_top = function () {
  //     window.scroll(0, 0);
  //   };
  //
  //
  //
  //   $scope.init = function () {
  //     getTickers();
  //     getMobileVersion('android');
  //     getMobileVersion('ios');
  //
  //   };
  //   $scope.init();
  //
  //
  //   //获得市场
  //   function getTickers() {
  //     PublicService.GetTickers()
  //       .then(function (response) {
  //         if(response.success) {
  //           response.data.forEach(v => {
  //             v.asset = v.market.substr(0, v.market.length - 3);
  //             v.quote_change = Math.round((v.last / v.last24h - 1) * 10000) / 100;
  //             if (v.quote_change.toString() == 'NaN') v.quote_change = 0;
  //             v.difference = v.last - v.last24h;
  //           })
  //
  //           for(var i=0; i<response.data.length; i++) {
  //             $scope.tickersData[response.data[i].market] = response.data[i];
  //           }
  //
  //           if($scope.firstLoadPage) {
  //             $scope.activeTicker = $scope.tickersData[$scope.defaultMarket];
  //             $scope.firstLoadPage = false;
  //             $scope.candlestick();
  //           }
  //         }
  //       }, function (error) {
  //         $scope.error = error;
  //       });
  //   }
  //
  //   //点击市场
  //   $scope.marketClick = function (ticker) {
  //     $scope.myshow = !$scope.myshow;
  //     if($scope.activeTicker.market == ticker.market) return;
  //     $scope.activeTicker = ticker;
  //     $interval.cancel($scope.updateStockChartTimer);
  //
  //     // 第一次加载
  //     $scope.candlestickFirst = true;
  //     // 交易量数据
  //     $scope.candlestickData = [];
  //     // 交易新数据点缓冲区
  //     $scope.candlestickDataBuffer = [];
  //
  //     $scope.candlestick();
  //   };
  //
  //   //获取安卓或者ios下载api
  //   function getMobileVersion(type) {
  //     PrivateService.getMobileVersion(type)
  //       .then(function (response) {
  //         if (response.success) {
  //           if (type == 'android') {
  //             $scope.android = response.data;
  //             qrcode($scope.android.download_url);
  //           } else {
  //             $scope.ios = response.data;
  //           }
  //         }
  //       });
  //   }
  //
  //
  //
  //   $scope.lineChartFunc = function() {
  //     Highcharts.setOptions({
  //       global : {
  //         useUTC : false
  //       }
  //     });
  //     // Create the chart
  //     $('#container').highcharts('StockChart', {
  //       colors: ['#40B2F0'],
  //       credits: {
  //         enabled: false
  //       },
  //       chart : {
  //         zoomType: 'x',
  //         events : {
  //           load : function () {
  //             // set up the updating of the chart each second
  //             var series = this.series[0];
  //             // 从缓冲区拿数据并清空缓冲区
  //              $scope.updateStockChartTimer = $interval(function () {
  //               if($scope.candlestickDataBuffer.length > 0) {
  //                 console.log('Add Point:: ' + JSON.stringify($scope.candlestickDataBuffer));
  //                 for(var i=0; i<$scope.candlestickDataBuffer.length; i++) {
  //                   series.addPoint($scope.candlestickDataBuffer[i], true, true);
  //                   $scope.candlestickData.push($scope.candlestickDataBuffer[i]);
  //                 }
  //                 $scope.candlestickDataBuffer = [];
  //               }
  //             }, 3000);
  //           }
  //         }
  //       },
  //       rangeSelector: {
  //         enabled: false
  //       },
  //       title : {
  //         text : $filter('translate')('HOME.PRICE_TREND')
  //       },
  //       exporting: {
  //         enabled: false
  //       },
  //       scrollbar : {
  //         enabled : false
  //       },
  //       navigator : {
  //         enabled : false
  //       },
  //       series : [{
  //         name : $scope.activeTicker.market,
  //         data : $scope.candlestickData
  //       }]
  //     });
  //   }
  //
  //   window.onscroll=function(){
  //     var st = $(document).scrollTop();
  //     if(st>700){
  //       if(!$('.phone-image').hasClass('keyframes-left')) {
  //         $('.phone-image').addClass('keyframes-left');
  //       }
  //       if(!$('.wx-code').hasClass('keyframes-right')) {
  //         $('.wx-code').addClass('keyframes-right');
  //       }
  //     }
  //   };
  //
  //   var height = window.innerHeight;
  //   $('.home-banner').css('min-height', height);
  //
  //   $scope.$on('$destroy', function() {
  //      $interval.cancel($scope.timer);
  //      $interval.cancel($scope.updateStockChartTimer);
  //      window.onscroll = undefined;
  //   });
  //   // make the container smaller and add a second container for the master chart
  //   var $container = $('#container')
  //     .css('position', 'relative');
  //   $('<div id="detail-container">')
  //     .appendTo($container);
  //   $('<div id="master-container">')
  //     .css({position: 'absolute', top: 300, height: 100, width: '100%'})
  //     .appendTo($container);
  // }






































// (function () {
//     'use strict';
//
//     angular
//         .module('app')
//         .controller('HomeController', HomeController);
//
//     function HomeController($scope, PublicService, PrivateService, $interval, $filter) {
//         $scope.firstLoadPage = true;
//         // 行情数据
//         $scope.tickersData = {};
//         // 当前选择币种
//         $scope.activeTicker = {};
//         // 默认选择币种
//         $scope.defaultMarket= 'ETHBTC';
//         // 首页显示币种
//         $scope.homeMarkets = ['ETHBTC'];
//
//         // 第一次加载
//         $scope.candlestickFirst = true;
//         // 交易量数据
//         $scope.candlestickData = [];
//         // 交易新数据点缓冲区
//         $scope.candlestickDataBuffer = [];
//
//         $scope.go_top = function () {
//             window.scroll(0, 0);
//         };
//
//
//
//         $scope.init = function () {
//             getTickers();
//             getMobileVersion('android');
//             getMobileVersion('ios');
//
//         };
//         $scope.init();
//
//
//         //获得市场
//         function getTickers() {
//             PublicService.GetTickers()
//                 .then(function (response) {
//                     if(response.success) {
//                         response.data.forEach(v => {
//                             v.asset = v.market.substr(0, v.market.length - 3);
//                         v.quote_change = Math.round((v.last / v.last24h - 1) * 10000) / 100;
//                         if (v.quote_change.toString() == 'NaN') v.quote_change = 0;
//                         v.difference = v.last - v.last24h;
//                     })
//
//                         for(var i=0; i<response.data.length; i++) {
//                             $scope.tickersData[response.data[i].market] = response.data[i];
//                         }
//
//                         if($scope.firstLoadPage) {
//                             $scope.activeTicker = $scope.tickersData[$scope.defaultMarket];
//                             $scope.firstLoadPage = false;
//                             $scope.candlestick();
//                         }
//                     }
//                 }, function (error) {
//                     $scope.error = error;
//                 });
//         }
//
//         //点击市场
//         $scope.marketClick = function (ticker) {
//             $scope.myshow = !$scope.myshow;
//             if($scope.activeTicker.market == ticker.market) return;
//             $scope.activeTicker = ticker;
//             $interval.cancel($scope.updateStockChartTimer);
//
//             // 第一次加载
//             $scope.candlestickFirst = true;
//             // 交易量数据
//             $scope.candlestickData = [];
//             // 交易新数据点缓冲区
//             $scope.candlestickDataBuffer = [];
//
//             $scope.candlestick();
//         };
//
//         //获取安卓或者ios下载api
//         function getMobileVersion(type) {
//             PrivateService.getMobileVersion(type)
//                 .then(function (response) {
//                     if (response.success) {
//                         if (type == 'android') {
//                             $scope.android = response.data;
//                             qrcode($scope.android.download_url);
//                         } else {
//                             $scope.ios = response.data;
//                         }
//                     }
//                 });
//         }
//
//         //生成二维码
//         function qrcode(url) {
//             qrcodelib.toCanvas(document.getElementById('qrcode'), url, {
//                 color: {
//                     dark: '#000000'
//                 },
//                 scale: 3
//             }, (error)=> {
//                 if (error != null)
//             console.log(error);
//         });
//         }
//
//         $scope.timer = $interval(function () {
//             getTickers();
//             $scope.candlestick();
//         }, 6000);
//
//         //鼠标移入移出生产二维码
//         $scope.createQrcode = function (url) {
//             qrcode(url);
//         };
//
//         // k线数据图
//         $scope.candlestick = function() {
//             if(!$scope.activeTicker.market) return;
//             var timeSymbol = "min1/" + $scope.activeTicker.market;
//             var symbol = "100";
//             PublicService.GetCandlestick(timeSymbol, symbol)
//                 .then(function (response) {
//                     if (response.success) {
//                         if($scope.candlestickFirst) {
//                             for (var i=0; i<response.data.length; i++) {
//                                 $scope.candlestickData.push([
//                                     response.data[i][0],
//                                     response.data[i][4]/Math.pow(10, 8)
//                                 ]);
//                             }
//                             $scope.candlestickFirst = false;
//                             $scope.lineChartFunc();
//                         } else {
//                             var last = $scope.candlestickData[$scope.candlestickData.length-1];
//                             var length = response.data.length;
//                             var newestIndex = response.data.length-1;
//                             for(var i=length-1; i>=0; i--) {
//                                 if(last[0]==response.data[i][0]) {
//                                     newestIndex = i;
//                                     break;
//                                 }
//                             }
//                             // console.log('NewestIndex::' + newestIndex);
//                             for(var j=newestIndex+1; j<length; j++) {
//                                 // console.log('In Loop::' + j);
//                                 $scope.candlestickDataBuffer.push([
//                                     response.data[j][0],
//                                     response.data[j][4]/Math.pow(10, 8)
//                                 ])
//                             }
//                             // console.log('Buffer INSERT::' + JSON.stringify($scope.candlestickDataBuffer));
//                         }
//                     }
//                 });
//         }
//
//         $scope.lineChartFunc = function() {
//             Highcharts.setOptions({
//                 global : {
//                     useUTC : false
//                 }
//             });
//             // Create the chart
//             $('#container').highcharts('StockChart', {
//                 colors: ['#40B2F0'],
//                 credits: {
//                     enabled: false
//                 },
//                 chart : {
//                     zoomType: 'x',
//                     events : {
//                         load : function () {
//                             // set up the updating of the chart each second
//                             var series = this.series[0];
//                             // 从缓冲区拿数据并清空缓冲区
//                             $scope.updateStockChartTimer = $interval(function () {
//                                 if($scope.candlestickDataBuffer.length > 0) {
//                                     console.log('Add Point:: ' + JSON.stringify($scope.candlestickDataBuffer));
//                                     for(var i=0; i<$scope.candlestickDataBuffer.length; i++) {
//                                         series.addPoint($scope.candlestickDataBuffer[i], true, true);
//                                         $scope.candlestickData.push($scope.candlestickDataBuffer[i]);
//                                     }
//                                     $scope.candlestickDataBuffer = [];
//                                 }
//                             }, 3000);
//                         }
//                     }
//                 },
//                 rangeSelector: {
//                     enabled: false
//                 },
//                 title : {
//                     text : $filter('translate')('HOME.PRICE_TREND')
//                 },
//                 exporting: {
//                     enabled: false
//                 },
//                 scrollbar : {
//                     enabled : false
//                 },
//                 navigator : {
//                     enabled : false
//                 },
//                 series : [{
//                     name : $scope.activeTicker.market,
//                     data : $scope.candlestickData
//                 }]
//             });
//         }
//
//         window.onscroll=function(){
//             var st = $(document).scrollTop();
//             if(st>700){
//                 if(!$('.phone-image').hasClass('keyframes-left')) {
//                     $('.phone-image').addClass('keyframes-left');
//                 }
//                 if(!$('.wx-code').hasClass('keyframes-right')) {
//                     $('.wx-code').addClass('keyframes-right');
//                 }
//             }
//         };
//
//         var height = window.innerHeight;
//         $('.home-banner').css('min-height', height);
//
//         $scope.$on('$destroy', function() {
//             $interval.cancel($scope.timer);
//             $interval.cancel($scope.updateStockChartTimer);
//             window.onscroll = undefined;
//         });
//         // make the container smaller and add a second container for the master chart
//         var $container = $('#container')
//             .css('position', 'relative');
//         $('<div id="detail-container">')
//             .appendTo($container);
//         $('<div id="master-container">')
//             .css({position: 'absolute', top: 300, height: 100, width: '100%'})
//             .appendTo($container);
//     }
// })();


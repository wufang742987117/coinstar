'use strict';

angular.module('app')
  .controller('TradeController', TradeController)
  .filter('amount', function () {
    return function (number) {
      var number = parseInt(number);
      if (number.toString() == 'NaN') number = 0;
      return number / Math.pow(10, 8);
    };
  }).filter('formatNumber', function () {
    return function (num) {
      if(isNaN(num))
        return '';
      var str = num.toFixed(8);
			var index = -1;
			for(var i = str.length - 1; i > 0; --i)  {
				if(str[i] != '0') {
					if(str[i] == '.') {
						index = i;
					} else {
						index = i + 1;
					}
					break;
				}
			}
			return str.substring(0, index);
    };
  })
  .filter('trustAsResourceUrl', function ($sce) {
    return function (val) {
      return $sce.trustAsResourceUrl(val);
    };
  });

function TradeController($scope, $rootScope, PrivateService, PublicService, $filter, $interval, FlashService, $q, $translate, $stateParams, $http) {
	 
	 window.onscroll= function(){
			//变量t是滚动条滚动时，距离顶部的距离
			var t = document.documentElement.scrollTop||document.body.scrollTop;
			var scrollup = document.getElementById('header');
			
			//当滚动到距离顶部200px时，返回顶部的锚点显示
// 			if(window.screen.width>500) {
// 				if(t>=80){
// 						scrollup.style.display="none";
// 				}else{          //恢复正常
// 						scrollup.style.display="block";
// 				}
// 			}
	}
// 	$(".header-wrap").headroom( {
// 		"tolerance" : 80,
// 		"offset" : 5,
// 		"classes" : {
// 			"initial" : "animated",
// 			"pinned" : "flipInX",
// 			"unpinned" : "flipOutX"
// 		}
// // 	});
// 	$(".header-wrap").headroom({
//   "tolerance": 5,
//   "offset": 80,
//   "classes": {
//     "initial": "animated",
//     "pinned": "slideDown",
//     "unpinned": "slideUp"
//   }
// });

// to destroy
  /**
   * ------------------------------------
   * 数据结构
   * ------------------------------------
   */
    // 当前选择币种，默认BTC
  // var savedDefaultAsset = localStorage.getItem('__selectedAsset__');  //左上角第一个货币
  // $scope.defaultAsset = savedDefaultAsset ? savedDefaultAsset : "BTC";

  // var savedDefaultGroup = localStorage.getItem('__selectedGroup__'); //左边market下第一个货币
  // $scope.defaultGroup = savedDefaultGroup ? savedDefaultGroup : "GCC";

  $scope.selectedTradePair = localStorage.getItem('__selectedTradePair__');
  
  $scope.init = false;
  // loadAndDraw($scope.activeTicker.market, 'min15');


  // 是否需要输入tpass
  $scope.needTpass = true;

  // 定时器 秒
  $scope.timers = 6;

  $scope.changeAssetInit = false;

  $scope.globals = $rootScope.globals;

  // 小数位设置
  $scope.tradingPairsData = [];

  // 行情动态
  $scope.tickersData = [];
  // $scope.tickersSelectedGroup=;
  // 行情动态分组数据

  $scope.tickersSelectedGroup = 'BTC';
  $scope.tickersGroupData = {};

  var savedTickersSort = (() => {
    var temp = undefined;
    try {
      temp = JSON.parse(localStorage.getItem('__tickersSort__'))
    } catch (e) {
    }
    return temp;
  })();
  $scope.tickersSort = savedTickersSort ? savedTickersSort : {};
  // 当前选择ticker
  $scope.activeTicker = {};

  // 委托信息
  $scope.delegateData = {
    ask: [],
    bid: []
  };
  //1:正常，2：买单，3：卖单
  $scope.delegateDataMode = 1;
  // 档位，默认5
  var savedDelegateCount = parseInt(localStorage.getItem('__delegateCount__'));
  $scope.delegateCount = savedDelegateCount ? savedDelegateCount : 5;
  $scope.delegateStalls = [{
    label: 5,
    value: 5
  },
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
  ]

  // 设置
  $scope.settingsData = {};
  // 余额
  $scope.balanceData = {};
  // 实时成交
  $scope.realtimeData = [];
  // 用户当前委托
  $scope.userCurrentDelegate = [];
  // 交易密码
  $scope.tpass = undefined;

  // 当前委托订单
  $scope.orderCurrentData = [];
  $scope.orderCurrentScroll = true;
  // 历史委托订单
  $scope.orderHistoryData = [];
  $scope.orderHistoryPager = {
    pageSize: 10,
    totalItems: 0,
    currentPage: 1
  }
  $scope.orderDetailPopup = false;
  // 历史委托成交
  $scope.orderDetailData = {
    total: 0,
    data: []
  };
  // 撤销委托订单
  $scope.orderCancelData = [];
  $scope.orderCancelPager = {
    pageSize: 10,
    totalItems: 0,
    currentPage: 1
  };
	
	//默认交易方式
  $scope.actionTab = 'limit';
  $scope.historyTab = 'current';
	
	//限价/市价切换
	$scope.tradeShow = function(i) {
			$scope.actionTab = i;
	}

  // 当前创建order的类型
  $scope.createOrderLoadingType = undefined;
  // 限价买
  $scope.limitBuyData = {
    tpass: undefined,
    scode: undefined,
    side: 'BUY',
    type: 'LIMIT',
    quantity: 0,
    limit: 0,
    total: 0,
    balanceErr: false,
    percentage: 0,
    sliderOptions: {
      floor: 0,
      ceil: 100,
      onChange: function () {
        $scope.buyWatchGroup.percentage('limitBuyData')
      }
    }
  }
  // 限价卖
  $scope.limitSellData = {
    tpass: undefined,
    scode: undefined,
    side: 'SELL',
    type: 'LIMIT',
    quantity: 0,
    limit: 0,
    total: 0,
    balanceErr: false,
    percentage: 0,
    sliderOptions: {
      floor: 0,
      ceil: 100,
      onChange: function () {
        $scope.sellWatchGroup.percentage('limitSellData')
      }
    }
  }
  // 市价买
  $scope.marketBuyData = {
    tpass: undefined,
    scode: undefined,
    side: 'BUY',
    type: 'MARKET',
    quantity: 0,
    limit: 0,
    total: 0,
    balanceErr: false,
    percentage: 0,
    sliderOptions: {
      floor: 0,
      ceil: 100,
      onChange: function () {
        $scope.buyWatchGroup.percentage('marketBuyData')
      }
    }
  }
  // 市价卖
  $scope.marketSellData = {
    tpass: undefined,
    scode: undefined,
    side: 'SELL',
    type: 'MARKET',
    quantity: 0,
    limit: 0,
    total: 0,
    balanceErr: false,
    percentage: 0,
    sliderOptions: {
      floor: 0,
      ceil: 100,
      onChange: function () {
        $scope.sellWatchGroup.percentage('marketSellData')
      }
    }
  }
  
  //切换深度模式
  $scope.changeDepthMode = function(type) {
    $scope.delegateDataMode = type
  }

  // 是否正在加载
  $scope.loading = {
    GetTickers: false,
    GetBTCtoUSDT: false,
    ticker: false,
    delegate: false,
    realtime: false,
    userCurrentDelegate: false,
    GetUStoRMB: false,
    GetGoldPrice: false
  }
  //是否是app走进来的
  $scope.lastApp = 0;
  // private api
  $scope.privateMethod = ['getSettings', 'createMarketOrder', 'createTransactionOrder', 'getCurrentTCommission', 'getHistoryTCommission', 'getTradesFromOrders', 'getWithdrawalHistory', 'checkTpass', 'deleteOrder', 'getOrderHistory', 'getTradingPairs', 'Balances'];
  // 网络请求
  $scope.service = function (reqMethod, params, callback) {
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


  // 交易头部处理开始
    $scope.toggleShow = false;
    $scope.rightToggChange = function() {
        $scope.rightToggleShow = false;
    }
    if(localStorage.getItem('_asset_list_')){
        $scope.asset_list = JSON.parse(localStorage.getItem('_asset_list_'))
    }
    $scope.toggleUL = function() {
        if($scope.toggleShow ==false){
            $scope.toggleShow = true;
        }else
            $scope.toggleShow = false;
    }
    $scope.defayltChange = function(key) {
      $scope.toggleShow = false;
      $scope.tickersGroupData[key.trading_pair.ask_asset_symbol].forEach(function (val) {
        if(val.market == key.market) {
          return $scope.selectTicker(val)
        }
      
      })
      
    }
    $scope.rightToggleShow = false;
    $scope.rightToggle = function () {
        if($scope.rightToggleShow == false) {
            $scope.rightToggleShow = true
        }else
            $scope.rightToggleShow = false;
    }
    // 交易头部处理结束

  $scope.initPage = function () {
    if ($stateParams.type) {
      $scope.tickersData.forEach(function (val, index, arr) {
        if (val.market == $stateParams.type) {
          $scope.selectTicker($scope.tickersData[index]);
          if (val.trading_pair.ask_asset_symbol == 'BTC') {
            $scope.lastApp = 1;
          } else {
            $scope.lastApp = 0;

          }
        }
      });
    } else {
      if ($scope.defaultAsset) {
        //  第一次进来后没有任何点击事件后，默认localstorage 里 asset 是BTC
        var keepGoing = true;
        $scope.tickersData.forEach(v => {
          if (keepGoing) {
            if (v.asset == $scope.defaultAsset) {
              if (v.trading_pair.ask_asset_symbol == $scope.defaultGroup) {  //用户第一次进来没有任何点击事件后，第二次刷新进来
                // console.log(v)
                $scope.selectTicker(v);
                // console.log(v)
                keepGoing = false;
              }
            }
          }
        });
      } else {   //用户第一次进来，没有缓存的情况下 ,默认勾选第一个
        if($scope.selectedTradePair) {
          $scope.tickersData.forEach(function (val, index, arr) {
            if(val.market == $scope.selectedTradePair) {
              return $scope.selectTicker(val);
            }
          });
        } else {
          return $scope.selectTicker($scope.tickersData[0]);
        }
      }
      if ($scope.defaultGroup) {
        $scope.switchTickerGroup($scope.defaultGroup);
      }
      // 如果已经登录
      if ($scope.globals.logged_in) {
        $scope.getSettings();
        $scope.getBalance();
        // $scope.checkTpass();
      }
    }
    $scope.init = true;
  }
  // 小数位
  $scope.getTradingPairs = function () {
    $scope.service('getTradingPairs', [], (data) => {
      if (data.success) {
        $scope.tradingPairsData = data.data.data;
        localStorage.setItem('_asset_list_',JSON.stringify($scope.tradingPairsData));
        $scope.getTickers();
        $scope.loopGetTickers();
      }
    })
  }
  $scope.getTradingPairs();
  $scope.refreshMarketPrice = function() {
    $scope.service('GetCandlestickByPage', ['min5', $scope.activeTicker.market],(data) => {
      if(data.data && data.data[0] && data.data[0].length == 6) {
        $scope.marketBuyData.limit = data.data[0][3] / 1e8
        $scope.marketSellData.limit = data.data[0][4] / 1e8
      }
    })
  }
  
  $scope.getTickers = function () {
    $scope.service('GetTickers', [], (data) => {
      if (data.success) {
        $scope.tickersData = data.data;
        $scope.tickersData.forEach(v => {
          // v.asset = v.market.substr(0, v.market.length - 3);
          v.quote_change = Math.round((v.last / v.last24h - 1) * 10000) / 100;
          if (v.quote_change.toString() == 'NaN') v.quote_change = 0;
          v.difference = v.last - v.last24h;
        })
      }
      $scope.mergeTickerPairData();
      $scope.groupTickerData();
      $scope.GetUStoRMB();
      if ($scope.tickersSelectedGroup) {
        $scope.sortTickersAction();
        $scope.GetBTCtoUSDT();
        $scope.GetGoldPrice();
        $scope.GetUStoRMB();
      }
      if (!$scope.init) {
        $scope.initPage();
      } else {
        for (var i = 0; i < $scope.tickersData.length; i++) {
          if ($stateParams.type == $scope.tickersData[i].market) {
            $scope.activeTicker = $scope.tickersData[i];
          } else {
            if ($scope.tickersData[i].market == $scope.activeTicker.market) {
              $scope.activeTicker = $scope.tickersData[i];
              break;
            }
          }
        }
      }
    })
  }
  
  $scope.exchangeRate = function(amount, account, position, cash) {
		if(amount <= 0)
			return 0;
    if(account == 'USDT' || account == 'BTC' || account == 'GCC' || position == 'USDT' || position == 'BTC' || position == 'GCC')
      return getCash(amount, account, position, cash);
    //遍历间接市场
//     if($scope.tickersData.length != 0) {
//       for(var i = 0; i < $scope.tickersData.length; ++i) {
//         var val = $scope.tickersData[i];
//         var oa = val.trading_pair.ask_asset_symbol;
//         var op = val.trading_pair.bid_asset_symbol;
//         if(account == oa && (op == 'USDT' || op == 'GCC' || op == 'BTC')) {
//           return getCash(amount / val.last, op, null, cash);
//         }
//         if(account == op && (oa == 'USDT' || oa == 'GCC' || oa == 'BTC')) {
//         	return getCash(amount * val.last, oa, null, cash);
//         }
//         if(position == oa && (op == 'USDT' || op == 'GCC' || op == 'BTC')) {
//         	return getCash(amount * val.last, op, null, cash);
//         }
//         if(position == op && (oa == 'USDT' || oa == 'GCC' || oa == 'BTC')) {
//         	return getCash(amount / val.last, oa, null, cash);
//         }
//       }
//     }
    return 0;
  }
  
  function getCash(amount, account, position, cash) {
    var value = 0;
    if(position == 'USDT') {
    	if(cash == 'US')
        value = 1;
      else 
        value = $scope.dataUStoRMB;
    } else if(position == 'BTC') {
    	if(cash == 'US')
    		value = $scope.BtcToUsdt;
    	else 
    		value = $scope.BtcToUsdt * $scope.dataUStoRMB;
    } else if(position == 'GCC') {
    	if(cash == 'US')
    		value = $scope.goldPrice / $scope.dataUStoRMB;
    	else
    		value = $scope.goldPrice;
    } else if(account == 'USDT') {
    	if(cash == 'US')
    		value = amount/ Math.pow(10, 8);
    	else 
    		value = amount * $scope.dataUStoRMB/ Math.pow(10, 8);
    } else if(account == 'BTC') {
    	if(cash == 'US')
    		value = amount * $scope.BtcToUsdt/ Math.pow(10, 8);
    	else 
    		value = amount * $scope.BtcToUsdt * $scope.dataUStoRMB/ Math.pow(10, 8);
    } else if(account == 'GCC') {
    	if(cash == 'US')
    		value = amount * $scope.goldPrice / $scope.dataUStoRMB / Math.pow(10, 8);
    	else
    		value = amount * $scope.goldPrice / Math.pow(10, 8);
    }
    return value.toFixed(2);
  }

  $scope.GetBTCtoUSDT = function () {
    $scope.service('GetBTCtoUSDT', [], (data) => {
      if (data.success) {
        $scope.BtcToUsdt = data.data;
      }
    })
  }

  $scope.GetGoldPrice = function () {
    $http({
      method: 'GET',
      url: '/apis/api/getGoldPrice'
    }).then(function successCallback(response) {
      $scope.goldPrice = response.data.price;
    }, function (err) {
      console.log(err)
    });
  }

  $scope.GetUStoRMB = function () {
      $scope.dataUStoRMB=6.77;
      // PublicService.GetUStoRMB()
      //     .then(function (response) {
      //         if (response.success) {
      //             $scope.dataUStoRMB = data.data;
      //
      //         }
      //     });
    // $scope.service('GetUStoRMB', [], (data) => {
    //   if (data.success) {
    //     debugger;
    //     $scope.dataUStoRMB = data.data;
    //     // console.log($scope.dataUStoRMB)
    //   }
    // })
  }

  $scope.switchTickerGroup = function (key) {
    $scope.tickersSelectedGroup = key;
    localStorage.setItem('__selectedGroup__', key);
    // console.log($scope.tickersSelectedGroup)
    if ($scope.activeTicker.trading_pair.ask_asset_symbol != key) {
      $scope.selectTicker($scope.tickersGroupData[key][0]);
    }
  }

  // loop get tickers
  $scope.loopGetTickers = function () {
    $scope.timeMachine = $interval(function () {
      $scope.getTickers();
      $scope.getDelegate();
      $scope.getRealtime();
      $scope.GetUStoRMB();
      $scope.refreshMarketPrice();
      // 如果登录
      if ($scope.globals.logged_in) {

        if ($scope.historyTab == 'current') {
          $scope.getOrders();
        }

        // 刷新余额
        $scope.getBalance();
      }
    }, $scope.timers * 1000);
  }

  // 清除定时器定时
  $scope.$on('$destroy', function () {
    $interval.cancel($scope.timeMachine);
  });

  $scope.compare = function (obj1, obj2) {
    var val1 = obj1.name;
    var val2 = obj2.name;
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }

  // 排序操作
  $scope.sortTickersAction = function () {
    if (!$scope.tickersSort.field) return;
    if (!$scope.tickersGroupData[$scope.tickersSelectedGroup]) return;
    $scope.tickersGroupData[$scope.tickersSelectedGroup].sort(((field, sort) => {
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
    })($scope.tickersSort.field, $scope.tickersSort.sort))
  }

  // 排序点击事件
  $scope.sortTickers = function (field) {
    if ($scope.tickersSort.field == field) {
      $scope.tickersSort.sort = !$scope.tickersSort.sort;
    } else {
      $scope.tickersSort = {
        field: field,
        sort: false
      }
    }

    localStorage.setItem('__tickersSort__', JSON.stringify($scope.tickersSort));
    $scope.sortTickersAction();
  }

  // 合并tricker，pair数据
  $scope.mergeTickerPairData = function () {
    for (var i = 0; i < $scope.tickersData.length; i++) {
      for (var j = 0; j < $scope.tradingPairsData.length; j++) {
        if ($scope.tickersData[i].market == $scope.tradingPairsData[j].name) {
          $scope.tickersData[i].asset = $scope.tradingPairsData[j].bid_asset_symbol;
          $scope.tradingPairsData[j].ask_asset_decimals_step = Math.pow(10, -$scope.tradingPairsData[j].ask_asset_decimals);
          $scope.tradingPairsData[j].bid_asset_decimals_step = Math.pow(10, -$scope.tradingPairsData[j].bid_asset_decimals);
          $scope.tickersData[i].trading_pair = $scope.tradingPairsData[j];
          break;
        }
      }
      if (!$scope.tickersData[i].trading_pair) {
        $scope.tickersData[i].trading_pair = {
          ask_asset_decimals: 8,
          ask_asset_decimals_step: 0.00000001,
          bid_asset_decimals: 8,
          bid_asset_decimals_step: 0.00000001,
          chart_url: ''
        }
      }
    }
    // console.log($scope.tickersData)
  }

  // ticker分组
  $scope.groupTickerData = function () {
    $scope.tickersGroupData = {};
    for (var i = 0; i < $scope.tickersData.length; i++) {
      if (!$scope.tickersGroupData[$scope.tickersData[i].trading_pair.ask_asset_symbol]) {
        $scope.tickersGroupData[$scope.tickersData[i].trading_pair.ask_asset_symbol] = [];
      }
      $scope.tickersGroupData[$scope.tickersData[i].trading_pair.ask_asset_symbol].push($scope.tickersData[i]);
    }
  }

  // 选择币种
  $scope.selectTicker = function (item) {
    $scope.activeTicker = item;
    localStorage.setItem('__selectedAsset__', item.asset);
    localStorage.setItem('__selectedTradePair__', item.market);
    $scope.getDelegate();
    $scope.getRealtime();
    $scope.refreshMarketPrice();

    $scope.changeAssetInit = false;
    $scope.orderCurrentScroll = true;

    $scope.orderCurrentData = [];
    $scope.orderHistoryData = [];
    $scope.orderCancelData = [];

    // 如果登录
    if ($scope.globals.logged_in) {
      $scope.orderHistoryPager.currentPage = 1;
      $scope.orderCancelPager.currentPage = 1;
      $scope.tradeHistorySwitchTab($scope.historyTab);
    }

    //Graph selector
    $scope.masterPair = item.market;


    // $emits the required data for HighCharts
    // console.log("loadAndDraw:"+item.market);
    // console.log(item.market)
    $scope.$broadcast("loadAndDraw", {pair: item.market, period: '15'});
    
  }
  $scope.changeDelegateCount = function () {
    localStorage.setItem('__delegateCount__', $scope.delegateCount);
    $scope.getDelegate();
  }


  // 获取委托列表
  $scope.getDelegate = function () {
    $scope.service('GetDepth', [$scope.activeTicker.market, $scope.delegateCount], (data) => {
      if (data.success) {
        $scope.delegateData = data.data;
        if ($scope.changeAssetInit == false) {
          $scope.syncLimit('limitBuyData', $scope.delegateData.ask[0] ? $scope.delegateData.ask[0] : [$scope.activeTicker.last, 0, 0]);
          $scope.syncLimit('limitSellData', $scope.delegateData.bid[0] ? $scope.delegateData.bid[0] : [$scope.activeTicker.last, 0, 0]);
          $scope.changeAssetInit = true;
        }
        // $scope.syncMarket();

        if ($scope.orderCurrentScroll == true) {
          $scope.orderCurrentScroll = false;
          setTimeout(function () {
            var element = document.querySelector('#delegate-scroll');
            if (element) {
              element.scrollTop = element.scrollHeight - element.clientHeight;
            }
          }, 10);
        }

      } else {
        $scope.delegateData = {ask: [], bid: []};
      }
      $scope.$broadcast('OnDepth', $scope.delegateData)
    });
  }
	
  // 同步限价单价格
  $scope.syncLimit = function (action, item) {
    var number = $filter('amount')(item[0]);
    // console.log("item:"+item)
    $scope[action].limit = Math.round(number * Math.pow(10, $scope.activeTicker.trading_pair.ask_asset_decimals)) / Math.pow(10, $scope.activeTicker.trading_pair.ask_asset_decimals);
    // $scope[action].quantity = $filter('amount')(item[1]);
    // switch(action) {
    //   case 'limitBuyData':
    //     $scope.buyWatchGroup.limitAndQuantity(action);
    //   case 'limitSellData':
    //     $scope.sellWatchGroup.limitAndTotal(action);
    // }
  }
  // 同步市价单价格
  $scope.syncMarket = function () {
    var cnyBalance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol));
    var askLimit = 0;
    var sumAsk = 0;
    for (var i = 0; i < $scope.delegateData.bid.length; i++) {
      sumAsk += $filter('amount')($scope.delegateData.bid[i][0]) * $filter('amount')($scope.delegateData.bid[i][1]);
      if (sumAsk > cnyBalance) {
        askLimit = $filter('amount')($scope.delegateData.bid[i][0]);
        break;
      }
    }
    if (askLimit == 0 && $scope.delegateData.bid.length > 0) askLimit = $filter('amount')($scope.delegateData.bid[$scope.delegateData.bid.length - 1][0]);
    $scope.marketBuyData.limit = askLimit;

    var activeBalance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.asset));
    var bidLimit = 0;
    var sumBid = 0;
    for (var i = 0; i < $scope.delegateData.ask.length; i++) {
      sumBid += $filter('amount')($scope.delegateData.ask[i][0]) * $filter('amount')($scope.delegateData.ask[i][1]);
      if (sumBid > activeBalance) {
        bidLimit = $filter('amount')($scope.delegateData.ask[i][0]);
        break;
      }
    }
    if (bidLimit == 0 && $scope.delegateData.ask.length > 0) bidLimit = $filter('amount')($scope.delegateData.ask[$scope.delegateData.ask.length - 1][0]);
    $scope.marketSellData.limit = bidLimit;
  }

  // 获取实时交易
  $scope.getRealtime = function () {
    $scope.service('GetTrades', [$scope.activeTicker.market], (data) => {
      if (data.success) {
        $scope.realtimeData = data.data;
      } else {
        $scope.realtimeData = [];
      }
      // setTimeout(function() {
      //   var element = document.querySelector('#realtime-scroll');
      //   if(element) {
      //     element.scrollTop = element.scrollHeight - element.clientHeight;
      //   }
      // }, 10);
    });
  }

  // 获取设置信息
  $scope.getSettings = function () {
    $scope.service('getSettings', [], (data) => {
      if (data.success) {
        $scope.settingsData = data.data;
        if ($scope.settingsData.tpass.trading == 0) $scope.needTpass = false;
        $scope.checkTpass();
      }
    });
  }

  // 验证是否需要输入tpass
  $scope.checkTpass = function () {
    $scope.service('checkTpass', [], (data) => {
      if (data.success && data.data.status) {
        // 不用输入tpass
        $scope.needTpass = false;
      }
    });
  }

  // 获取余额
  $scope.getBalance = function () {
    $scope.service('Balances', [true], (data) => {
      if (data.success) {
        // 改数据结构
        var temp = {};
        for (var i = 0; i < data.data.length; i++) {
          temp[data.data[i].asset] = data.data[i];
        }
        $scope.balanceData = temp;
      }
    });
  }

  $scope.switchTab = function (tabGroup, tabName, callback) {
    $scope[tabGroup] = tabName;
    if (typeof callback == 'function') callback();
  }

  $scope.getBalanceByAsset = function (asset) {
    var balance = 0;
    if (typeof $scope.balanceData[asset] == 'object') {
      balance = $scope.balanceData[asset].balance;
    }
    return balance;
  }

  // 数字取整
  $scope.formatNumber = (number, decimal) => {
    if (number < 0 || number === null) {
      return undefined
    } else if (number === 0) {
      return 0
    }
    ;
    return Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

  // 买单数字更新逻辑
  $scope.buyWatchGroup = {
    total: (target) => {
      $scope[target].total = $scope.formatNumber($scope[target].total, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].total < 0) {
        $scope[target].total = undefined;
      }
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol));
      if ($scope[target].total > balance) {
        $scope[target].total = $scope.formatNumber(balance, $scope.activeTicker.trading_pair.ask_asset_decimals);
        $scope[target].balanceErr = true;
      } else {
        $scope[target].balanceErr = false;
      }
      $scope[target].quantity = $scope.formatNumber($scope[target].total / $scope[target].limit, $scope.activeTicker.trading_pair.bid_asset_decimals);
      $scope[target].percentage = parseInt($scope[target].total / balance * 100) || 0;
    },
    limit: (target) => {
      $scope[target].limit = $scope.formatNumber($scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].limit < 0) $scope[target].limit = undefined;
      $scope.buyWatchGroup.limitAndQuantity(target);
    },
    quantity: (target) => {
      $scope[target].quantity = $scope.formatNumber($scope[target].quantity, $scope.activeTicker.trading_pair.bid_asset_decimals);
      if ($scope[target].quantity < 0) $scope[target].quantity = undefined;
      $scope.buyWatchGroup.limitAndQuantity(target);
    },
    limitAndQuantity: (target) => {
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol));
      $scope[target].total = $scope.formatNumber($scope[target].quantity * $scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].total > balance) {
        $scope[target].total = $scope.formatNumber(balance, $scope.activeTicker.trading_pair.ask_asset_decimals);
        $scope[target].quantity = $scope.formatNumber($scope[target].total / $scope[target].limit, $scope.activeTicker.trading_pair.bid_asset_decimals);
        $scope[target].percentage = 100;
        $scope[target].balanceErr = true;
      } else {
        $scope[target].percentage = parseInt($scope[target].total / balance * 100) || 0;
        $scope[target].balanceErr = false;
      }
    },
    percentage: (target) => {
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol));
      $scope[target].total = $scope.formatNumber(balance * $scope[target].percentage / 100, $scope.activeTicker.trading_pair.ask_asset_decimals);
      $scope[target].quantity = $scope.formatNumber($scope[target].total / $scope[target].limit, $scope.activeTicker.trading_pair.bid_asset_decimals);
    }
  }

  // 卖单数字更新逻辑
  $scope.sellWatchGroup = {
    limit: (target) => {
      $scope[target].limit = $scope.formatNumber($scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].limit < 0) $scope[target].limit = 0;
      $scope.sellWatchGroup.limitAndTotal(target);
    },
    total: (target) => {
      $scope[target].total = $scope.formatNumber($scope[target].total, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].total < 0) $scope[target].total = 0;
      $scope.sellWatchGroup.limitAndTotal(target);
    },
    limitAndTotal: (target) => {
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.asset));

      $scope[target].quantity = $scope.formatNumber($scope[target].total / $scope[target].limit, $scope.activeTicker.trading_pair.bid_asset_decimals);
      if ($scope[target].quantity > balance) {
        $scope[target].quantity = $scope.formatNumber(balance, $scope.activeTicker.trading_pair.bid_asset_decimals);
        $scope[target].total = $scope.formatNumber($scope[target].total / $scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
        $scope[target].percentage = 100;
        $scope[target].balanceErr = true;
      } else {
        $scope[target].percentage = parseInt($scope[target].quantity / balance * 100) || 0;
        $scope[target].balanceErr = false;
      }
    },
    quantity: (target) => {
      $scope[target].quantity = $scope.formatNumber($scope[target].quantity, $scope.activeTicker.trading_pair.bid_asset_decimals);
      if ($scope[target].quantity < 0) {
        $scope[target].quantity = 0;
      }
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.asset));
      $scope[target].total = $scope.formatNumber($scope[target].quantity * $scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
      if ($scope[target].quantity > balance) {
        $scope[target].quantity = $scope.formatNumber(balance, $scope.activeTicker.trading_pair.bid_asset_decimals);
        $scope[target].total = $scope.formatNumber($scope[target].quantity * $scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
        $scope[target].percentage = 100;
        $scope[target].balanceErr = true;
      } else {
        $scope[target].percentage = parseInt($scope[target].quantity / balance * 100) || 0;
        $scope[target].balanceErr = false;
      }
    },
    percentage: (target) => {
      var balance = $filter('amount')($scope.getBalanceByAsset($scope.activeTicker.asset));
      $scope[target].quantity = $scope.formatNumber(balance * $scope[target].percentage / 100, $scope.activeTicker.trading_pair.bid_asset_decimals);
      $scope[target].total = $scope.formatNumber($scope[target].quantity * $scope[target].limit, $scope.activeTicker.trading_pair.ask_asset_decimals);
    }
  }

  // 获取当前订单
  $scope.getOrders = function () {
    $scope.service('getCurrentTCommission', [$scope.activeTicker.market], (data) => {
      // console.log(JSON.stringify(data))
      if (data.success) {
        var result = data.data;

        var temp = [];
        for (var i = 0; i < result.length; i++) {
          for (var j = 0; j < result[i].orders.length; j++) {
            temp.push(result[i].orders[j]);
          }
        }

        $scope.orderCurrentData = temp;

        $scope.sortCurrentOrder();
      }
    });
  }

  // 当前订单排序操作
  $scope.sortCurrentOrder = function () {
    $scope.orderCurrentData.sort(((field, sort) => {
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
    })('created', false))
  }

  // 获取历史订单
  $scope.getOrderHistory = function () {
    $scope.service('getHistoryTCommission', [$scope.activeTicker.market, $scope.orderHistoryPager.currentPage - 1, $scope.orderHistoryPager.pageSize], (data) => {
      if (data.success) {
        $scope.orderHistoryData = data.data.data;
        console.log($scope.orderHistoryData);
        $scope.orderHistoryPager.totalItems = data.data.count;
      }
    });
  }

  // 获取历史订单交易详情
  $scope.getTradesFromOrders = function (id) {
    $scope.orderDetailData = {
      total: 0,
      data: []
    };
    $scope.showOrderDetailPopup();
    setTimeout(function () {
      $('.trade-popup .inner').css('margin-top', ($('.trade-popup').height() - $('.trade-popup .inner').height()) / 2 + 'px')
    }, 0);
    $scope.service('getTradesFromOrders', [$scope.activeTicker.market, id], (data) => {
      if (data.success) {
        var total = 0;
        for (var i = 0; i < data.data.length; i++) {
          total += data.data[i].trade_total_price;
        }

        $scope.orderDetailData = {
          total: total,
          data: data.data
        };
        // var str=[];
        console.log($scope.orderDetailData.data);
        // for(var key in $scope.orderDetailData.data){
        //     str.push($scope.orderDetailData.data[key].total_fee)
        // }
        // console.log(str)
        // Fixed margin
      }
      setTimeout(function () {
        $('.trade-popup .inner').css('margin-top', ($('.trade-popup').height() - $('.trade-popup .inner').height()) / 2 + 'px')
      }, 20);
    });
  }

  // 获取已撤销订单
  $scope.getOrderCancel = function () {
    $scope.service('getWithdrawalHistory', [$scope.activeTicker.market, $scope.orderCancelPager.currentPage - 1, $scope.orderCancelPager.pageSize], (data) => {
      if (data.success) {
        $scope.orderCancelData = data.data.data;
        $scope.orderCancelPager.totalItems = data.data.count;
      }
    });
  }

  // 小数位fixed
  $scope.accMul = function (arg1, arg2) {
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  }

  $scope.GoogleReset = function () {
    $scope.limitBuyData.scode = '';
    $scope.limitSellData.scode = '';
  }
	
	$scope.typeSelectType='';
  
  $scope.changePercentage = function(type, percentage) {
		$scope.typeSelectType=type+percentage;
    $scope[type].percentage = percentage;
    if('limitBuyData' == type || 'marketBuyData' == type)
      $scope.buyWatchGroup.percentage(type);
    else
      $scope.sellWatchGroup.percentage(type);
    
  }
 // 创建市场订单
  $scope.createMarketOrder = function (type, watchGroup) {
    $scope.createOrderLoadingType = type;
    $scope.service('createMarketOrder', [
      $scope[type].side,
      $scope[type].type,
      $scope.accMul($scope[type].quantity, Math.pow(10, 8)),
      $scope.accMul($scope[type].limit, Math.pow(10, 8)),
      $scope.activeTicker.market,
      $scope[type].tpass,
      $scope[type].scode,
      $scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol)
    ], (data) => {
      $scope.createOrderLoadingType = undefined;
      if (data.success) {
        if (data.data == "ERR_BALANCE_NOT_ENOUGH") {
        	FlashService.Toast("C2CORDER.USER_BALANCE_TOO_SMALL", 'error');
        }
        else if (data.data == "MARKET_NO_ORDER") {
        	FlashService.Toast("SCDDBZ_TIP", 'error');
        } else {
          FlashService.Toast("MESSAGE.ORDER_CREATED_OPEN_INFO", 'success');
        }
        $scope[type].scode = '';
        // $scope[type].scode=='';
        // 刷新余额
        $scope.getBalance();
        // 刷新订单
        $scope.getOrders();
        // 刷新订单
        $scope.getOrderHistory();
        $scope[type].quantity = 0;
        $scope[watchGroup].quantity(type);
        if ($scope.settingsData.tpass.trading == 1) {
          $scope.needTpass = false;
          $scope.tpass = $scope[type].tpass;
          $scope.scode = $scope[type].scode;
          $scope.limitBuyData.tpass = $scope[type].tpass;
          $scope.limitSellData.tpass = $scope[type].tpass;
          $scope.marketBuyData.tpass = $scope[type].tpass;
          $scope.marketSellData.tpass = $scope[type].tpass;
        } else {
          $scope[type].tpass = undefined;
        }
      } else {

        if (data.message == "ERR_AUTH_FAILED") {
          FlashService.Toast("ERR_AUTH_FAILED", 'error');
        }
        else if (data.message == "CODE_UNDEFINED") {

          FlashService.Toast("CODE_UNDEFINED", 'error');
        }
        else if (data.message == "UNKNOWN_ERROR") {
          FlashService.Toast("DINGDAN_UNKNOW",'error');
        }
        else if (data.message == "ERR_BALANCE_NOT_ENOUGH") {
          FlashService.Toast("C2CORDER.USER_BALANCE_TOO_SMALL",'error');
        }
        else if (data.message == "MARKET_NO_ORDER") {
        	FlashService.Toast("SCDDBZ_TIP",'error');
        }
        else if (data.message == "TPASS_NOT_SET") {
        
        	FlashService.Toast("NO_TRADE_TPASS", 'error');
        }
        else
          FlashService.Toast("MESSAGE." + data.message, 'error');
      }
    });
  }
  // 创建订单
  $scope.createOrder = function (type, watchGroup) {
    $scope.createOrderLoadingType = type;
    $scope.service('createTransactionOrder', [
      $scope[type].side,
      $scope[type].type,
      $scope.accMul($scope[type].quantity, Math.pow(10, 8)),
      $scope.accMul($scope[type].limit, Math.pow(10, 8)),
      $scope.activeTicker.market,
      $scope[type].tpass,
      $scope[type].scode,
      $scope.getBalanceByAsset($scope.activeTicker.trading_pair.ask_asset_symbol)
    ], (data) => {
      $scope.createOrderLoadingType = undefined;
      if (data.success) {
        FlashService.Toast("MESSAGE.ORDER_CREATED_OPEN_INFO", 'success');
				$scope.typeSelectType = null;
        $scope[type].scode = '';
        // $scope[type].scode=='';
        // 刷新余额
        $scope.getBalance();
        // 刷新订单
        $scope.getOrders();
        // 刷新订单
        $scope.getOrderHistory();
        $scope[type].quantity = 0;
        $scope[watchGroup].quantity(type);
        if ($scope.settingsData.tpass.trading == 1) {
          $scope.needTpass = false;
          $scope.tpass = $scope[type].tpass;
          $scope.scode = $scope[type].scode;
          $scope.limitBuyData.tpass = $scope[type].tpass;
          $scope.limitSellData.tpass = $scope[type].tpass;
          $scope.marketBuyData.tpass = $scope[type].tpass;
          $scope.marketSellData.tpass = $scope[type].tpass;
        } else {
          $scope[type].tpass = undefined;
        }
      } else {

        if (data.message == "ERR_AUTH_FAILED") {
          FlashService.Toast("ERR_AUTH_FAILED", 'error');
        }
        else if (data.message == "CODE_UNDEFINED") {

          FlashService.Toast("CODE_UNDEFINED", 'error');
        }
        else if (data.message == "TPASS_NOT_SET") {
        
          FlashService.Toast("NO_TRADE_TPASS", 'error');
        }
				else if(data.message == "ORDER_QUANTITY_TOO_SMALL") {
						FlashService.Toast("TRADE_TOO_SMALL", 'error');
				}
        else
          FlashService.Toast("MESSAGE." + data.message, 'error');
      }
    });
  }

  // 历史记录切换标签
  $scope.tradeHistorySwitchTab = function (tabName) {
    $scope.switchTab('historyTab', tabName, $scope.tradeHistorySwitchTabCB);
  }

  // 历史记录切换标签回调
  $scope.tradeHistorySwitchTabCB = function () {
    if (!$scope.activeTicker) return;
    switch ($scope.historyTab) {
      case 'current':
        $scope.getOrders();
        break;
      case 'history':
        $scope.getOrderHistory();
        break;
      case 'cancel':
        $scope.getOrderCancel();
        break;
    }
  }

  $scope.showOrderDetailPopup = function () {
    $scope.orderDetailPopup = true;
  }
  $scope.hideOrderDetailPopup = function ($event) {
    if ($scope.stopPropagation) {
      $event.stopPropagation();
    }
    $scope.orderDetailPopup = false;
  }

  // 撤单
  $scope.cancelOrder = function (item) {
    $scope.service('deleteOrder', [$scope.activeTicker.market, item.id], (data) => {
      if (data.success) {
        FlashService.Toast('MESSAGE.ORDER_CANCEL_INFO', 'info');
        // 刷新余额
        $scope.getBalance();
        $scope.orderCurrentData.splice($scope.orderCurrentData.indexOf(item), 1);
      } else {
        FlashService.Toast('MESSAGE.ORDER_CANCEL_ERROR', 'error');
      }
    });
  }

  //获取安全验证方式
  $scope.initVerifys = function () {
    console.log($rootScope._username)
    if ($rootScope._username) {
      PrivateService.getSafetySettings(1)
        .then((response) => {
          $scope.verify = response.data;
        });
    }
  }
  $scope.initVerifys();
	
	$scope.ticklist = {
		selectType:'',
		selectIndex:null
	}
	
	$scope.ticksSelect = function(type,price,index) {
			$scope.ticklist.selectType = type;
			$scope.ticklist.selectIndex = index;
			if(type == 'ask') {
					$scope.limitBuyData.limit = Number(price)
			}else {
					$scope.limitSellData.limit = Number(price)
			}
	}


  // 查询是否设置了交易密码
  // https://szzc.com/api/private/settings {get}
  // 返回
  // {"status":{"success":1,"message":null},
  // "result":{"user_id":20578,"phone":"15221097340","email":"alwuyy@gmail.com",
  // "blocked":0,"deleted":0,"created_at":"2017-06-19T05:49:57.000Z",
  // "vip_level":0,"name":"苏文博","kyc_id_type":"ID","kyc_level":1,
  // "kyc_status":1,"tfa":false,"tpass":{"enabled":1,"trading":1}}}
  //
  // 获取订单
  // https://szzc.com/api/private/orders/BTMCNY {get}
  // 返回
  // {"status":{"success":1,"message":null},
  // "result":[{"id":11957,"quantity":128647300000,"rest":128647300000,"limit":230000000,"price":null,"side":"SELL","created":1502770922360}]}
  //
  // 创建订单
  // https://szzc.com/api/private/order {post}
  // 请求
  // {"side":"BUY","type":"LIMIT","quantity":"10000000","limit":"198000000","trading_pair":"BTMCNY","transaction_password":"******"}
  // 返回
  // {"status":{"success":1,"message":"SUC_CREATE_ORDER"},"result":{"order_id":13278,"frozen":29800000}}
  //
  // 请求
  // {"side":"BUY","type":"LIMIT","quantity":"10000000","limit":"217700000","trading_pair":"BTMCNY","transaction_password":"******"}
  // 返回
  // {"status":{"success":1,"message":"SUC_CREATE_ORDER"},"result":{"order_id":13281,"frozen":31770000}}
  // {"status":{"success":0,"message":"ERR_TPASS_WRONG"}} // error
  //
  // //卖出请求
  // {"side":"SELL","type":"LIMIT","quantity":"30000000","limit":"142200000","trading_pair":"BTMCNY","transaction_password":"******"}
  //
  // 请求
  // {"side":"BUY","type":"LIMIT","quantity":"10000000","limit":"217700000","trading_pair":"BTMCNY","transaction_password":"******"}
  // 返回
  // {"status":{"success":1,"message":"SUC_CREATE_ORDER"},"result":{"order_id":13283,"frozen":31770000}}
  //
  // https://szzc.com/api/private/account/balances {get}
  // 返回
  // {"status":{"success":1,"message":null},"result":[
  // {"asset":"ETP","balance":"1541000000","frozen":"0","state":"1"},
  // {"asset":"BTM","balance":"10000000","frozen":"128647300000","state":"1"},
  // {"asset":"CNY","balance":"85385423972","frozen":"110000000","state":"1"},
  // {"asset":"STORJ","balance":"11100000000","frozen":"0","state":"1"},
  // {"asset":"ICO","balance":"0","frozen":"0","state":"1"},
  // {"asset":"ZGC","balance":"0","frozen":"0","state":"1"}]}
  //
  // https://szzc.com/api/private/order/BTMCNY/13276 {delete}
  // 返回
  // {"status":{"success":1,"message":"SUC_CANCEL_ORDER"},"result":{"order_id":13283}}
  //
  // history
  // // https://szzc.com/api/private/orders/history?side=bid&page=0&items_per_page=15
  //
  // $scope.totalItems = 64;
  // $scope.currentPage = 4;

  // $scope.setPage = function (pageNo) {
  //   $scope.currentPage = pageNo;
  // };

  // $scope.pageChanged = function () {
  //   $log.log('Page changed to: ' + $scope.currentPage);
  // };

  // $scope.maxSize = 5;
  // $scope.bigTotalItems = 175;
  // $scope.bigCurrentPage = 1;


  // /*************** 测试数据开始 ******************/
  // // 模拟登录
  // $scope.globals = {
  //   logged_in: true,
  //   token: 'p7ANV8go+'
  // }

  // // 模拟余额
  // $scope.balanceData = {
  //   BTC: {"asset": "BTC", "balance": "1541000000", "frozen": "0", "state": "1"},
  //   ETP: {"asset": "ETP", "balance": "1541000000", "frozen": "0", "state": "1"},
  //   CNY: {"asset": "CNY", "balance": "85385423972000", "frozen": "110000000", "state": "1"},
  //   STORJ: {"asset": "STORJ", "balance": "11100000000", "frozen": "0", "state": "1"},
  //   ICO: {"asset": "ICO", "balance": "0", "frozen": "0", "state": "1"},
  //   ZGC: {"asset": "ZGC", "balance": "0", "frozen": "0", "state": "1"}
  // }

  // // 模拟设置
  // $scope.settingsData = {
  //   "user_id": 20578, "phone": "15221097340", "email": "alwuyy@gmail.com",
  //   "blocked": 0, "deleted": 0, "created_at": "2017-06-19T05:49:57.000Z",
  //   "vip_level": 0, "name": "苏文博", "kyc_id_type": "ID", "kyc_level": 0,
  //   "kyc_status": 1, "tfa": false, "tpass": {"enabled": 1, "trading": 1}
  // }
  /*************** 测试数据结束 ******************/
}
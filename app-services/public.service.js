/**
 * @author shenyuhang
 * @date 2017-03-07
 * @description  public service 公共接口调用
 **/
(function() {
  'use strict';
  angular
    .module('app')
    .factory('PublicService', PublicService);

  PublicService.$inject = ['$http', '$cookies', '$rootScope', 'CONFIG'];

  function PublicService($http, $cookies, $rootScope, CONFIG) {
    var testFlag = "test";
    let service = {};

    var SERVER = CONFIG.public;

    service.debug = true;
    service.GetMarket = GetMarket;
    service.GetMarketSymbol = GetMarketSymbol;
    service.GetDepth = GetDepth;
    service.GetTicker = GetTicker;
    service.GetTickers = GetTickers;
    service.GetTrades = GetTrades;
    service.GetCandlestick = GetCandlestick;
    service.GetCandlestickByPage = GetCandlestickByPage;
    service.CandleGraph = CandleGraph;
    service.GetBTCtoUSDT=GetBTCtoUSDT;
    service.GetUStoRMB=GetUStoRMB;
    service.GetBanner=GetBanner;
		service.getPlates=getPlates;

    return service;

    function CandleGraph(pair, period, callback) {
      return _get("candlestick/"+period+'/'+pair + '/1440');
    }
		
		//获取板块
		function getPlates(params) {
			return _get("getPlates", params);
		}

    //获得市场
    function GetMarket() {
      return _get("remark");
    }
    //获得具体某个市场
    function GetMarketSymbol(symbol) {
      return _get("getRemark/" + symbol);
    }

    //获得市场深度和某个市场深度
    function GetDepth(symbol, count) {
      return _get("depth/" + symbol + '/' + count);
    }

    //获得ticker和某个ticker
    function GetTicker(symbol) {
      return _get("ticker/" + symbol);
    }

    function GetTickers() {
      return _get("tickers");
    }

    //获得trades和某个trades
    function GetTrades(symbol) {
      return _get("trades/" + symbol + '/30');
    }
    
    function GetCandlestickByPage(timeSymbol, symbol, num=1) {
    	return _get("candlestick/" + timeSymbol + "/" + symbol + "/" + num);
    }

    //获得candlestick和某个candlestick
    function GetCandlestick(timeSymbol, symbol) {
      return _get("candlestick/" + timeSymbol + "/" + symbol);
    }
		
		
		function _post(method, params) {
				var token = $rootScope.globals.token;
				return $http.post(SERVER + method ,params, { headers : { "x-access-token" :token }}).then(
						function(res){
								return handleSuccess(res);
						},
						function(res){
								return handleError(res);
						});
		} // end _post

    //get提交数据
    function _get(method, params) {
      return $http.get(SERVER + method).then(
        function(res) {
          return handleSuccess(res);
        },
        function(res) {
          return handleError(res);
        }
      );
    } // end _get

    //请求成功处理函数
    function handleSuccess(res) {
      if (res.data && res.data.status && res.data.status.success)
        return {
          success: true,
          data: res.data.result
        };
      else
        return handleError(res);
    } // end handleSuccess

    //请求失败处理函数
    function handleError(res) {
      if (res.error != undefined)
        return {
          success: false,
          message: res.error
        };
      return {
        success: false,
        message: 'General connection error'
      };
    } // end handleError

    // 获取BTC兑换USDT金额
      function GetBTCtoUSDT() {
         return _get("getBTC_USDT");
      }
  //  获取美元兑换人民币实时汇率
      function GetUStoRMB() {
          return _get("getExchangeRate");
      }

      //获取banner图
      function GetBanner() {
          return _get("getBanner/" + 1);
      }


  }

})();

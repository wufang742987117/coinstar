'use strict';
/*
	This class implements interaction with UDF-compatible datafeed.

	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/

var Datafeeds = {};

Datafeeds.UDFCompatibleDatafeed = function (datafeedURL, updateFrequency, reset) {
  this.current_resolution = undefined;
  this.current_market = undefined;

  this._datafeedURL = datafeedURL;
  this._configuration = undefined;

  this._symbolSearch = null;
  this._symbolsStorage = null;
  this._barsPulseUpdater = new Datafeeds.DataPulseUpdater(this, updateFrequency || 10 * 1000);
  // this._quotesPulseUpdater = new Datafeeds.QuotesPulseUpdater(this);

  this._enableLogging = false;
  this._initializationFinished = false;
  this._callbacks = {};

  this._initialize();
};

// Datafeeds.UDFCompatibleDatafeed.prototype.defaultConfiguration = function () {
//   return {
//     supports_search: false,
//     supports_group_request: true,
//     // supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W'],
//     supports_marks: false,
//     supports_timescale_marks: false
//   };
// };

/**
 * 当图表需要知道服务器时间时，如果配置标志supports_time 设置为true ，则调用此函数。
 * 图表库预期只调用一次回调。所提供的时间没有毫秒。
 * 例子：1445324591。它是用来显示倒数的价格范围。
 * @param callback: function(unixTime)
 */
// Datafeeds.UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
//   if (this._configuration.supports_time) {
//     this._send(this._datafeedURL + '/time', {})
//       .done(function (response) {
//         callback(+response);
//       })
//       .fail(function () {
//       });
//   }
// };

Datafeeds.UDFCompatibleDatafeed.prototype.on = function (event, callback) {
  if (!this._callbacks.hasOwnProperty(event)) {
    this._callbacks[event] = [];
  }

  this._callbacks[event].push(callback);
  return this;
};

Datafeeds.UDFCompatibleDatafeed.prototype._fireEvent = function (event, argument) {
  if (this._callbacks.hasOwnProperty(event)) {
    var callbacksChain = this._callbacks[event];
    for (var i = 0; i < callbacksChain.length; ++i) {
      callbacksChain[i](argument);
    }

    this._callbacks[event] = [];
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype.onInitialized = function () {
  this._initializationFinished = true;
  this._fireEvent('initialized');
};

Datafeeds.UDFCompatibleDatafeed.prototype._logMessage = function (message) {
  if (this._enableLogging) {
    var now = new Date();
    console.log(now.toLocaleTimeString() + '.' + now.getMilliseconds() + '> ' + message);
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._send = function (url, params) {
  var request = url;
  if (params) {
    for (var i = 0; i < Object.keys(params).length; ++i) {
      var key = Object.keys(params)[i];
      var value = encodeURIComponent(params[key]);
      request += (i === 0 ? '?' : '&') + key + '=' + value;
    }
  }

  this._logMessage('New request: ' + request);

  return $.ajax({
    type: 'GET',
    url: request,
    contentType: 'text/plain'
  });
};

//   /**
//    * configurationData是一个对象，现在支持以下属性:
//    * exchanges：一个交易所数组。 Exchange是一个对象{value, name, desc} 。
//    *    value将被作为exchange参数传递给 searchSymbolsByName (见下文)。
//    *    exchanges= [] 会导致商品查询列表中看不到交易所过滤器。使用value= "" 来创建通配符筛选器（所有的交易所）。
//    * symbols_types：一个商品类型过滤器数组。该商品类型过滤器是个对象{name, value} 。value 将被作为symbolType 参数传递给searchSymbolsByName。
//    *    symbolsTypes = [] 会导致商品查询列表中看不到商品类型过滤器。 使用value = ""来创建通配符筛选器（所有的商品类型）。
//    * supported_resolutions： 一个表示服务器支持的分辨率数组，分辨率可以是数字或字符串。如果分辨率是一个数字， 它被视为分钟数。 字符串可以是“*D”，“*W”，“_M”（_的意思是任何数字）。格式化详细参照:文章。
//    *    'resolutions'=undefined或 [] 时，分辨率拥有默认内容 (见：http://tradingview.com/e/)。例:[1, 15, 240, "D", "6M"] 您将在分辨率中得到 "1 分钟, 15 分钟, 4 小时, 1 天, 6 个月" 。
//    * supports_marks： 布尔值来标识您的 datafeed 是否支持在K线上显示标记。
//    * supports_timescale_marks：布尔值来标识您的 datafeed 是否支持时间刻度标记。
//    * supports_time：将此设置为true 假如您的datafeed提供服务器时间（unix时间）。 它用于调整时间刻度上的价格比例。
//    */
Datafeeds.UDFCompatibleDatafeed.prototype._initialize = function () {
  /**
   var that = this;

   this._send(this._datafeedURL + '/config').done(function (response) {

    var configurationData = JSON.parse(response);
    console.log('config === ', configurationData)
    that._setupWithConfiguration(configurationData);
  }).fail(function (reason) {
    that._setupWithConfiguration(that.defaultConfiguration());
  });
   */

  var configurationData = {
    // "supports_search": true,
    // "supports_group_request": false,
    // "supports_marks": true,
    // "exchanges": [{
    //   "value": "",
    //   "name": "All Exchanges",
    //   "desc": ""
    // }, {
    //   "value": "XETRA",
    //   "name": "XETRA",
    //   "desc": "XETRA"
    // }, {
    //   "value": "NSE",
    //   "name": "NSE",
    //   "desc": "NSE"
    // }, {
    //   "value": "NasdaqNM",
    //   "name": "NasdaqNM",
    //   "desc": "NasdaqNM"
    // }, {
    //   "value": "NYSE",
    //   "name": "NYSE",
    //   "desc": "NYSE"
    // }, {
    //   "value": "CDNX",
    //   "name": "CDNX",
    //   "desc": "CDNX"
    // }, {
    //   "value": "Stuttgart",
    //   "name": "Stuttgart",
    //   "desc": "Stuttgart"
    // }],
    // "symbolsTypes": [{
    //   "name": "All types",
    //   "value": ""
    // }, {
    //   "name": "Stock",
    //   "value": "stock"
    // }, {
    //   "name": "Index",
    //   "value": "index"
    // }]
  }

  this._setupWithConfiguration({});
};

/**
 * 此方法旨在提供填充配置数据的对象。这些数据会影响图表的行为，所以它被称为服务端定制。
 * @param callback
 */
Datafeeds.UDFCompatibleDatafeed.prototype.onReady = function (callback) {
  var that = this;
  if (this._configuration) {
    setTimeout(function () {
      callback(that._configuration);
    }, 0);
  } else {
    this.on('configuration_ready', function () {
      callback(that._configuration);
    });
  }
};

Datafeeds.UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
  this._configuration = configurationData;

  // if (!configurationData.exchanges) {
  //   configurationData.exchanges = [];
  // }

  //	@obsolete; remove in 1.5
  // var supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions;
  // configurationData.supported_resolutions = supportedResolutions;

  //	@obsolete; remove in 1.5
  // var symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes;
  // configurationData.symbols_types = symbolsTypes;

  // if (!configurationData.supports_search && !configurationData.supports_group_request) {
  //   throw new Error('Unsupported datafeed configuration. Must either support search, or support group request');
  // }

  // if (!configurationData.supports_search) {
  //   this._symbolSearch = new Datafeeds.SymbolSearchComponent(this);
  // }

  // if (configurationData.supports_group_request) {
  //   //	this component will call onInitialized() by itself
  //   this._symbolsStorage = new Datafeeds.SymbolsStorage(this);
  //   console.log(111)
  // } else {
  //   this.onInitialized();
  //   console.log(222)
  // }
  this.onInitialized();
  // this._fireEvent('configuration_ready');
  // this._logMessage('Initialized with ' + JSON.stringify(configurationData));
};

//	===============================================================================================================================
//	The functions set below is the implementation of JavaScript API.

/**
 * 方法介绍：获取可见K线范围的标记。图表预期每调用一次getMarks 就会调用一次onDataCallback 。
 * mark: 只有当您声明您的后端是支持标记时才会调用这个函数。supporting marks.
 * @param symbolInfo: SymbolInfo 商品信息对象
 * @param rangeStart: unix时间戳, 最左边必须的K线时间
 * @param rangeEnd: unix 时间戳, 最右边必须的K线时间
 * @param onDataCallback: function(标记数字marks )
 * @param resolution: string
 */
// Datafeeds.UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
//   if (this._configuration.supports_marks) {
//     this._send(this._datafeedURL + '/marks', {
//       symbol: symbolInfo.ticker.toUpperCase(),
//       from: rangeStart,
//       to: rangeEnd,
//       resolution: resolution
//     })
//       .done(function (response) {
//         /**
//          * {
//               "id": [0, 1, 2, 3, 4, 5],
//               "time": [1435116211.643, 1434770611.643, 1434511411.643, 1434511411.643, 1433820211.643, 1432524211.643],
//               "color": ["red", "blue", "green", "red", "blue", "green"],
//               "text": ["Today", "4days back", "7 days back + Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaaliqua.", "7 days back once again", "15 daysback", "30 daysback"],
//               "label": ["A", "B", "CORE", "D", "EURO", "F"],
//               "labelFontColor": ["white", "white", "red", "#FFFFFF", "white", "#000"],
//               "minSize": [14, 28, 7, 40, 7, 14]
//           }
//          */
//         onDataCallback(JSON.parse(response));
//       })
//       .fail(function () {
//         onDataCallback([]);
//       });
//   }
// };

/**
 * 图表库调用此函数获取可见K线范围的时间刻度标记
 * getTimescaleMarks会调用一次onDataCallback。
 * @param symbolInfo: SymbolInfo object
 * @param rangeStart
 * @param rangeEnd
 * @param onDataCallback: function(array of mark's)
 * @param resolution
 */
// Datafeeds.UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, rangeStart, rangeEnd, onDataCallback, resolution) {
//   if (this._configuration.supports_timescale_marks) {
//     this._send(this._datafeedURL + '/timescale_marks', {
//       symbol: symbolInfo.ticker.toUpperCase(),
//       from: rangeStart,
//       to: rangeEnd,
//       resolution: resolution
//     })
//       .done(function (response) {
//         onDataCallback(JSON.parse(response));
//       })
//       .fail(function () {
//         onDataCallback([]);
//       });
//   }
// };

// Datafeeds.UDFCompatibleDatafeed.prototype.searchSymbols = function (searchString, exchange, type, onResultReadyCallback) {
//   var MAX_SEARCH_RESULTS = 30;
//
//   if (!this._configuration) {
//     onResultReadyCallback([]);
//     return;
//   }
//
//   if (this._configuration.supports_search) {
//     this._send(this._datafeedURL + '/search', {
//       limit: MAX_SEARCH_RESULTS,
//       query: searchString.toUpperCase(),
//       type: type,
//       exchange: exchange
//     })
//       .done(function (response) {
//         var data = JSON.parse(response);
//
//         for (var i = 0; i < data.length; ++i) {
//           if (!data[i].params) {
//             data[i].params = [];
//           }
//
//           data[i].exchange = data[i].exchange || '';
//         }
//
//         if (typeof data.s == 'undefined' || data.s !== 'error') {
//           onResultReadyCallback(data);
//         } else {
//           onResultReadyCallback([]);
//         }
//       })
//       .fail(function (reason) {
//         onResultReadyCallback([]);
//       });
//   } else {
//     if (!this._symbolSearch) {
//       throw new Error('Datafeed error: inconsistent configuration (symbol search)');
//     }
//
//     var searchArgument = {
//       searchString: searchString,
//       exchange: exchange,
//       type: type,
//       onResultReadyCallback: onResultReadyCallback
//     };
//
//     if (this._initializationFinished) {
//       this._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
//     } else {
//       var that = this;
//
//       this.on('initialized', function () {
//         that._symbolSearch.searchSymbols(searchArgument, MAX_SEARCH_RESULTS);
//       });
//     }
//   }
// };

Datafeeds.UDFCompatibleDatafeed.prototype._symbolResolveURL = '/symbols';

//	BEWARE: this function does not consider symbol's exchange
// 通过商品名称解析商品信息

Datafeeds.UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
  // var that = this;
  //
  // if (!this._initializationFinished) {
  //   this.on('initialized', function () {
  //     that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
  //   });
  //
  //   return;
  // }
  //
  // var resolveRequestStartTime = Date.now();
  // // that._logMessage('Resolve requested');
  // //
  // function onResultReady(data) {
  //   var postProcessedData = data;
  //   // if (that.postProcessSymbolInfo) {
  //   //   postProcessedData = that.postProcessSymbolInfo(postProcessedData);
  //   // }
  //
  //   that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime));
  //
  //   onSymbolResolvedCallback(postProcessedData);
  // }

  // if (!this._configuration.supports_group_request) {
  //   console.log(111)
  //   this._send(this._datafeedURL + this._symbolResolveURL, {
  //     symbol: symbolName ? symbolName.toUpperCase() : ''
  //   }).done(function (response) {
  //     var data = JSON.parse(response);
  //
  //
  //
  //
  //     if (data.s && data.s !== 'ok') {
  //       console.log(333)
  //       onResolveErrorCallback('unknown_symbol');
  //     } else {
  //       console.log(444)
  //       onResultReady(data);
  //     }
  //   }).fail(function (reason) {
  //     that._logMessage('Error resolving symbol: ' + JSON.stringify([reason]));
  //     onResolveErrorCallback('unknown_symbol');
  //   });
  // } else {
  //   console.log(222)
  //   if (this._initializationFinished) {
  //     this._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
  //   } else {
  //     this.on('initialized', function () {
  //       that._symbolsStorage.resolveSymbol(symbolName, onResultReady, onResolveErrorCallback);
  //     });
  //   }
  // }

  var data = {
    "name": symbolName, // 品种名称
    // "exchange-traded": "NasdaqNM", // 交易所名称
    // "exchange-listed": "NasdaqNM", // 交易所名称
    "timezone": "Asia/Shanghai", // 时区
    "minmov": 1, // 用于格式化用途
    "minmov2": 0, // 用于格式化用途
    "pointvalue": 1, //
    "session": "24x7", // 开盘时间
    "has_intraday": true, // 显示符号是否具有历史盘中数据；原文解释showing whether symbol has intraday history data
    "intraday_multipliers" : ['1', '5', '15', '30', '60'], // 服务器支持的分辨率（不支持的分辨率由受支持的最小的分辨率计算得来）
    "has_daily": true,
    "has_weekly_and_monthly": true,
    "has_no_volume": false, // 是否有成交量
    // "description": "AppleInc.", // 描述
    // "type": "stock", // 类型，例如stock表示股票
    "supported_resolutions": ["1", "5", "15", "30", "60", "D", "W", "M"], // 本地支持（可选的）的分辨率
    "pricescale": 100000, // 是最小的显示可能出现的价格变化的小数部分的分隔符。其计算公式为：MinimalPossiblePriceChange = minmov / pricescale
    "ticker": symbolName, // 品种名称
  }
  // console.log(data)
  onSymbolResolvedCallback(data);
};

Datafeeds.UDFCompatibleDatafeed.prototype._historyURL = '/history';

/**
 * 通过日期范围获取历史K线数据。图表库希望通过onDataCallback 仅一次调用，接收所有的请求历史。而不被多次调用。
 * @param symbolInfo: SymbolInfo 商品信息对象
 * @param resolution: string （分辨率）
 * @param rangeStartDate: unix 时间戳, 最左边必须的K线时间
 * @param rangeEndDate: unix时间戳, 最右边必须的K线时间
 * @param onDataCallback: 数据
 * @param onErrorCallback: function(reason：错误原因)
 * 发生不断自动刷新图表问题时，请检查from与onHistoryCallback方法返回的bars时间是否一致，没有数据时请返回noData = true
 * nextTime 历史中下一个K线柱的时间。 只有在请求的时间段内没有数据时，才应该被设置。
 * noData 只有在请求的时间段内没有数据时，才应该被设置。
 */
var intervalObj = {
  '1': 'min1',
  '5': 'min5',
  '15': 'min15',
  '30': 'min30',
  '60': 'hr1',
  'D': 'day1',
  'W': 'week'
}

Datafeeds.UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
  // console.log({
  //   symbolInfo: symbolInfo.ticker,
  //   resolution: intervalObj[resolution]
  // })
  //	timestamp sample: 1399939200
  if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
    throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate]);
  }

  // console.log(this.current_resolution, resolution, symbolInfo)
  // if(){
  //
  // }

  if(this.current_resolution == resolution && this.current_market == symbolInfo.ticker){
    onDataCallback([], { noData: true });
  }else{
    this.current_resolution = resolution
    this.current_market = symbolInfo.ticker
    // this._send(this._datafeedURL + this._historyURL, {
    //   symbol: symbolInfo.ticker.toUpperCase(),
    //   resolution: resolution,
    //   from: rangeStartDate,
    //   to: rangeEndDate
    // }).done(function (response) {

    this._send(`${this._datafeedURL}candlestick/${intervalObj[resolution]}/${symbolInfo.ticker}/1440`).done(function (response) {
      var sss = {
        t: [],
        v: [],
        o: [],
        h: [],
        l: [],
        c: [],
        s: 'ok',
      };
      if (response.status.success === 1) {
        response.result.forEach(function (item, ind) {
          sss.t.push(item[0] / 1000)
          sss.v.push(item[1] / 100000000);
          sss.o.push(item[2] / 100000000);
          sss.h.push(item[3] / 100000000);
          sss.l.push(item[4] / 100000000);
          sss.c.push(item[5] / 100000000);
        })
        sss.s = 'ok'
      } else {
        sss.s = 'no_data'
      }
      var data = sss;
      var nodata = data.s === 'no_data';
      if (data.s !== 'ok' && !nodata) {
        if (!!onErrorCallback) {
          onErrorCallback(data.s);
        }
      }
      var bars = [];

      var barsCount = nodata ? 0 : data.t.length;
      var volumePresent = typeof data.v != 'undefined';
      var ohlPresent = typeof data.o != 'undefined';

      for (var i = 0; i < barsCount; ++i) {
        var barValue = {
          time: data.t[i] * 1000,
          close: data.c[i]
        };
        if (ohlPresent) {
          barValue.open = data.o[i];
          barValue.high = data.h[i];
          barValue.low = data.l[i];
        } else {
          barValue.open = barValue.high = barValue.low = barValue.close;
        }
        if (volumePresent) {
          barValue.volume = data.v[i];
        }

        bars.push(barValue);
      }
      onDataCallback(bars, { noData: nodata, nextTime: data.nb || data.nextTime });

    }).fail(function (arg) {
      console.warn(['getBars(): HTTP error', arg]);

      if (!!onErrorCallback) {
        onErrorCallback('network error: ' + JSON.stringify(arg));
      }
    });
  }

};

/**
 * 方法介绍：订阅K线数据。图表库将调用onRealtimeCallback 方法以更新实时数据。
 * @param symbolInfo： object SymbolInfo
 * @param resolution：string 分辨率
 * @param onRealtimeCallback：function(bar)； bar :object{time, close,open, high, low, volume}
 * @param listenerGUID：object
 * @param onResetCacheNeededCallback：(从1.7 开始): function()将在bars数据发生变化时执行
 */
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
  this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback);
};

/**
 * 方法介绍：取消订阅K线数据。在调用subscribeBars 方法时,图表库将跳过与 listenerGUID 相同的对象。
 * @param listenerGUID
 */
Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGUID) {
  this._barsPulseUpdater.unsubscribeDataListener(listenerGUID);
};

/**
 * 算出历史数据周期刻度，使您能够重写所需的历史深度。通过一些参数，让您知道要获得的是什么样数据。
 * @param period 请求商品的分辨率
 * @param resolutionBack 期望历史周期刻度。支持的值:
 * @param intervalBack 数 量
 * eg1: calculateHistoryDepth("D", "M", 12) 调用: 图表库请求12 个月的日线数据
 * eg2: calculateHistoryDepth(60, "D", 15) 调用: 图表库请求15天的60分钟数据
 */
Datafeeds.UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (period, resolutionBack, intervalBack) {
};

//------------------------------------------------交易终端专属

/**
 * 当图表需要报价数据时，将调用此函数。图表库预期在收到所有请求数据时调用onDataCallback。
 * @param symbols
 * @param onDataCallback
 * @param onErrorCallback
 */
// Datafeeds.UDFCompatibleDatafeed.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
//   this._send(this._datafeedURL + '/quotes', {symbols: symbols})
//     .done(function (response) {
//       var data = JSON.parse(response);
//       if (data.s === 'ok') {
//         //	JSON format is {s: "status", [{s: "symbol_status", n: "symbol_name", v: {"field1": "value1", "field2": "value2", ..., "fieldN": "valueN"}}]}
//         if (onDataCallback) {
//           onDataCallback(data.d);
//         }
//       } else {
//         if (onErrorCallback) {
//           onErrorCallback(data.errmsg);
//         }
//       }
//     })
//     .fail(function (arg) {
//       if (onErrorCallback) {
//         onErrorCallback('network error: ' + arg);
//       }
//     });
// };

/**
 * 交易终端当需要接收商品的实时报价时调用此功能。图表预期您每次要更新报价时都会调用onRealtimeCallback
 * @param symbols
 * @param fastSymbols
 * @param onRealtimeCallback
 * @param listenerGUID
 */
Datafeeds.UDFCompatibleDatafeed.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGUID) {
  this._quotesPulseUpdater.subscribeDataListener(symbols, fastSymbols, onRealtimeCallback, listenerGUID);
};

/**
 * 交易终端当不需要再接收商品的实时报价时调用此函数。当图表库遇到listenerGUID 相同的对象会跳过subscribeQuotes 方法。
 * @param listenerGUID
 */
Datafeeds.UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function (listenerGUID) {
  this._quotesPulseUpdater.unsubscribeDataListener(listenerGUID);
};

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol storage component for ExternalDatafeed. This component can
	  * interact to UDF-compatible datafeed which supports whole group info requesting
	  * do symbol resolving -- return symbol info by its name
*/
// Datafeeds.SymbolsStorage = function (datafeed) {
//   this._datafeed = datafeed;
//
//   this._exchangesList = ['NYSE', 'FOREX', 'AMEX'];
//   this._exchangesWaitingForData = {};
//   this._exchangesDataCache = {};
//
//   this._symbolsInfo = {};
//   this._symbolsList = [];
//
//   // this._requestFullSymbolsList();
// };

// Datafeeds.SymbolsStorage.prototype._requestFullSymbolsList = function () {
//   var that = this;
//
//   for (var i = 0; i < this._exchangesList.length; ++i) {
//     var exchange = this._exchangesList[i];
//
//     if (this._exchangesDataCache.hasOwnProperty(exchange)) {
//       continue;
//     }
//
//     this._exchangesDataCache[exchange] = true;
//
//     this._exchangesWaitingForData[exchange] = 'waiting_for_data';
//
//     this._datafeed._send(this._datafeed._datafeedURL + '/symbol_info', {
//       group: exchange
//     }).done((function (exchange) {
//       console.log(exchange)
//       return function (response) {
//         that._onExchangeDataReceived(exchange, JSON.parse(response));
//         that._onAnyExchangeResponseReceived(exchange);
//       };
//     })(exchange)).fail((function (exchange) {
//       return function (reason) {
//         that._onAnyExchangeResponseReceived(exchange);
//       };
//     })(exchange));
//   }
// };

// Datafeeds.SymbolsStorage.prototype._onExchangeDataReceived = function (exchangeName, data) {
//   function tableField(data, name, index) {
//     return data[name] instanceof Array ?
//       data[name][index] :
//       data[name];
//   }
//
//   try {
//     for (var symbolIndex = 0; symbolIndex < data.symbol.length; ++symbolIndex) {
//       var symbolName = data.symbol[symbolIndex];
//       var listedExchange = tableField(data, 'exchange-listed', symbolIndex);
//       var tradedExchange = tableField(data, 'exchange-traded', symbolIndex);
//       var fullName = tradedExchange + ':' + symbolName;
//
//       //	This feature support is not implemented yet
//       //	var hasDWM = tableField(data, "has-dwm", symbolIndex);
//
//       var hasIntraday = tableField(data, 'has-intraday', symbolIndex);
//
//       var tickerPresent = typeof data.ticker != 'undefined';
//
//       var symbolInfo = {
//         name: symbolName,
//         base_name: [listedExchange + ':' + symbolName],
//         description: tableField(data, 'description', symbolIndex),
//         full_name: fullName,
//         legs: [fullName],
//         has_intraday: hasIntraday,
//         has_no_volume: tableField(data, 'has-no-volume', symbolIndex),
//         listed_exchange: listedExchange,
//         exchange: tradedExchange,
//         minmov: tableField(data, 'minmovement', symbolIndex) || tableField(data, 'minmov', symbolIndex),
//         minmove2: tableField(data, 'minmove2', symbolIndex) || tableField(data, 'minmov2', symbolIndex),
//         fractional: tableField(data, 'fractional', symbolIndex),
//         pointvalue: tableField(data, 'pointvalue', symbolIndex),
//         pricescale: tableField(data, 'pricescale', symbolIndex),
//         type: tableField(data, 'type', symbolIndex),
//         session: tableField(data, 'session-regular', symbolIndex),
//         ticker: tickerPresent ? tableField(data, 'ticker', symbolIndex) : symbolName,
//         timezone: tableField(data, 'timezone', symbolIndex),
//         supported_resolutions: tableField(data, 'supported-resolutions', symbolIndex) || this._datafeed.defaultConfiguration().supported_resolutions,
//         force_session_rebuild: tableField(data, 'force-session-rebuild', symbolIndex) || false,
//         has_daily: tableField(data, 'has-daily', symbolIndex) || true,
//         intraday_multipliers: tableField(data, 'intraday-multipliers', symbolIndex) || ['1', '5', '15', '30', '60'],
//         has_fractional_volume: tableField(data, 'has-fractional-volume', symbolIndex) || false,
//         has_weekly_and_monthly: tableField(data, 'has-weekly-and-monthly', symbolIndex) || false,
//         has_empty_bars: tableField(data, 'has-empty-bars', symbolIndex) || false,
//         volume_precision: tableField(data, 'volume-precision', symbolIndex) || 0
//       };
//
//       this._symbolsInfo[symbolInfo.ticker] = this._symbolsInfo[symbolName] = this._symbolsInfo[fullName] = symbolInfo;
//       this._symbolsList.push(symbolName);
//     }
//   } catch (error) {
//     throw new Error('API error when processing exchange `' + exchangeName + '` symbol #' + symbolIndex + ': ' + error);
//   }
// };

// Datafeeds.SymbolsStorage.prototype._onAnyExchangeResponseReceived = function (exchangeName) {
//   delete this._exchangesWaitingForData[exchangeName];
//
//   var allDataReady = Object.keys(this._exchangesWaitingForData).length === 0;
//
//   if (allDataReady) {
//     this._symbolsList.sort();
//     this._datafeed._logMessage('All exchanges data ready');
//     this._datafeed.onInitialized();
//   }
// };

//	BEWARE: this function does not consider symbol's exchange
/**
 *  通过商品名称解析商品信息(SymbolInfo)
 * @param symbolName： string类型，商品名称 或ticker if provided.
 * @param onSymbolResolvedCallback： function(SymbolInfo)
 * @param onResolveErrorCallback： function(reason)
 */
// Datafeeds.SymbolsStorage.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
//   var that = this;
//
//   setTimeout(function () {
//     if (!that._symbolsInfo.hasOwnProperty(symbolName)) {
//       onResolveErrorCallback('invalid symbol');
//     } else {
//       onSymbolResolvedCallback(that._symbolsInfo[symbolName]);
//     }
//   }, 0);
// };

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	It's a symbol search component for ExternalDatafeed. This component can do symbol search only.
	This component strongly depends on SymbolsDataStorage and cannot work without it. Maybe, it would be
	better to merge it to SymbolsDataStorage.
*/

// Datafeeds.SymbolSearchComponent = function (datafeed) {
//   this._datafeed = datafeed;
// };

//	searchArgument = { searchString, onResultReadyCallback}
// Datafeeds.SymbolSearchComponent.prototype.searchSymbols = function (searchArgument, maxSearchResults) {
//   if (!this._datafeed._symbolsStorage) {
//     throw new Error('Cannot use local symbol search when no groups information is available');
//   }
//
//   var symbolsStorage = this._datafeed._symbolsStorage;
//
//   var results = []; // array of WeightedItem { item, weight }
//   var queryIsEmpty = !searchArgument.searchString || searchArgument.searchString.length === 0;
//   var searchStringUpperCase = searchArgument.searchString.toUpperCase();
//
//   for (var i = 0; i < symbolsStorage._symbolsList.length; ++i) {
//     var symbolName = symbolsStorage._symbolsList[i];
//     var item = symbolsStorage._symbolsInfo[symbolName];
//
//     if (searchArgument.type && searchArgument.type.length > 0 && item.type !== searchArgument.type) {
//       continue;
//     }
//
//     if (searchArgument.exchange && searchArgument.exchange.length > 0 && item.exchange !== searchArgument.exchange) {
//       continue;
//     }
//
//     var positionInName = item.name.toUpperCase().indexOf(searchStringUpperCase);
//     var positionInDescription = item.description.toUpperCase().indexOf(searchStringUpperCase);
//
//     if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
//       var found = false;
//       for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
//         if (results[resultIndex].item === item) {
//           found = true;
//           break;
//         }
//       }
//
//       if (!found) {
//         var weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription;
//         results.push({item: item, weight: weight});
//       }
//     }
//   }
//
//   searchArgument.onResultReadyCallback(
//     results
//       .sort(function (weightedItem1, weightedItem2) {
//         return weightedItem1.weight - weightedItem2.weight;
//       })
//       .map(function (weightedItem) {
//         var item = weightedItem.item;
//         return {
//           symbol: item.name,
//           full_name: item.full_name,
//           description: item.description,
//           exchange: item.exchange,
//           params: [],
//           type: item.type,
//           ticker: item.name
//         };
//       })
//       .slice(0, Math.min(results.length, maxSearchResults))
//   );
// };

//	==================================================================================================================================================
//	==================================================================================================================================================
//	==================================================================================================================================================

/*
	This is a pulse updating components for ExternalDatafeed. They emulates realtime updates with periodic requests.
*/

Datafeeds.DataPulseUpdater = function (datafeed, updateFrequency) {
  this._datafeed = datafeed;
  this._subscribers = {};

  this._requestsPending = 0;
  var that = this;

  var update = function () {
    if (that._requestsPending > 0) {
      return;
    }

    for (var listenerGUID in that._subscribers) {
      var subscriptionRecord = that._subscribers[listenerGUID];
      var resolution = subscriptionRecord.resolution;

      var datesRangeRight = parseInt((new Date().valueOf()) / 1000);

      //	BEWARE: please note we really need 2 bars, not the only last one
      //	see the explanation below. `10` is the `large enough` value to work around holidays
      // *******************************，第10个柱子的时间戳
      var datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 10);
      that._requestsPending++;

      (function (_subscriptionRecord) { // eslint-disable-line

        // symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback

        that._datafeed.getBars(
          _subscriptionRecord.symbolInfo,

          resolution,

          datesRangeLeft,

          datesRangeRight,

          function (bars) {
            that._requestsPending--;

            //	means the subscription was cancelled while waiting for data
            if (!that._subscribers.hasOwnProperty(listenerGUID)) {
              return;
            }

            if (bars.length === 0) {
              return;
            }

            // console.log('subscriptionRecord==', _subscriptionRecord)

            var lastBar = bars[bars.length - 1];
            if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
              return;
            }

            var subscribers = _subscriptionRecord.listeners;

            //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
            //	_subscriptionRecord.lastBarTime = NaN
            var isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime;

            //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
            //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
            if (isNewBar) {
              if (bars.length < 2) {
                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
              }

              var previousBar = bars[bars.length - 2];
              for (var i = 0; i < subscribers.length; ++i) {
                subscribers[i](previousBar);
              }
            }

            _subscriptionRecord.lastBarTime = lastBar.time;

            for (var i = 0; i < subscribers.length; ++i) {
              subscribers[i](lastBar);
            }
          },

          //	on error
          function () {
            that._requestsPending--;
          }
        );

      })(subscriptionRecord);
    }
  };

  if (typeof updateFrequency != 'undefined' && updateFrequency > 0) {
    setInterval(update, updateFrequency);
  }
};

Datafeeds.DataPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
  this._datafeed._logMessage('Unsubscribing ' + listenerGUID);
  delete this._subscribers[listenerGUID];
};

Datafeeds.DataPulseUpdater.prototype.subscribeDataListener = function (symbolInfo, resolution, newDataCallback, listenerGUID) {
  this._datafeed._logMessage('Subscribing ' + listenerGUID);

  if (!this._subscribers.hasOwnProperty(listenerGUID)) {
    this._subscribers[listenerGUID] = {
      symbolInfo: symbolInfo,
      resolution: resolution,
      lastBarTime: NaN,
      listeners: []
    };
  }

  this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.DataPulseUpdater.prototype.periodLengthSeconds = function (resolution, requiredPeriodsCount) {
  var daysCount = 0;
  if (resolution === 'D') {
    daysCount = requiredPeriodsCount;
  } else if (resolution === 'M') {
    daysCount = 31 * requiredPeriodsCount;
  } else if (resolution === 'W') {
    daysCount = 7 * requiredPeriodsCount;
  } else {
    daysCount = requiredPeriodsCount * resolution / (24 * 60);
  }

  return daysCount * 24 * 60 * 60;
};

Datafeeds.QuotesPulseUpdater = function (datafeed) {
  this._datafeed = datafeed;
  this._subscribers = {};
  this._updateInterval = 60 * 1000;
  this._fastUpdateInterval = 10 * 1000;
  this._requestsPending = 0;

  var that = this;

  setInterval(function () {
    that._updateQuotes(function (subscriptionRecord) {
      return subscriptionRecord.symbols;
    });
  }, this._updateInterval);

  setInterval(function () {
    that._updateQuotes(function (subscriptionRecord) {
      return subscriptionRecord.fastSymbols.length > 0 ? subscriptionRecord.fastSymbols : subscriptionRecord.symbols;
    });
  }, this._fastUpdateInterval);
};

Datafeeds.QuotesPulseUpdater.prototype.subscribeDataListener = function (symbols, fastSymbols, newDataCallback, listenerGUID) {
  if (!this._subscribers.hasOwnProperty(listenerGUID)) {
    this._subscribers[listenerGUID] = {
      symbols: symbols,
      fastSymbols: fastSymbols,
      listeners: []
    };
  }

  this._subscribers[listenerGUID].listeners.push(newDataCallback);
};

Datafeeds.QuotesPulseUpdater.prototype.unsubscribeDataListener = function (listenerGUID) {
  delete this._subscribers[listenerGUID];
};

Datafeeds.QuotesPulseUpdater.prototype._updateQuotes = function (symbolsGetter) {
  if (this._requestsPending > 0) {
    return;
  }

  var that = this;
  for (var listenerGUID in this._subscribers) {
    this._requestsPending++;

    var subscriptionRecord = this._subscribers[listenerGUID];
    this._datafeed.getQuotes(symbolsGetter(subscriptionRecord),

      // onDataCallback
      (function (subscribers, guid) { // eslint-disable-line
        return function (data) {
          that._requestsPending--;

          // means the subscription was cancelled while waiting for data
          if (!that._subscribers.hasOwnProperty(guid)) {
            return;
          }

          for (var i = 0; i < subscribers.length; ++i) {
            subscribers[i](data);
          }
        };
      }(subscriptionRecord.listeners, listenerGUID)),
      // onErrorCallback
      function (error) {
        that._requestsPending--;
      });
  }
};

if (typeof module !== 'undefined' && module && module.exports) {
  module.exports = {
    UDFCompatibleDatafeed: Datafeeds.UDFCompatibleDatafeed,
  };
}

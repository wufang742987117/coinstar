define({ "api": [
  {
    "type": "get",
    "url": "/candlestick/:timeSymbol/:trading_pair",
    "title": "Candlesticks",
    "name": "Get_candlesticks__kline_",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/candlestick/day1/BTCCNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[[1497312000000,257689500000,1892576000000,1958910000000,1874050000000,1923589000000],[1497398400000,277186800000,1923589000000,1953699000000,1748488000000,1826233000000],[1497484800000,230748400000,1826233000000,1829151000000,1679953000000,1797087000000]]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "result",
            "description": "<p>candlestick, item is [time, volume, open, high, low, close], each price/quantity should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the candlestick data for given trading pair and time intervals.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/candlestick/latest/:trading_pair",
    "title": "Candlestick Latest",
    "name": "Get_latest_candlesticks__kline_",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/candlestick/latest/BTCCNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":{\"hr4\":[1497600000000,16223600000,1840473000000,1841676000000,1794081000000,1804602000000],\"min5\":[1497603300000,167600000,1804782000000,1805684000000,1804000000000,1804602000000],\"hr1\":[1497600000000,16223600000,1840473000000,1841676000000,1794081000000,1804602000000],\"hr2\":[1497600000000,16223600000,1840473000000,1841676000000,1794081000000,1804602000000],\"min3\":[1497603420000,75200000,1804281000000,1805002000000,1804281000000,1804602000000],\"hr6\":[1497592800000,48484500000,1795239000000,1842678000000,1788690000000,1804602000000],\"hr12\":[1497571200000,88001900000,1797087000000,1842678000000,1774141000000,1804602000000],\"day3\":[1497398400000,595937100000,1923589000000,1953699000000,1679953000000,1804602000000],\"week\":[1497484800000,318750300000,1826233000000,1842678000000,1679953000000,1804602000000],\"day1\":[1497571200000,88001900000,1797087000000,1842678000000,1774141000000,1804602000000],\"min15\":[1497602700000,1366700000,1807609000000,1817628000000,1804000000000,1804602000000],\"min1\":[1497603480000,74700000,1805002000000,1805002000000,1804281000000,1804602000000],\"min30\":[1497601800000,5635800000,1807307000000,1817628000000,1794081000000,1804602000000]}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>each key is a timeSymbol, and value is [time, volume, open, high, low, close], each price/quantity should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the candlestick data for given trading pair and time intervals.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/depth/:trading_pair",
    "title": "Orderbook",
    "name": "Get_orderbook",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/depth/BTCCNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":{\"market\":\"BTCCNY\",\"ask\":[[2000000000000,100000000,100000000],[2000100000000,100000000,200000000],[2000200000000,100000000,300000000]],\"bid\":[[1999900000000,100000000,100000000],[1999800000000,100000000,200000000],[1999700000000,100000000,300000000]]}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "market",
            "description": "<p>trading pair.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "ask",
            "description": "<p>ask depth, fisrt item is best ask, item order is [price, quantity, total quantity], each price/quantity should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "bid",
            "description": "<p>bid depth, fisrt item is best bid, item order is [price, quantity, total quantity], each price/quantity should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the current orderbook for given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/ticker/:trading_pair",
    "title": "Ticker",
    "name": "Get_ticker",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/ticker/BTCCNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":{\"market\":\"BTCCNY\",\"date\":1497602424876,\"sell\":1801596000000,\"buy\":1799141000000,\"high\":1842678000000,\"low\":1774141000000,\"last\":1801349000000,\"last24h\":1759121000000,\"vol\":86300900000}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "market",
            "description": "<p>trading pair.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "date",
            "description": "<p>time in milliseconds.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "sell",
            "description": "<p>best sell price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "buy",
            "description": "<p>best buy price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "high",
            "description": "<p>highest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "low",
            "description": "<p>lowest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "last",
            "description": "<p>latest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "last24h",
            "description": "<p>price at 24 hours ago, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "vol",
            "description": "<p>volume calculated by day, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the ticker for given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/tickers",
    "title": "Tickers",
    "name": "Get_tickers",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/tickers",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"market\":\"OBSCNY\",\"date\":1497601212761,\"sell\":2043000000,\"buy\":1963010000,\"high\":2097200000,\"low\":1900000000,\"last\":2043000000,\"last24h\":2080000000,\"vol\":427342840000},{\"market\":\"ZECCNY\",\"date\":1497601217414,\"sell\":270900000000,\"buy\":270000000000,\"high\":287158000000,\"low\":254156000000,\"last\":270094000000,\"last24h\":256418000000,\"vol\":934208800000},{\"market\":\"ETCCNY\",\"date\":1497601216148,\"sell\":12814000000,\"buy\":12775000000,\"high\":12968000000,\"low\":12191000000,\"last\":12803000000,\"last24h\":12785000000,\"vol\":2166115000000},{\"market\":\"ETHCNY\",\"date\":1497601215973,\"sell\":264131000000,\"buy\":263898000000,\"high\":267622000000,\"low\":236690000000,\"last\":264070000000,\"last24h\":245682000000,\"vol\":11648096800000},{\"market\":\"BTSCNY\",\"date\":1497601214341,\"sell\":231240000,\"buy\":230960000,\"high\":240150000,\"low\":217930000,\"last\":231060000,\"last24h\":222780000,\"vol\":563423920490000},{\"market\":\"ETPCNY\",\"date\":1497601208510,\"sell\":3350000000,\"buy\":3349000000,\"high\":3350000000,\"low\":3156000000,\"last\":3350000000,\"last24h\":3165000000,\"vol\":3067245000000},{\"market\":\"BTCCNY\",\"date\":1497601209883,\"sell\":1826644000000,\"buy\":1826575000000,\"high\":1842678000000,\"low\":1774141000000,\"last\":1826646000000,\"last24h\":1775544000000,\"vol\":76237000000}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "market",
            "description": "<p>trading pair.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "date",
            "description": "<p>time in milliseconds.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "sell",
            "description": "<p>best sell price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "buy",
            "description": "<p>best buy price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "high",
            "description": "<p>highest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "low",
            "description": "<p>lowest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "last",
            "description": "<p>latest price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "last24h",
            "description": "<p>price at 24 hours ago, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "vol",
            "description": "<p>volume calculated by day, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the tickers for all trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/trades/:trading_pair",
    "title": "Trades",
    "name": "Get_trades",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/trades/BTCCNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"date\":1497601992136,\"price\":1795684000000,\"amount\":4100000,\"tid\":8004750,\"side\":\"BUY\"},{\"date\":1497601992136,\"price\":1795052000000,\"amount\":18800000,\"tid\":8004752,\"side\":\"BUY\"},{\"date\":1497601999035,\"price\":1794982000000,\"amount\":22900000,\"tid\":8004784,\"side\":\"SELL\"}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "date",
            "description": "<p>time in milliseconds.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>trade price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>trade quantity, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "tid",
            "description": "<p>trade ID.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "side",
            "description": "<p>BUY or SELL.</p>"
          }
        ]
      }
    },
    "description": "<p>Get the latest trades for given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },
  {
    "type": "get",
    "url": "/trading_pairs",
    "title": "List trading pairs",
    "name": "Trading_pairs",
    "group": "Data",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl https://szzc.com/api/public/trading_pairs",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"BTCCNY\":{\"name\":\"BTCCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"BTC\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"},\"ETCCNY\":{\"name\":\"ETCCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETC\",\"bid_asset_decimals\":2,\"bid_asset_type\":\"COIN\"},\"ETHCNY\":{\"name\":\"ETHCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETH\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"},\"ETPCNY\":{\"name\":\"ETPCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETP\",\"bid_asset_decimals\":2,\"bid_asset_type\":\"COIN\"},\"ZECCNY\":{\"name\":\"ZECCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ZEC\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>trading pair.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ask_asset_symbol",
            "description": "<p>FIAT.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ask_asset_decimals",
            "description": "<p>max decimal digits.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid_asset_symbol",
            "description": "<p>COIN.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid_asset_decimals",
            "description": "<p>max decimal digits.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns all trading pairs.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Data"
  },

  {
    "type": "get",
    "url": "/deposits/:asset/:page",
    "title": "List deposit",
    "name": "Deposit",
    "group": "Account",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/deposits/CNY/0",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"amount\":10000000000000,\"state\":\"PENDING\",\"created_at\":\"2017-05-08T11:12:46.000Z\"},{\"amount\":10000000000000,\"state\":\"COMPLETE\",\"created_at\":\"2016-10-18T04:31:13.000Z\"}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>deposit amount, should divide by 1E8..</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>deposit state (PENDING | COMPLETE | CANCELLED | REJECTED).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at",
            "description": "<p>deposit time.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns deposits.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/withdrawals/:asset/:page",
    "title": "List withdrawal",
    "name": "Withdrawal",
    "group": "Account",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/withdrawals/BTC/0",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"amount\":30000000,\"status\":\"PENDING\",\"created_at\":\"2017-02-15T23:30:03.000Z\"},{\"amount\":30000000,\"status\":\"PENDING\",\"created_at\":\"2017-01-12T20:15:32.000Z\"},{\"amount\":100000000,\"status\":\"PENDING\",\"created_at\":\"2017-01-12T01:47:38.000Z\"},{\"amount\":300000000,\"status\":\"PENDING\",\"created_at\":\"2016-12-13T23:34:38.000Z\"},{\"amount\":100000000,\"status\":\"COMPLETE\",\"created_at\":\"2016-12-13T23:26:54.000Z\"}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "amount",
            "description": "<p>withdrawal amount, should divide by 1E8..</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>withdrawal state (PENDING | COMPLETE | CANCELLED | REJECTED).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at",
            "description": "<p>withdrawal time.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns withdrawals.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/balance/:symbol",
    "title": "Get balance",
    "name": "getBalance",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/balance/CNY",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":\"BALANCE\"},\"result\":{\"symbol\":\"CNY\",\"balance\":\"3530103600\",\"frozen\":\"240790000\"}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "symbol",
            "description": "<p>asset symbol.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>available amount, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "frozen",
            "description": "<p>frozen amount, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "group": "Account",
    "description": "<p>Returns the users account balance for a specified asset(see /balances for available assets).</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/balances",
    "title": "List balances",
    "name": "getBalances",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/balances",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":\"GET_BALANCES\"},\"result\":[{\"asset\":\"ETP\",\"balance\":\"5000000000000\",\"frozen\":\"0\",\"state\":\"1\"},{\"asset\":\"CNY\",\"balance\":\"10000000000000\",\"frozen\":\"240790000\",\"state\":\"1\"}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "asset",
            "description": "<p>asset symbol.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "balance",
            "description": "<p>available amount, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "frozen",
            "description": "<p>frozen amount, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "group": "Account",
    "description": "<p>Returns the users account balances.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Account"
  },
  {
    "type": "get",
    "url": "/orders/:trading_pair/:id/:id:/id/...",
    "title": "List active orders",
    "name": "Active_orders",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/orders/BTCCNY\ncurl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/orders/BTCCNY/10000",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":\"SUC_LIST_AVTICE_ORDERS\"},\"result\":[{\"id\":4180528,\"quantity\":20000000,\"rest\":20000000,\"limit\":1000000,\"price\":null,\"side\":\"BUY\",\"created\":1496005693738}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>order id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>amount of original order, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "rest",
            "description": "<p>amount not matched, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>price of original orde, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>average price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "side",
            "description": "<p>order direction.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "created",
            "description": "<p>order created timestamp.</p>"
          }
        ]
      }
    },
    "group": "Orders",
    "description": "<p>Returns users active orders to the given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "/orderpage/:trading_pair/:cursor",
    "title": "List active orders in page",
    "name": "Active_orders_page",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/orderpage/BTCCNY/0",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":\"SUC_LIST_AVTICE_ORDERS_PAGE\"},\"result\":{\"cursor\":\"0\",\"orders\":[{\"id\":4180528,\"quantity\":20000000,\"rest\":20000000,\"limit\":1000000,\"price\":null,\"side\":\"BUY\",\"created\":1496005693738}]}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cursor",
            "description": "<p>new cursor for next api call if cursor != &quot;0&quot;.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "orders",
            "description": "<p>see also /orders/:trading_pair/:id.</p>"
          }
        ]
      }
    },
    "group": "Orders",
    "description": "<p>Returns users active orders to the given trading pair as pages from the given cursor.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "delete",
    "url": "/order/:trading_pair/:id/:id:/:id/...",
    "title": "Cancel orders",
    "name": "Cancel_orders",
    "group": "Orders",
    "description": "<p>Cancel orders.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DELETE -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/order/BTCCNY/10000",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "order_id",
            "description": "<p>return order_id if cancel request is accepted, wait to be processed.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "post",
    "url": "/order",
    "title": "Create order",
    "name": "Create_order",
    "group": "Orders",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trading_pair",
            "description": "<p>see /trading_pairs for available trading_pair</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>buy/sell quantity, max decimal digits list at /trading_pairs, should multiply by 1E8</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>buy/sell at price, max decimal digits list at /trading_pairs, should multiply by 1E8</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>&quot;LIMIT&quot;</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "side",
            "description": "<p>&quot;BUY&quot; or &quot;SELL&quot;</p>"
          }
        ]
      }
    },
    "description": "<p>Creates a new order.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" -d'{\"side\":\"BUY\",\"quantity\":12300000,\"trading_pair\":\"BTCCNY\",\"limit\":1000000000000,\"type\":\"LIMIT\"}' https://szzc.com/api/trader/order",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\":\n    {\n      \"success\":1\n    }\n  \"result\":\n    {\n      \"order_id\": 10000,\n      \"frozen\": 123000000\n    }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "order_id",
            "description": "<p>order id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>error type: ERR_ASSET_NOT_EXISTS|ERR_ASSET_NOT_AVAILABLE|ERR_BALANCE_NOT_ENOUGH|ERR_CREATE_ORDER</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "frozen",
            "description": "<p>frozen amount, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"status\":\n    {\n      \"success\":0,\n      \"message\":\"ERR_CREATE_ORDER\"\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "/history/:trading_pair/:id/:id/:id",
    "title": "List history orders",
    "name": "History_orders",
    "group": "Orders",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/history/BTCCNY/11060",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"trading_pair\":\"ETPCNY\",\"status\":\"TRADE\",\"fee\":0.23,\"min_fee\":10000000,\"created_at\":\"2017-05-25T00:12:27.000Z\",\"cost\":1152468000000,\"limit\":3600000000,\"id\":11060,\"quantity\":32013000000,\"filled_quantity\":32013000000}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>order id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>NEW:not matched order/TRADE:full filled or partial filled order/CANCEL:order canceled.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "fee",
            "description": "<p>fee rate in percentage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "min_fee",
            "description": "<p>minimum fee, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at",
            "description": "<p>order created datetime.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "cost",
            "description": "<p>total cost of the filled quantity.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>price of original order, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>amount of original order, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "filled_quantity",
            "description": "<p>matched amount, should divide by 1E8.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns users history orders to the given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "/historys/:trading_pair/:page",
    "title": "List history trades",
    "name": "History_trades",
    "group": "Orders",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/historys/BTCCNY/0",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"status\":{\"success\":1,\"message\":null},\"result\":[{\"order_id\":118735,\"trade_id\":7,\"trading_pair\":\"BTCCNY\",\"side\":\"B\",\"quantity\":1000000000,\"price\":900000000,\"created_at\":\"2017-06-06T20:45:27.000Z\"},{\"order_id\":118734,\"trade_id\":7,\"trading_pair\":\"BTCCNY\",\"side\":\"S\",\"quantity\":1000000000,\"price\":900000000,\"created_at\":\"2017-06-06T20:45:27.000Z\"}]}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "order_id",
            "description": "<p>order id.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "trade_id",
            "description": "<p>trade id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "side",
            "description": "<p>'B' for 'BUY' / 'S' for 'SELL'.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>deal price, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>deal amount, should divide by 1E8.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "created_at",
            "description": "<p>order created datetime.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns users history trades to the given trading pair.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  },
  {
    "type": "get",
    "url": "/trading_pairs",
    "title": "List trading pairs",
    "name": "Trading_pairs",
    "group": "Orders",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -H\"apikey: your api key\" -H\"signature: your signature\" -H\"Content-Type: application/json\" https://szzc.com/api/trader/trading_pairs",
        "type": "json"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\"BTCCNY\":{\"name\":\"BTCCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"BTC\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"},\"ETCCNY\":{\"name\":\"ETCCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETC\",\"bid_asset_decimals\":2,\"bid_asset_type\":\"COIN\"},\"ETHCNY\":{\"name\":\"ETHCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETH\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"},\"ETPCNY\":{\"name\":\"ETPCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ETP\",\"bid_asset_decimals\":2,\"bid_asset_type\":\"COIN\"},\"ZECCNY\":{\"name\":\"ZECCNY\",\"ask_asset_symbol\":\"CNY\",\"ask_asset_decimals\":2,\"ask_asset_type\":\"FIAT\",\"bid_asset_symbol\":\"ZEC\",\"bid_asset_decimals\":3,\"bid_asset_type\":\"COIN\"}}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>trading pair.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ask_asset_symbol",
            "description": "<p>FIAT.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ask_asset_decimals",
            "description": "<p>max decimal digits.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid_asset_symbol",
            "description": "<p>COIN.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "bid_asset_decimals",
            "description": "<p>max decimal digits.</p>"
          }
        ]
      }
    },
    "description": "<p>Returns all trading pairs.</p>",
    "version": "0.0.0",
    "filename": "controllers/index.js",
    "groupTitle": "Orders"
  }
] });

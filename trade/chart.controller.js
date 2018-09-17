'use strict';

angular.module('app')
  .controller('ChartController', ChartController)
	.controller('tcChartController', tcChartController)
  .filter('trustAsResourceUrl', function ($sce) {
    return function (val) {
      return $sce.trustAsResourceUrl(val);
    };
  });

function ChartController ($scope, $rootScope, $filter, $interval, $q, $translate, PublicService, CONFIG) {

  // ===================   两个图表
  var json_map = {
    'zh_TW': {
      line: '分時',
      candlestick: 'k線圖',
      depth: '深度圖',
      ask: '賣出',
      bid: '買入',
      btn_width: [36, 36]
    },
    'en': {
      line: 'line',
      candlestick: 'K-line',
      depth: 'depth',
      ask: 'ask',
      bid: 'bid',
      btn_width: [40, 70]
    }
  }

  var chart = null;
  var isKline = true;
  var lineOptions = null;
//   var ChartTargetDomId = 'graph-container';
// 	var ChartId_2 = 'graph-container-app';
  var unwatch_OnDepth = null;
	var lang =$translate.use();
	
	if(window.screen.width<768) {
		var ChartTargetDomId = 'graph-container-app';
	}
	else {
		var ChartTargetDomId = 'graph-container';
	}


  $scope.$on('changeLang', function (evn, newLang) {
    if (lang !== newLang) {
      lang = newLang;

      if (isKline) {
        candlestickChart(lineOptions)
      } else {
        chart.update({
          exporting: {
            buttons: {
              deepth: {
                text: json_map[lang].depth,
                theme: {
                  width: json_map[lang].btn_width[0],
                },
              },
              kline: {
                text: json_map[lang].candlestick,
                theme: {
                  width: json_map[lang].btn_width[1],
                },
              }
            }
          },
          series: [{
            name: json_map[lang].bid
          }, {
            name: json_map[lang].ask
          }]
        })
      }
    }
  })

  // 深度图加载
  function updataDeepth () {
    var asyncData = $scope.delegateData

    var bid = []
    var ask = []
    asyncData.bid.forEach(function (item) {
      bid.unshift([item[0] / 100000000, item[2] / 100000000, item[1] / 100000000])
    })
    asyncData.ask.forEach(function (item) {
      ask.push([item[0] / 100000000, item[2] / 100000000, item[1] / 100000000])
    })

    chart.update({
//       title: {
//         text: lineOptions.pair
//       },
      series: [{
        data: bid
      }, {
        data: ask
      }]
    });
  }

  var initDeepth = function (targetId) {

    var highChartOptions = {
      credits: false,
      chart: {
        type: 'area',
        // zoomType: 'xy',
        panning: true,
        backgroundColor: '#1b262d',
        margin: [40, 0, 30, 10],
        style: {
          fontFamily: 'Trebuchet MS, Tahoma, Arial, sans-serif'
        }
      },
      mapNavigation: {
        enabled: true,
        enableButtons: false
      },
//       title: {
//         text: ''
//       },
      navigation: {
        buttonOptions: {
          buttonSpacing: 5,
          theme: {
            'stroke-width': 1,
            stroke: '#515151',
            fill: '#1b262d',
            r: 0,
            height: 14,
            width: 40,
            paddingLeft: 9,
            paddingRight: 9,
						paddingTop:3,
						paddingBottom:3,
            style: {
              color: '#fff',
              fontWeight: 'bold',
            },
            states: {
              hover: {
                stroke: '#fff',
                fill: '#1b262d',
              }
            }
          }
        }
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            enabled: false
          },
          deepth: {
            text: json_map[lang].depth,
            theme: {
              width: 45,
              style: {
                color: '#11cfe0'
              }
            },
            onclick: function () {
              updataDeepth();
            }
          },
          kline: {
            text: json_map[lang].candlestick,
            theme: {
              width: 45,
            },
            onclick: function () {
              chart.destroy();
              chart = null;
              isKline = true;
              unwatch_OnDepth();
              candlestickChart(lineOptions);
            }
          },
          // image: {
          //   text: 'image',
          //   onclick: function () {
          //     console.log('image');
          //   }
          // },
          // fullscreen: {
          //   text: 'full',
          //   onclick: function () {
          //     console.log('fullscreen');
          //   }
          // }
        }
      },
      // subtitle: {
      //   text: '基于 highCharts / svg'
      // },
      xAxis: {
        // title: {
        //   enabled: true,
        //   text: '价格'
        // },
        gridLineWidth: 1,
        crosshair: {
          dashStyle: 'Dash'
        },
        // startOnTick: true,
        // endOnTick: true,
        // showLastLabel: true
      },
      yAxis: {
        // lineWidth: 1,
        gridLineWidth: 1,
        crosshair: {
          dashStyle: 'Dash'
        },
        title: {
          enabled: false,
          text: '数量'
        },
        labels: {
          align: 'left',
          x: 0,
          y: -2
        }
      },
      legend: {
        // align: '50%',
        verticalAlign: 'top',
        y: 40,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
        borderWidth: 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '价格：{point.x}, 数量：{point.y}'
          }
        }
      },
      series: [{
        name: json_map[lang].bid,
        color: '#ee6259',
        // data: bid
      }, {
        name: json_map[lang].ask,
        color: '#419af6',
        // data: ask
      }]
    };

    chart = Highcharts.chart(targetId, highChartOptions);

    updataDeepth()

    unwatch_OnDepth = $scope.$on('OnDepth', () => {
      updataDeepth()
    })
  }

  // K线图加载
  function candlestickChart (market) {

    function getParameterByName (name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var viewConfig = {
      symbol: market.pair,
      container_id: ChartTargetDomId,
      interval: '15',
      // timeframe: 'D',
      datafeed: new Datafeeds.UDFCompatibleDatafeed(CONFIG.public, 60 * 60 * 1000),
      library_path: "/js/charting_library/",
      locale: lang,
      drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
      disabled_features: [
        'use_localstorage_for_settings',
        'save_chart_properties_to_local_storage',
        'left_toolbar',
        'header_symbol_search',
        'header_interval_dialog_button',
        'header_resolutions',
        'header_chart_type',
        'header_settings',
        'header_indicators',
        'header_compare',
        'header_undo_redo',
        'header_saveload',
        'header_screenshot',
        'timeframes_toolbar',
        'edit_buttons_in_legend',
        'context_menus',
        'legend_context_menu',
        'control_bar',
        'volume_force_overlay',
        'pane_context_menu'
      ],
      enabled_features: [
        'study_templates',
        'chart_property_page_trading',
      ],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: "1.1",
      client_id: 'tradingview.com',
      autosize: true,
      user_id: 'public_user_id',
      timezone: "Asia/Shanghai",
      toolbar_bg: "#222222",
      overrides: {
        "paneProperties.background": "#181b2a",
        "paneProperties.vertGridProperties.color": "#36464f",
        "paneProperties.horzGridProperties.color": "#36464f",
        'paneProperties.legendProperties.showLegend': false,
        // "symbolWatermarkProperties.transparency": 90,
        "symbolWatermarkProperties.color": "rgba(0,	0,	0,	0)",
        "scalesProperties.textColor": "#AAA",
        "paneProperties.topMargin": "30",
        // "mainSeriesProperties.candleStyle.drawWick": false,
        "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
        "mainSeriesProperties.candleStyle.drawBorder": false,
        "mainSeriesProperties.candleStyle.wickUpColor": '#6ba583',
        "mainSeriesProperties.candleStyle.wickDownColor": '#d75442'

      }
    };

    var widget = new TradingView.widget(viewConfig);

    widget.MAStudies = [];
    widget.onChartReady(function () {
      chart = widget.chart();
      let mas = [{
        day: 5, color: "#965fc4"
      }, {
        day: 15, color: "#b7248a"
      }];

      // 自定义时间段按钮
      let buttons = [
        {
          label: json_map[lang].line,
          resolution: '1',
          chartType: '3'
        },
        {
          label: "1m",
          resolution: "1"
        },
        {
          label: "5m",
          resolution: "5"
        },
        {
          label: "15m",
          resolution: "15"
        },
        {
          label: "30m",
          resolution: "30"
        },
        {
          label: "1h",
          resolution: "60"
        },
        {
          label: "1d",
          resolution: "D"
        },
        {
          label: "week",
          resolution: "W"
        }

      ];

      mas.forEach(item => {
        chart.createStudy("Moving Average", false, false, [item.day], entity => {
          widget.MAStudies.push(entity);
        }, { "plot.color": item.color });
      });

      chart.onIntervalChanged().subscribe(null, function (interval, obj) {
        widget.changingInterval = false;
      });

      widget.createButton({ align: "right" })
        .attr('title', "k-line view")
        .on('click', function (e) {
          chart = null
          candlestickChart(lineOptions)
        })
        .append('<span style="color: #11cfe0;">' + json_map[lang].candlestick + '</span>');

      widget.createButton({ align: "right" })
        .attr('title', "depth view")
        .on('click', function (e) {
          widget.remove();
          chart = null
          isKline = false
          initDeepth(ChartTargetDomId);
        })
        .append('<span>' + json_map[lang].depth + '</span>');

      buttons.forEach((item, index) => {
        let button = widget.createButton();

        item.resolution === widget.options.interval && updateSelectedIntervalButton(button);
        button.attr("data-resolution", item.resolution)
          .attr("data-chart-type", item.chartType === undefined ? 1 : item.chartType)
          .html("<span>" + item.label + "</span>")
          .on("click", function () {


            if (!widget.changingInterval && !button.hasClass("selected")) {
              let chartType = +button.attr("data-chart-type");
              let resolution = button.attr("data-resolution");

              if (chart.resolution() !== resolution) {
                widget.changingInterval = true;
                chart.setResolution(resolution);
              }

              if (chart.chartType() !== chartType) {
                chart.setChartType(chartType);
                // widget.applyOverrides({
                //   "mainSeriesProperties.style": chartType
                // });
              }

              updateSelectedIntervalButton(button);
              showMAStudies(chartType !== 3);
            }
          })
      });

      function updateSelectedIntervalButton (button) {
        widget.selectedIntervalButton && widget.selectedIntervalButton.removeClass("selected");
        button.addClass("selected");
        widget.selectedIntervalButton = button;
      }

      function showMAStudies (visible) {
        widget.MAStudies.forEach(item => {
          chart.setEntityVisibility(item, visible);
        })
      }
    });

  };

  $scope.$on("loadAndDraw", (event, data) => {
    // loadAndDraw(options.pair, options.period, options.selectedButton);
    lineOptions = data;

    if (isKline) {
      if (chart) {
        chart.setSymbol(lineOptions.pair)
      } else {
        candlestickChart(lineOptions)
      }
    }

  });

}

function tcChartController($scope, $rootScope, $filter, $interval, $q, $translate, PublicService, CONFIG) {
// 	Highcharts.setOptions({
// 		colors: ['#219dd3', '#fd945a']
// 	});
	$scope.vol_data = [];
	$scope.price_data = [];
	$scope.time_data = [];
	
	PublicService.GetCandlestickByPage('day1','BTCUSDT',30).then(function (res) {
		if(!$scope.language) {
				$scope.language = $translate.use();
		}
		if($scope.language == 'zh_TW') {
			$scope.price = '價格';
			$scope.vol = '總量';
		}else {
			$scope.price = 'Price';
			$scope.vol = 'Volume';
		}
		if (res.success == true) {
						var item = res.data;
				    item.forEach(function (items) {
				      $scope.vol_data.push(items[1] / 100000000);
				    })
						item.forEach(function (items) {
							$scope.price_data.push(items[5] / 100000000);
						})
						Date.prototype.toLocaleString = function() {
								return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate();
						};
						item.forEach(function (items) {
							$scope.time_data.push(new Date(items[0]).toLocaleString());
						})
						if($scope.time_data.length<10) {
							$scope.rotation = 0;
						}else {
							$scope.rotation = -45;
						}
						console.log($scope.price_data)
						var chart = Highcharts.chart('tc_container', {
								credits: false,
								chart: {
										zoomType: '',
										panning: false, //禁用放大
										pinchType: false, //禁用手势操作
										backgroundColor: '#181b2a',
										margin: [40, 150, 100, 80]
								},
								title: {
										text: ''
								},
								subtitle: {
										text: ''
								},
								xAxis: [{
										categories: $scope.time_data,
										crosshair: true,
										 labels: {
													rotation: $scope.rotation
											}
								}],
								yAxis: [{ // Primary yAxis
										labels: {
												format: '{value}',
												style: {
														color: Highcharts.getOptions().colors[1]
												}
										},
										title: {
												text: '',
												style: {
														color: Highcharts.getOptions().colors[1]
												}
										},
										 min: 0,
										opposite: true
								}, { // Secondary yAxis
										gridLineWidth: 0,
										title: {
												text: '',
												style: {
														color: Highcharts.getOptions().colors[0]
												}
										},
										labels: {
												format: '{value}',
												style: {
														color: Highcharts.getOptions().colors[0]
												}
										},
										 min: 0
								}],
								tooltip: {
										shared: true
								},
								legend: {
										layout: 'vertical',
										align: 'right',
										verticalAlign: 'middle',
										floating: true,
										// backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
								},
								navigation: {
									buttonOptions: {
										enabled: false
									}
								},
								series: [{
										name: $scope.price,
										type: 'spline',
										yAxis: 1,
										data: $scope.price_data,
								},{
										name: $scope.vol,
										type: 'spline',
										data: $scope.vol_data,
						// 				tooltip: {
						// 						valueSuffix: ' °C'
						// 				}
								}]
						});
		} else {
			console.log(res.message);
		}
	})
	
}

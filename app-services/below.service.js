/**
 * Created by wufang on 2018/8/31.
 */
(function() {
    'use strict';
    angular
        .module('app')
        .factory('BelowService', BelowService);

    function BelowService($http, $cookies, $rootScope, $location, $translate, FlashService,CONFIG, UserTokenService, $q) {
        let service = {};

        var SERVER = CONFIG.below;


        service.debug = true;
        service.SERVER = SERVER;
		
		//获取会员类型
		service.checkBussiness = checkBussiness;
		
		//会员充值/提现
		service.createOrder = createOrder;
		
		//用户TWD订单查询
		service.queryOrder = queryOrder;
		
		//平台TWD订单查询
		service.queryOrder_business = queryOrder_business;
		
		// 撤销订单
		service.cancelOrder = cancelOrder;
		
		//订单银行卡信息查询
		service.querybusinessInfo = querybusinessInfo;
		
		//平台确认订单信息
		service.confirmOrder = confirmOrder;
		
    return service;
		
        // ---------- (づ｡◕‿‿◕｡)づ dataAnalysis functions ------------------>
		function checkBussiness(token) {
			return _get("checkBussiness", {
					token: token
			});
		}
		
		function createOrder(order_type,asset_type,asset_amount) {
				return _post("createOrder", {
						'order_type':order_type,
						'asset_type':asset_type,
						'asset_amount':asset_amount
				});
		}
		
		function queryOrder(type,page_no,page_size) {
				return _post("queryOrder",{
					 'type': type,
					 'page_no': page_no,
					 'page_size':page_size
			})
		}
		
		function queryOrder_business(type,remit_code,create_time_start,create_time_end,page_no,page_size) {
				return _post("queryOrder",{
					'type': type,
					'remit_code':remit_code,
					'create_time_start':create_time_start,
					'create_time_end':create_time_end,
					'page_no': page_no,
					'page_size':page_size
			})
		}
		
		function cancelOrder(order_id) {
			return _post("cancelOrder",{
					'order_id': order_id
			})
		}
		
		function querybusinessInfo(order_id) {
			return _post("querybusinessInfo",{
					'order_id': order_id
			})
		}
		
		function confirmOrder(id) {
				return _post("confirmOrder",{
						'order_id': id,
				})

		}
		
		
		


        //get提交数据
        function _get(method, params) {
            var token = $rootScope.globals.token;
// 						if(!token) {
// 							$location.url('/login');
// 						}
            return $http.get(SERVER + method, { headers : { "x-access-token" :token }}).then(
                function(res){
                    return handleSuccess(res);
                },
                function(res){
                    return handleError(res);
                });
        } // end _get

        //请求成功处理函数
        function handleSuccess(res) {
        	if(res.data && res.data.status && res.data.status.success)
        		return { success: true, data: res.data.result};
              else
                return handleError(res);
        } // end handleSuccess


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


        function handleError(res) {
            if(res.data && res.data.status && res.data.status.message){
                if(res.data.status.message==="ERR_USERTOKEN_NOT_FOUND"){
                    $location.url('/login');
                }
                else if(res.data.status.message==='ERR_USERTOKEN_VERIFY'){
                    $translate("MESSAGE.ERROR_USERTOKEN_VERIFY")
                        .then(function (data) {
                            UserTokenService.ClearCredentials();
                            FlashService.Error(data,true);
                            $location.url('/login');
                        });
                }
                return { success: false, message: res.data.status.message };
            }
            return { success: false, message: 'General connection error' };
        } // end handleError


    } // end PrivateService


})();
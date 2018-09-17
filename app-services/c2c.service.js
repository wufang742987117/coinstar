/**
 * Created by hjj on 2018/3/9.
 */
(function() {
    'use strict';
    angular
        .module('app')
        .factory('C2cService', C2cService);

    function C2cService($http, $cookies, $rootScope, $location, $translate, FlashService,CONFIG, UserTokenService, $q) {
        let service = {};

        var SERVER = CONFIG.c2c;


        service.debug = true;
        service.SERVER = SERVER;
        service.checkBussiness=checkBussiness;
        service.checkAuthInfo=checkAuthInfo;
        service.createOrder=createOrder;
        service.authUserInfo=authUserInfo;
        service.confirmOrder=confirmOrder;
        service.getUserLimit=getUserLimit;
        service.getChangeReloadList=getChangeReloadList;
        service.querybusinessInfo=querybusinessInfo;
        service.userScrollInfo=userScrollInfo;
        service.getReviewInfo = getReviewInfo;
        service.cancelOrder=cancelOrder;
				service.getUsdtPrice =getUsdtPrice;
        return service;

        // ---------- (づ｡◕‿‿◕｡)づ dataAnalysis functions ------------------>

        function checkBussiness(token) {
            return _get("checkBussiness", {
                token: token
            });
        }
				
				function getUsdtPrice(token) {
						return _get("getUsdtPrice", {
								token: token
						});
				}
				
        function checkAuthInfo(token) {
            return _get("checkAuthInfo", {
                token: token
            });
        }
        
        function getReviewInfo(token) {
            return _get("getReviewInfo", {
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

        function authUserInfo(name,id,branch,card,file,request_type,authtoken) {
            return _post("authUserInfo",{
                'user_name': name,
                'id_card': id,
                'bank_branch': branch,
                'bank_account_no': card,
                'file_list':file,
                'request_type':request_type,
                'authtoken':authtoken
            })
            
        }
        function confirmOrder(id) {
            return _post("confirmOrder",{
                'order_id': id,
            })

        }
        function cancelOrder(id) {
            return _post("cancelOrder",{
                'order_id': id,
            })

        }
        function userScrollInfo(order_type) {
            return _post("queryHotOrder",{
                'order_type': order_type,
            })

        }
        function getChangeReloadList(type,order_type,create_time_start,create_time_end,commercial_id,remit_code,page_no,page_size) {
            return _post("queryOrder",{
                'type': type,
                 'order_type': order_type,
                 'create_time_start': create_time_start,
                 'create_time_end': create_time_end,
                 'commercial_id':commercial_id,
                 'remit_code': remit_code,
                 'page_no': page_no,
                 'page_size':page_size
            })

        }
        function querybusinessInfo(id) {
            return _post("querybusinessInfo",{
                'order_id': id,
            })

        }
        function getUserLimit(vol) {
            return _post("getUserLimit",{
                'amount': vol,
            })

        }

        //get提交数据
        function _get(method, params) {
            var token = $rootScope.globals.token;
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
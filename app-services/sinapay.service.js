/**
 * @author shenyuhang
 * @date 2017-04-20
 * @description  sinapay service 新浪支付接口
 **/
(function() {
    'use strict';
    angular
        .module('app')
        .factory('SinaPayService', SinaPayService);

    SinaPayService.$inject = ['$http', '$cookies', '$rootScope', 'CONFIG'];

    function SinaPayService($http, $cookies, $rootScope, CONFIG) {
        var testFlag = "test";
        let service = {};

        var SERVER = CONFIG.sinapay;

        service.debug = true;
        service.querySinaInfo = querySinaInfo;
        service.create_activate_member = create_activate_member;
        service.realNameAuthentication = realNameAuthentication;
        service.set_pay_password = set_pay_password;
        service.querySetPayKey = querySetPayKey;
        service.query_withhold_authority = query_withhold_authority;
        service.handle_withhold_authority = handle_withhold_authority;
        service.getBinding_Bank_Card = getBinding_Bank_Card;
        service.saveBankCardInfo = saveBankCardInfo;
        service.depositSubmit = depositSubmit;
        service.queryCardBindSina = queryCardBindSina;

        return service;

        //查询会员新浪相关信息
        function querySinaInfo(params) {
            return _get("querySinaInfo", params);
        };

        //查询新浪绑定的卡
        function queryCardBindSina(params) {
            return _get("queryCardBindSina", params);
        };

        //创建激活新浪会员
        // {}
        function create_activate_member(params) {
            return _post("create_activate_member", params);
        };

        //实名认证接口
        function realNameAuthentication(params) {
            return _post("realNameAuthentication", params);
        };

        //设置新浪支付密码接口
        function set_pay_password(params) {
            return _post("set_pay_password", params);
        };

        //请求新浪查询是否设置过支付密码
        function querySetPayKey(params) {
            return _get("querySetPayKey", params);
        };

        //查询是否委托扣款
        function query_withhold_authority(params) {
            return _get("query_withhold_authority", params);
        };

        //设置委托扣款
        function handle_withhold_authority(params) {
            return _post("handle_withhold_authority", params);
        };

        //绑定银行卡提交新浪获取短信验证码接口
        function getBinding_Bank_Card(params) {
            return _post("getBinding_Bank_Card", params);
        };

        //保存数据
        function saveBankCardInfo(params) {
            return _post("saveBankCardInfo", params);
        }

        //充值
        function depositSubmit(params) {
            return _post("create_hosting_deposit", params);
        }

        function _post(method, params) {
            var token = $rootScope.globals.token;
            return $http.post(SERVER + method, params, {
                headers: {
                    "x-access-token": token
                }
            }).then(function(res) {
                return handleSuccess(res);
            },function(res) {
                return handleError(res);
            });
        } // end _post



        function _get(method, params) {
            var token = $rootScope.globals.token;
            return $http.get(SERVER + method, {
                headers: {
                    "x-access-token": token
                }
            }).then(function(res) {
                return handleSuccess(res);
            }, function(res) {
                return handleError(res);
            });
        }

        //请求成功处理函数
        function handleSuccess(res) {
            if (res.data != undefined && res.data.status.success != undefined && res.data.status.success)
                return {
                    success: true,
                    data: res.data.status.message
                };
            else
                return handleError(res);
        } // end handleSuccess

        //请求失败处理函数
        function handleError(res) {
            console.log(res);
            if (res.error != undefined)
                return {
                    success: false,
                    message: res.error
                };
            return {
                success: false,
                message: res.data.status.message
            };
        } // end handleError

    }

})();

'use strict';

angular.module('app')
    .controller('BalanceLockController', BalanceLockController);
function BalanceLockController($scope, ngDialog, PrivateService, $interval,$location,AuthenticationService,FlashService) {
    $scope.isshow = false;
    $scope.errorVcode = false;
    $scope.settings = {};
    $scope.params={};
    $scope.page = {
        currentPage: 1,
        pagesize: 10
    };
    $scope.balance_name = 'ETP';

    //按照币种获取数量
    $scope.getcnybalance = function(type){
        PrivateService.Balance(type).then(function (res) {
            $scope.item_balance = res.data;
            $scope.lockdate();
        })
    };

    $scope.init = function () {
        $scope.getcnybalance($scope.balance_name);
        $scope.getSettingState();
        $scope.getLockList();
    };

    $scope.getAllLock = function () {
        $scope.params.amount = ($scope.item_balance.balance/ Math.pow(10, 8)).toFixed(2);
    };

    //锁仓时间
    $scope.lockdate = function () {
        PrivateService.lockRates($scope.balance_name).then(function(res){
            $scope.lockdate = res.data;
        });
    };
    //获取账号号码
    $scope.getSettingState = function () {
        PrivateService.getSettings().then(function (response) {
            $scope.settings = response.data;
        }, function (error) {
            console.log('Error:', error);
        });
    };
//锁仓提交
    $scope.addlock=  function(){
        $scope.params.amount = $scope.params.amount * Math.pow(10, 8);
        PrivateService.lockETP($scope.balance_name,$scope.params.amount,$scope.params.lock_days,$scope.params.authtoken,$scope.params.fundPwd).then(function(res){
            $scope.params.amount = $scope.params.amount / Math.pow(10, 8);
            if(res.success){
                $scope.init();
                $scope.params={};
                // $location.path('/#!/account');
                FlashService.Toast("ACCOUNT.SUCCESSFULL_LOCK", 'success');

            }else{
                if (res.message = 'ERR_BALANCE_INSUFFICIENT') {
                    $scope.err_message = '账户余额不足';
                } else if (res.message = 'ERR_TPASS_WRONG') {
                    $scope.err_message = '资金密码不正确';
                } else if(res.message = 'ERR_SET_BALANCE'){
                    $scope.err_message = '锁仓操作错误';
                }else if(res.message = 'ERR_AUTHTOKEN_INVALID'){
                    $scope.err_message = '验证码失效';
                }
            }
        })
    };


    //获取手机验证码
    $scope.getVerifyCode = function () {
        setTimeInterval();
        AuthenticationService.Ask("LOCK").then(function (res) {
            if (res.success) {
                $scope.params.id = res.data.id;

            }
        });
    };

    //预验证手机验证码
    $scope.getVerifyphoneCode = function () {
        $scope.params.secret = $scope.params.verificationCode;
        if ($scope.params.verificationCode.length !== 6) {
            $scope.errorVcode = true;
            return false;
        }
        AuthenticationService.Answer($scope.params).then(function (res) {
            if (res.success) {
                $scope.params.authtoken = res.data.token;
                $scope.errorVcode = false;
            } else {
                $scope.errorVcode = true;
            }
        });
    };

    //验证码倒计时
    $scope.text = '获取验证码';
    function setTimeInterval() {
        $scope.countDown = 60;
        var seq = $interval(function () {
            $scope.isshow = true;
            $scope.countDown--;
            $scope.text = $scope.countDown + " 秒后获取";
            if ($scope.countDown <= 0) {
                clearTime(seq);
            }
        }, 1000);
    }

    //清除倒计时
    function clearTime(time) {
        $interval.cancel(time);
        $scope.isshow = false;
        $scope.countDown = '';
        $scope.text = '获取验证码';
    }

    //锁仓列表

    $scope.getLockList = function () {
        PrivateService.getLockActive('etp', $scope.page).then(function (res) {
            $scope.params.locks = res.data;
            $scope.params.totalItems = res.data.count;
        });
    };

    //分页事件
    $scope.selectPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
        $scope.getLockList();
    };
    $scope.init();
}
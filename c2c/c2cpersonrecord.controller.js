/**
 * Created by HJJ on 2018/2/28.
 */

'use strict';

angular.module('app')
    .controller('c2cpersonrecordController', c2cpersonrecordController)
    .controller('c2cpersonrecordshopController', c2cpersonrecordshopController)
    .filter('typeFilter', function () {
    	return function (type, lang) {
    		if (lang == 'zh') {
    			if (type == 1) {
    				var typeName = '買入';
    			} else {
    				typeName = '賣出';
    			}
    		}
    		if (lang == 'en') {
    			if (type == 1) {
    				var typeName = 'buy in';
    			} else {
    				typeName = 'sell out';
    			}
    		}
    		return typeName;
    	};
    })
    .filter('statusFilter', function () {
    	return function (sta, lang) {
    		if (lang == 'zh') {
    			if (sta == 1) {
    				var staName = '待確認';
    			} else if (sta == 2) {
    				staName = '確認中';
    			} else if (sta == 3) {
    				staName = '完成';
    			} else if (sta == 4) {
    				staName = '已撤銷';
    			} else if (sta == 0) {
    				staName = '待審核';
    			}
    		}
    		if (lang == 'en') {
    			if (sta == 1) {
    				staName = 'To be confirmed';
    			} else if (sta == 2) {
    				staName = 'Confirmation';
    			} else if (sta == 3) {
    				staName = 'complete';
    			} else if (sta == 4) {
    				staName = 'Revoked';
    			} else if (sta == 0) {
    				staName = 'be audited';
    			}
    		}
    		return staName;
    	}
    })
    .filter('dateFilter', function () {
        return function (date) {

            var newDate = new Date(date);
            newDate = newDate.getTime();
            return newDate;
        }

    })
    .filter('numFilter',function () {
        return function (num) {
            var numNew =parseInt(num*100)/100;
            return numNew;
        }
    })

function c2cpersonrecordController($scope, PrivateService, C2cService,FlashService,$cookies,$translate) {
    if(!$scope.language) {
    	$scope.language = $translate.use();
    }
	$scope.buyPop = false;
    $scope.orderTypeOdd=1;
    $scope.page2=false;
    $scope.page=false;
    $scope.params = {
        currentPage: 1,
        pagesize: 10,
        dataList:[],
        totalItems:0
    };

    $scope.revoke=function (order_id,order_type) { //撤销此笔订单
        C2cService.cancelOrder(
            order_id,
        ).then(function (res) {
            if (!res.success) {
                FlashService.Toast("C2CORDERCANCEL.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDERCANCEL.SUCCESS", 'success');
                if(order_type == 2){
                    $scope.getRecords(2,2)
                }else{
                    $scope.getRecords(2,1)
                }
            }
        })
    }
    $scope.init = function () {
        $scope.getRecords(2, 1);
        $scope.uid=$cookies.get('uid');
        // console.log($scope.uid)

    }
    $scope.getRecords = function (type, order_type, create_time_start, create_time_end,commercial_id,remark,page) {
        if(!page){
            $scope.params.currentPage=1;
        }
        create_time_start=new Date(create_time_start).getTime();
        create_time_end=new Date(create_time_end).getTime();
        $scope.timeStart=create_time_start;
        $scope.timeEnd=create_time_end;
        if(order_type === 'buy'){
            order_type= 1;
        }else if(order_type === 'sell'){
            order_type= 2;
        }
        $scope.order_type=order_type;
        if($scope.orderTypeOdd !==$scope.order_type){
            $scope.params.currentPage=1;
        }
        C2cService.getChangeReloadList(
            type,
            order_type,
            create_time_start,
            create_time_end,
            commercial_id,
            remark,
            $scope.params.currentPage,
            $scope.params.pagesize
        ).then(function (res) {
            $scope.dataList = res.data.data;
            $scope.params.totalItems = res.data.count;
        })
    }

    $scope.getBankInfo = function (id, price, amount, code) {
        C2cService.querybusinessInfo(
            id,
        ).then(function (res) {
            $scope.account = res.data;
            $scope.asset_price = price;
            $scope.asset_amount = amount;
            $scope.remit_code = code;
            $scope.orderId=id;
        })

    }
    $scope.selectPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function (order_type) {    //翻页事件
        if(order_type === 'buy'){
            order_type= 1;
        }else if(order_type === 'sell'){
            order_type= 2;
        }
        $scope.page2=true;
        $scope.orderTypeOdd=order_type;
        $scope.getRecords(2,order_type,$scope.timeStart,$scope.timeEnd,'','',$scope.page2);
    };
    $scope.confirmOrder = function (id) {
        C2cService.confirmOrder(
            id,
        ).then(function (res) {
            if (!res.success) {
                FlashService.Toast("C2CORDER.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDER.SUCCESS", 'success');
                setTimeout(function () {
                    $scope.getRecords(1,$scope.uid)
                },500)
            }
        })

    };

    $scope.popStatus = function (type, orderId, price, amount, code) {
        switch (type) {
            case '打开收款账户':
                $scope.buyPop = true;
                $scope.getBankInfo(orderId, price, amount, code);
                break;
            case '关闭收款账户':
                $scope.buyPop = false;
                // $scope.confirmOrder(orderId);
                break;
            case '关闭收款账户按钮':
                $scope.buyPop = false;
                break;
        }
    }
    $scope.init();

}

function c2cpersonrecordshopController($scope, $translate, PrivateService, C2cService,FlashService,$cookies) {
    if(!$scope.language) {
    	$scope.language = $translate.use();
    }
	$scope.buyPop = false;
    $scope.params = {
        currentPage: 1,
        pagesize: 10,
        dataList:[],
        totalItems:0
    };
    $scope.checkBussiness = function () {
        C2cService.checkBussiness($scope.params).then(function (res) {
            $scope.uid = res.data.business_type;
        });
    };

    $scope.getRecords = function (type, order_type, create_time_start, create_time_end,commercial_id,remark,page) {
        if(!page){
            $scope.params.currentPage=1;
        }
        create_time_start=new Date(create_time_start).getTime();
        create_time_end=new Date(create_time_end).getTime();
        $scope.timeStart=create_time_start;
        $scope.timeEnd=create_time_end;
        C2cService.getChangeReloadList(
            type,
            order_type,
            create_time_start,
            create_time_end,
            commercial_id,
            remark,
            $scope.params.currentPage,
            $scope.params.pagesize
        ).then(function (res) {
            $scope.dataList = res.data.data;
            $scope.params.totalItems = res.data.count;
        })

    }

    $scope.selectPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {    //翻页事件
        $scope.page=true;
        $scope.getRecords(1,'',$scope.timeStart,$scope.timeEnd,'','',$scope.page);
    };

    $scope.getBankInfo = function (id, price, amount, code,order_type,status) {
        C2cService.querybusinessInfo(
            id,
        ).then(function (res) {
            $scope.account = res.data;
            $scope.asset_price = price;
            $scope.asset_amount = amount;
            $scope.remit_code = code;
            $scope.order_type=order_type;
            $scope.orderId=id;
            $scope.status=status;
        })

    }

    $scope.confirmOrder = function (id) {
        C2cService.confirmOrder(
            id,
        ).then(function (res) {
            if (!res.success) {
                if(res.message=="USER_WITHDRAW_LIMIT") {
                    FlashService.Toast("USER_WITHDRAW_LIMIT", 'error');
                }else
                    FlashService.Toast("C2CORDER.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDER.SUCCESS", 'success');
                setTimeout(function () {
                    $scope.getRecords(1)
                },500)
            }
        })
    };

    $scope.popStatus = function (type, orderId, price, amount, code,order_type,status) {
        switch (type) {
            case '打开收款账户':
                $scope.buyPop = true;
                $scope.getBankInfo(orderId, price, amount, code,order_type,status);
                break;
            case '关闭收款账户':
                $scope.buyPop = false;
                if($scope.status ===1){
                $scope.confirmOrder(orderId);
                }
                break;
            case '关闭收款账户按钮':
                $scope.buyPop = false;
                break;
        }
    }
    $scope.loading = function () {
        $scope.checkBussiness();
        $scope.getRecords(1);
    }
    $scope.loading();
}
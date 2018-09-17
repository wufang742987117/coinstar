/**
 * Created by hjj on 2017/12/14.
 */
'use strict';

angular.module('app')
    .controller('DataAnalysisController', DataAnalysisController);
	

function DataAnalysisController($scope,PrivateService) {
	$scope.type = 'deposit';  //默认展示充值记录
	$scope.params = {
        currentPage: 1,
        pagesize: 20
    };
	
	$scope.History = function(i) {
		$scope.type = i;
		$scope.depositsHistory(2,i);
	}
	
	console.log(111111,$scope.selectAsset)
	$scope.getAssetHistory = function() {
		if($scope.type == 'deposit') {
			$scope.depositsHistory(2,'deposit');
		}else {
			$scope.depositsHistory(2,'withdrawalsHash');
		}
	}
	
	$scope.selectPage = function (pageNo) {
        $scope.params.currentPage = pageNo;
    };
	
	$scope.pageChanged = function () {
		$scope.getAssetHistory();
    };
	
	//获取充值列表
	$scope.depositsHistory = function(i,j) {
		PrivateService.getAssets().then(function (res){
			$scope.balances = $scope.assetsdata = res.data.data;
			if(i == 1){
				$scope.selectAsset = $scope.balances[0];
			}
			if(j =='deposit') {
				PrivateService.getDepositCoinHistory($scope.selectAsset.symbol,$scope.params).then(function (res) {
					if (res.success) {
						$scope.detailList = res.data.data;
						$scope.params.totalItems = res.data.count;
					}
				});
			}
			else if(j =='withdrawalsHash') {
				PrivateService.withdrawalsHash($scope.selectAsset.symbol,$scope.params).then(function (res) {
					if (res.success) {
						$scope.detailList = res.data.data;
						$scope.params.totalItems = res.data.count;
					}
				});
			}
		})
	}
	$scope.depositsHistory(1,'deposit');
	
}

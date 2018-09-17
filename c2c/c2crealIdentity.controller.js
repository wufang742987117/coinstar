/**
 * Created by HJJ on 2018/2/28.
 */
(function() {
'use strict';

angular.module('app')
    .controller('C2crealIdentityController', C2crealIdentityController);

function C2crealIdentityController($scope, C2cService, FlashService, PrivateService, $http, PublicService,AuthenticationService,$interval , CONFIG) {
	$scope.checkWay = 2;
	$scope.userFrom = 1;
	$scope.params= {
		verCode:null
	};
	$scope.user_name = null;
	$scope.id_card = null;
	$scope.bank_branch = null;
	$scope.bank_account_no = null;
	$scope.file = [];
	$scope.userInfo = {};
	$scope.authtoken = null;
    $scope.imgLimit1=false;
    $scope.imgLimit2=false;
    $scope.imgLimit3=false;
    $scope.request_type = 'EAUTH';
    // $scope.setting={'email':false};

    // defaultShow();
    // function defaultShow() {
    //     PrivateService.getSettings()
		// 	.then((response) => {
		// 	if(response.success) {
		// 		$scope.setting = responsedata;
    //
		// 	}
		// });
    // }
    defaultShow();
	 function defaultShow() {
        PrivateService.getSettings()
        	.then((response) => {
        	if(response.success) {
        		$scope.setting = response.data;
        	}
        });
    }

    var vm =this;
    function cancelCount(){
        $interval.cancel(count);
    }
    function cleanupCount(){
        $scope.code_count=false;
        vm.code_sent=false;
    }
    var count;
    function Counter() {
        $scope.code_count = true;
        $scope.counter=60;
        count = $interval(()=>{
            $scope.counter--;
        }, 1000, 60);
        count.then(()=>cleanupCount(), ()=>cleanupCount());
    }

    $scope.askBind = function (params) {
        AuthenticationService.Ask(params).then(function (res) {

            if (res.success) {
                $scope.id = res.data.id;
                Counter();
            }
        });
    };

    $scope.getVerifyemailCode = function () {

        if ($scope.params.verCode.length!==6) {
            $scope.errorVcode = true;
            return;
        }else{
            $scope.data ={
                id:$scope.id,
                secret:$scope.params.verCode
            };
            AuthenticationService.Answer($scope.data).then(function (res) {
                if (res.success) {
                    $scope.authtoken = res.data.token;
                    $scope.request_type = 'EAUTH';
                    $scope.errorVcode = false;
                } else {
                    $scope.errorVcode = true;
                }
            });
        }
    };

    $scope.getVerifyphoneCode = function () {
        if ($scope.params.verCode.length!==6) {
            $scope.errorVcode1 = true;
            return;
        }else{
            $scope.data ={
                id:$scope.id,
                secret:$scope.params.verCode
            };
            AuthenticationService.Answer($scope.data).then(function (res) {
                if (res.success) {
                    $scope.authtoken = res.data.token;
                    $scope.request_type = 'SAUTH';
                    $scope.errorVcode1 = false;
                } else {
                    $scope.errorVcode1 = true;
                }
            });
        }
    };



	//选择方式
	$scope.checkType = function() {
		var Unopened_conter = document.querySelector(".Unopened_conter");
// 		if($scope.userFrom !=1) {
// 			Unopened_conter.style.display = "block";
// 		} else {
// 			Unopened_conter.style.display = "none";
// 		}
	};
	//隐藏弹出
	$scope.cancel = function() {
		$scope.checkWay = 2;
		$scope.userFrom = 1;
		var Unopened_conter = document.querySelector(".Unopened_conter");
		Unopened_conter.style.display = "none";
	};
	
	$scope.checkIsIdentify = function() {
		C2cService.getReviewInfo().then((result) => {
			if(result.data && result.data.length > 0) {
				$scope.userInfo = result.data[0];
			} 
			var pageForm = document.querySelector(".page-form");
			var pageInfo = document.querySelector(".page-info");
			var pageBank = document.querySelector(".page-bank");
			if(result.data && result.data.length > 0) {
				pageForm.style.display = "none";
				pageInfo.style.display = "block";
				pageBank.style.display = "block";
			} else {
				pageForm.style.display = "block";
				pageInfo.style.display = "none";
				pageBank.style.display = "none";
			}
			if($scope.userInfo.check_status == 2) {
				pageForm.style.display = "block";
			}
		});
	};

	$scope.image1 = null;
    $scope.image2 = null;
    $scope.image3 = null;
	$scope.changeImage = function(item) {
		if(item.getAttribute('item_id') == 'file1') {
			if($scope.image1 == item.value || !item.value) {
				return;
			}
            $scope.image1 = item.value;
		}
        if(item.getAttribute('item_id') == 'file2') {
            if($scope.image2 == item.value || !item.value) {
                return;
            }
            $scope.image2 = item.value;
        }
        if(item.getAttribute('item_id') == 'file3') {
            if($scope.image3 == item.value || !item.value) {
                return;
            }
            $scope.image3 = item.value;
        }
        var fileSize = item.files[0].size;
        if(fileSize/1024/1024 > 4) {
            if(item.getAttribute('item_id') == "file1") {
                $scope.file[0]='';
                $scope.imgLimit1=true;
                $scope.$apply();
                return;
            } else if(item.getAttribute('item_id') == "file2") {
                $scope.file[1]='';
                $scope.imgLimit2=true;
                $scope.$apply();
                return;
            } else if(item.getAttribute('item_id') == "file3") {
                $scope.file[2]='';
                $scope.imgLimit3=true;
                $scope.$apply();
                return;
            }
		}
        $http({
			  method:'POST',
			  url: CONFIG.c2cimage+'approve/uploadImage.htm',
			  headers: {
			    'Content-Type': undefined
			  },
			  data: {
			    file:item.files[0]
			  },
			  transformRequest: (data, headersGetter) => {
			    let formData = new FormData();
			    angular.forEach(data, function (value, key) {
			      formData.append(key, value);
			    });
			    return formData;
			   }
			})
			.then((res) => {
                var url = URL.createObjectURL(item.files[0]);
                var template = '<img src="'+url+'" height="100%" >';
                $($(item).parent().parent().find('.file_bod')[0]).html(template);
                var name = $(item).attr("item_id");
				if(res.data.success) {
					if(name == "file1") {
						$scope.file[0] = res.data.data;
                        $scope.imgLimit1=false;
					} else if(name == "file2") {
						$scope.file[1] = res.data.data;
                        $scope.imgLimit2=false;
					} else if(name == "file3") {
						$scope.file[2] = res.data.data;
                        $scope.imgLimit3=false;
					}
				}else{
                    if(name == "file1") {
                        $scope.file[0]='';
                    	$scope.imgLimit1=true;
                    } else if(name == "file2") {
                        $scope.file[1]='';
                        $scope.imgLimit2=true;
                    } else if(name == "file3") {
                        $scope.file[2]='';
                        $scope.imgLimit3=true;
                    }

				}
			},function(err){
            })
			
    } 
	$scope.submitForm = function (isValid) {
		console.log(isValid)
		if(isValid) {
			C2cService.authUserInfo($scope.user_name, $scope.id_card,
					$scope.bank_branch, $scope.bank_account_no,$scope.file,$scope.request_type,$scope.authtoken).then((result) => {
				if(result.success) {
					$scope.init();
				}
			})
		} else {
			// console.log("##############");
		}
		
    };
	
    $scope.init = function () {
        // $scope.defaultShow();
    	$scope.checkIsIdentify();

    };
    $scope.init();
}
})();
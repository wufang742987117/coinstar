(function(){
	'use strict';

  angular
  	.module('app')
		.controller('MobileController', MobileController);

  function MobileController(PrivateService, $scope, $q) {
    $scope.iosGuide = false;
    $scope.iosPictures = [];
    var ios = 'ios';
    var android = 'android';
		(()=>{
      $q.all([PrivateService.getMobileVersion(android),PrivateService.getMobileVersion(ios)] )
      	.then((_)=>{$scope.android = _[0].data;
                    $scope.ios=_[1].data;
                    $scope.qrCode($scope.android.download_url);
                   });

      for(var i=1; i<=19; i++) {
        $scope.iosPictures.push(i.toString());
      }
    })();
	var href = window.location.href;	
	if(href.indexOf('sina=one')!=-1){
		$scope.msg = "您已成功設置了支付密碼，接下來請完成銀行卡的綁定業務。";
	}else if(href.indexOf('sina=tow')!=-1){
		$scope.msg = "接下來您可以進行充值操作了。";
	}else if(href.indexOf('sina=three')!=-1){	
		$scope.msg = "您的充值業務已受理。";	
	}
	
    // function to be recalled during mouse over
		$scope.qrCode = function(url) {
      qrcodelib.toCanvas(document.getElementById('qrcode'), url, {
        color: {
          dark: '#000000'
        },
        scale: 4
      }, (error)=>{
        if(error!=null)
          console.error(error);
      });
    };

    $scope.iosView = function() {
     	$scope.iosGuide = true;
    };
  }
})();

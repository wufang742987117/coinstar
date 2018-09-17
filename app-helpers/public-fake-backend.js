(function () {
	'use strict';

  angular
  	.module('app')
  	.run(setupPublicFakeBackend);
	
    //setupFackBackend for backend-less developement
    function setupPublicFakeBackend($httpBackend) {
	    var baseUrl = "http://192.168.0.211:8091";

        //市场深度
        $httpBackend.whenGET(baseUrl+'/depth').respond(function (method, url, data) {
			var params = angular.fromJson(data);
			if(params.mnem!=undefined){
				return response(1,null,params.result);
			}else{
				return response(1,null,{mnem: "BTCCNY", display: "", state: 0, lotsRatio: 0.000001, ticksRatio: 0});
			}
        });
	    //获得市场
        $httpBackend.whenGET(baseUrl+'/remark').respond(function (method, url, data) {
            var params = angular.fromJson(data);
            if(params!=undefined){
				return response(1,null,params.result);
			}else{
				return response(1,null,{mnem: "BTCCNY", display: "", state: 0, lotsRatio: 0.000001, ticksRatio: 0});
			}
        });

	    //获得某个市场
        $httpBackend.whenGET(baseUrl+'/getRemark').respond(function (method, url, data) {
			var params = angular.fromJson(data);
			return response(1,null,params.result);
        });
	
	    //获得ticker
        $httpBackend.whenGET(baseUrl+'/ticker').respond(function (method, url, data) {
			var params = angular.fromJson(data);
			return response(1,null,params.result);
	    });
	
	    //获得trades
        $httpBackend.whenGET(baseUrl+'/trades').respond(function (method, url, data) {
            var params = angular.fromJson(data);
            return response(1,null,params.result);
	    });
	    //获得candlestick
        $httpBackend.whenGET(baseUrl+'/candlestick').respond(function (method, url, data) {
			var params = angular.fromJson(data);
			return response(1,null,params.result);
        });
	
        function response(success,message,data){
			return [200,  {status: {success: success, message: message}, result: data}];
        }
    }
})();

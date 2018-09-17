;(function () {
	'use strict';
	  angular
	      .module('app').constant('CONFIG', {
	          "private":"http://54.169.70.143/api/private/",
	          "public": "http://54.169.70.143/api/public/",
	          "usertoken": "http://54.169.70.143/api/token/",
	          "authentication": "http://54.169.70.143/api/auth/",
	          "news": "http://54.169.70.143/api/news/",
	          "sinapay": "http://54.169.70.143/api/payment/sina/",
	          "c2c": "http://54.169.70.143/api/c2c/",
	          "c2cimage": "http://54.169.70.143:81/hk_backoffice/"
	      });
})();

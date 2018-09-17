;(function () {
	'use strict';
	  angular
	      .module('app').constant('CONFIG', {
			  "private":"http://18.179.91.59/api/private/",
			  "public": "http://18.179.91.59/api/public/",
			  "usertoken": "http://18.179.91.59/api/token/",
			  "authentication": "http://18.179.91.59/api/auth/",
			  "news": "http://18.179.91.59/api/news/",
			  "sinapay": "http://18.179.91.59/api/payment/sina/",
			  "c2c": "http://18.179.91.59/api/c2c/",
			  "c2cimage": "http://18.179.91.59/hbf/"
      });
})();

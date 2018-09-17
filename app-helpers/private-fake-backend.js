(function () {
	'use strict';

  angular
  	.module('app')
  	.run(setupPrivateFakeBackend);

  // user IP
  var SERVER = "http://192.168.3.168:8090/";

  	// setupFackBackend for backend-less developement
    function setupPrivateFakeBackend(/** $httpBackend, **/ AuthenticationService, $location) {


    // fake authenticate api end point
    console.log($httpBackend);
    $httpBackend.whenGET(SERVER + 'getBalances').respond(function (method, url, data) {
			// get parameters from post request
      var params = angular.fromJson(data);
      console.log("Fakebackend for getBalances says hello");
      // check user credentials and return fake jwt token if valid
      return response(1,null,[ { 'symbol' : 'BTC', balance: 100, frozen: 20 } ]);
    });


    $httpBackend.whenPOST(SERVER + 'modifyEmail').respond(function(method, url, data) {
      // get parameters from post request
      var params = angular.fromJson(data);
      console.log("hello modifyEmail from fake backend")
      // check user credentials and return fake password if valid
      return response(1, null, [{oldEmail: params.oldEmail, newEmail: params.newEmail}]);
    });


    $httpBackend.whenPOST(SERVER + 'modifyPassword').respond(function(method, url, data) {
      // get parameters from post request
      var params = angular.fromJson(data);
      console.log("hello modifypassword from fake backend")
      // check user credentials and return fake password if valid
			return response(1, null, {oldPsw: params.oldPsw, newPsw: params.newPsw});
    });


    $httpBackend.whenPOST(SERVER + 'modifyPhone').respond(function(method, url, data) {
      // get parameters from post request
      var params = angular.fromJson(data);
      console.log("hello modifyPhone from fake backend")
      // check user credentials and return fake password if valid
      return response(1, null, [{oldPhone: params.oldPhone, newPhone: params.newPhone}]);
    });


    $httpBackend.whenPOST('http://127.0.0.1:8080/get').respond(function(method, url, data) {
      var token = "fake-token";
      return response(1,null,{token:token});
    });


    $httpBackend.whenPOST('http://127.0.0.1:8090/register').respond(function(method) {
      console.log("hello from fake-register");
      // do something
    });


    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();

    function response(success,message,data){
      return [200,  {status: {success: success, message: message}, result: data}];
    }
  }
})();

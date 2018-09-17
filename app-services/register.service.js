(function() {
  'use strict';
  angular.module('app').factory('RegisterService', RegisterService);

  RegisterService.$inject = ['$http', 'CONFIG', '$translate'];
  function RegisterService($http, CONFIG, $translate) {
    var service = {};

    var SERVER = CONFIG.authentication;

    service.debug = true;
    service.RegisterPhone = RegisterPhone;
    service.RegisterEmail = RegisterEmail;
    service.ResetPassword = ResetPassword;


    service.askRegister = askRegister;//图片验证方法
    service.askVerification = askVerification;//手机验证码

    service.SERVER = SERVER;

    return service;


    //获取手机验证码
    function askVerification(params) {
      return _post("askVerification", params);
    }

    //获取图形验证码
    function askRegister(params) {
      return _post("askRegister", params);
    }

    function RegisterPhone(mobileNumber, authtoken) {
      return _post("register", {phone: mobileNumber,authtoken: authtoken});
    }


    function RegisterEmail(email, authtoken) {
      return _post("register", {email: email, authtoken: authtoken});
    }

    function ResetPassword(auth_token) {
      return _post('user/reset', {authtoken: auth_token});
    }

		var lan = 'zh';
    function _post(method, params) {
      if(typeof params !== 'undefined') {
				if($translate.use() == 'zh_TW') {
					lan = 'zh';
				}else {
					lan = 'en';
				}
        params.language=lan;
      }
      return $http.post(SERVER + method , params ,{ headers : {}}).then(
        function(res){
          return handleSuccess(res);
        },
        function(res){
          return handleError(res);
        });
		} // end _post

		function _get(method, params){
			return $http.get(SERVER + method , params ,{ headers : {}}).then(
				 function(res){
					 return handleSuccess(res);
				 },
				 function(res){
					 return handleError(res);
				 });
		} // end _get


    // private functions
    function handleSuccess(res) {
      if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
        return { success: true, data: res.data.result};
      else
        return handleError(res);
    } // end handleSuccess

    function handleError(res) {
      if(res.error!=undefined)
        return { success: false, message: res.error };
      return { success: false, message: 'General connection error' };
    } // end handleError

  } // end RegisterService
})();

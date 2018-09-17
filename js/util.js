(function() {
  'use strict';
  angular
    .module('app')
    .service('Util', function() {
      var UtilService = {};
      UtilService.checkPhone = checkPhone;
      UtilService.checkMail = checkMail;
      UtilService.checkCode = checkCode;
      UtilService.convertMil = convertMil;
      UtilService.deconvertNum = deconvertMil;
      UtilService.arrayContainsKeyValue = arrayContainsKeyValue;
      UtilService.checkPassword = checkPassword;
      UtilService.init = init;


		  function init(target){
        Object.keys(target).map((value)=>{value='';});
      }

      function checkPassword(psw) {
        var p = psw;
        var errors = [];
        if (p.length < 8) {
          errors.push("MESSAGE.LENGTH_ERROR");
        }
        if (p.search(/[a-z]/i) < 0) {
          errors.push("MESSAGE.ONE_LETTER");
        }
        if (p.search(/[0-9]/) < 0) {
          errors.push("MESSAGE.ONE_DIGIT");
        }
          return errors;
      }

      function checkPhone(number) {
        var regMobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        return (regMobile.test(number)) ? true : false;
      }


      function checkMail(mail) {
        var regMail = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/;
        return (regMail.test(mail)) ? true : false;
      }

      function checkCode(code) {
        var regCode = /^([0-9]{6}$)/;
        return (regCode.test(code)) ? true : false;
      }

      function convertMil(num) {
        return num * 100000000;
      }

      function deconvertMil(num) {
        return num / 100000000;
      }

      function arrayContainsKeyValue(array, key, value) {
        var match = false;
        array.forEach(function(element) {
          if (String(element[key]) === String(value)) {
            match = true;
          }
        });
        return match;
      }

      return UtilService;
    });
})();

(function() {
  'use strict';
  angular
    .module('app')
    .service('Detect', function() {
      var Detect = {};
      Detect.browser = browser;
      Detect.valid = valid;

      return Detect;

      function valid(object) {
        switch(object.name) {
        case "MSIE":
          return MSIE(object.major_version);
        default:
          return true;
        }

        // specific browser functions
        function MSIE(version) {
          if(version < 9)
          	return false;
          else
            return true;
        }
      }


      function browser() {
        var result = {};
        var objappVersion = navigator.appVersion;
        var objAgent = navigator.userAgent;
        var objbrowserName = navigator.appName;
        var objfullVersion = '' + parseFloat(navigator.appVersion);
        var objBrMajorVersion = parseInt(navigator.appVersion, 10);
        var objOffsetName, objOffsetVersion, ix;

        // In Chrome
        if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
          objbrowserName = "Chrome";
          objfullVersion = objAgent.substring(objOffsetVersion + 7);
        }
        // In Microsoft internet explorer
        else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1) {
          objbrowserName = "Microsoft Internet Explorer";
          objfullVersion = objAgent.substring(objOffsetVersion + 5);
        }

        // In Firefox
        else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
          objbrowserName = "Firefox";
        }
        // In Safari
        else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
          objbrowserName = "Safari";
          objfullVersion = objAgent.substring(objOffsetVersion + 7);
          if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
            objfullVersion = objAgent.substring(objOffsetVersion + 8);
        }
        // For other browser "name/version" is at the end of userAgent
        else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) <
                 (objOffsetVersion = objAgent.lastIndexOf('/'))) {
          objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion);
          objfullVersion = objAgent.substring(objOffsetVersion + 1);
          if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) {
            objbrowserName = navigator.appName;
          }
        }
        // trimming the fullVersion string at semicolon/space if present
        if ((ix = objfullVersion.indexOf(";")) != -1)
          objfullVersion = objfullVersion.substring(0, ix);
        if ((ix = objfullVersion.indexOf(" ")) != -1)
          objfullVersion = objfullVersion.substring(0, ix);

        objBrMajorVersion = parseInt('' + objfullVersion, 10);
        if (isNaN(objBrMajorVersion)) {
          objfullVersion = '' + parseFloat(navigator.appVersion);
          objBrMajorVersion = parseInt(navigator.appVersion, 10);
        }

        result = {
          name: objbrowserName,
          full_version: objfullVersion,
          major_version: objBrMajorVersion,
          nav_appName: navigator.appName,
          nav_userAgent: navigator.userAgent
        };
        return result;
      } // end browser
    });

})();

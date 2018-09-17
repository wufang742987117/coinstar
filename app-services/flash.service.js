(function() {
  'use strict';

  angular
    .module('app')
    .factory('FlashService', FlashService);

  FlashService.$inject = ['$rootScope', 'toastr', '$translate', '$location'];

  function FlashService($rootScope, toastr, $translate, $location) {
    var service = {};

    service.Success = Success;
    service.Error = Error;

    service.Toast = Toast;
    service.ToastError = ToastError;
    service.ToastSuccess = ToastSuccess;
    service.ToastLink = ToastLink;
    service.ToastUpdate = ToastUpdate;
    service.ToastInfo = ToastInfo;

    initService();

    return service;

    function initService() {
      $rootScope.$on('$locationChangeStart', function() {
        clearFlashMessage();
      });

      function clearFlashMessage() {
        var flash = $rootScope.flash;
        if (flash) {
          if (!flash.keepAfterLocationChange) {
            delete $rootScope.flash;
          } else {
            // only keep for a single location change
            flash.keepAfterLocationChange = false;
          }
        }
      }
    }

    function Success(message, keepAfterLocationChange) {
      $rootScope.flash = {
        message: message,
        type: 'success',
        keepAfterLocationChange: keepAfterLocationChange
      };
    }

    function Error(message, keepAfterLocationChange) {
      $rootScope.flash = {
        message: message,
        type: 'error',
        keepAfterLocationChange: keepAfterLocationChange
      };
    }

    /**
     * Show toast message
     *
     * @param {String} message Language key of message
     * @param {String} type Message type: error, success or info. Defalut: info
     * @param {String} url Optional url to redirect
     * @param {Boolean} no_translation Optional flag to disable translation of message
     */
    function Toast( message, type, url, no_translation) {
      if (no_translation) {
          switch (type) {
          case 'success':
            //ToastSuccess(message);
            ToastUpdate(message);
            break;
          case 'error':
            ToastError(message);
            break;
          case 'link':
            ToastLink(message);
            break;
          case 'update':
            ToastUpdate(message);
            break;
          default:
            ToastInfo(message);
          }
          if (url)
            $location.path(url);
      } else {
        $translate(message)
          .then(function(data) {
            Toast(data,type, url, true);
          });
      }
    }

    function ToastSuccess(message) {
      $translate('TOAST.TITLE_SUCCESS')
        .then(function(data) {
          toastr.success(message, data);
        });
    }

    function ToastError(message) {
      $translate('TOAST.TITLE_ERROR')
        .then(function(data) {
          toastr.error(message, data);
        });
    }

    function ToastLink(message) {
      $translate('TOAST.TITLE_INFO')
        .then(function(data) {
          toastr.info(' <a href="#!/trade/btccny">' + message +'</a>', data, {
            allowHtml: true
          });
        });
    }

    function ToastUpdate(message) {
      $translate('TOAST.TITLE_INFO')
      	.then(function(data) {
			toastr.info(message, data);
        });
    }

    function ToastInfo(message) {
      $translate('TOAST.TITLE_INFO')
        .then(function(data) {
          toastr.info(message, data);
        });
    }
  }

})();

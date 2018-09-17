(function () {
  'use strict';

  angular
  	.module('app')
  	.factory('PrintPrice', PrintPrice);

  function PrintPrice() {

    let service = {};

    service.debug = true;
    service.convertMil = convertMil;

    return service;

    // do something with symbol later

    function convertMil(price, symbol) {
      return (price / 100000000).toFixed(2);
    }

  }


})();

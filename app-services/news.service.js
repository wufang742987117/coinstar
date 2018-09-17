(function() {
  'use strict';

  angular
    .module('app')
    .factory('NewsService', NewsService);

  function NewsService($http, CONFIG) {
    let service = {};

    let SERVER = CONFIG.news;

    service.ListArticles = ListArticles;
    service.GetArticle = GetArticle;

    service.SERVER = SERVER;

    return service;

		function ListArticles(topic, language){
      return _get('articles/'+topic+'?language='+language);
    }

    function GetArticle(id) {
      return _get('article/' + id);

    }

		function _get(method, params) {
      return $http.get(SERVER + method).then(
        function(res){
					return handleSuccess(res);
				},
				function(res){
					return handleError(res);
				});
		}

    function handleSuccess(res) {
      if(res.data && res.data.status && res.data.status.success)
        return { success: true, data: res.data.result};
      else
        return handleError(res);
    }

    function handleError(res) {
      if(res.data && res.data.status && res.data.status.message){
        return { success: false, message: res.data.status.message };
      }
      return { success: false, message: 'General connection error' };
    }

  }
})();

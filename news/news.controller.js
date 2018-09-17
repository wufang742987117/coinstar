(function () {
    'use strict';

    angular
        .module('app')
        .controller('NewsListController', NewsListController)
        .controller('NewsDetailController', NewsDetailController)
		.controller('NewsMoreController', NewsMoreController)
		.controller('NoticeMoreController', NoticeMoreController)
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .filter('formatDate', function($filter) {
            return function(time) {
                var today = new Date($filter('date')(new Date(), 'yyyy-MM-dd 00:00:00')).getTime();
                var t = new Date(time).getTime();
                if(t >= today) {
                    return $filter('date')(t, 'HH:mm', 'UTC');
                } else {
                    return $filter('date')(t, 'yyyy-MM-dd', 'UTC');
                }
            }
        });

    function NewsListController($scope, NewsService, $location) {

        $scope.param = {
            newslist: [],
            noticeslist: [],
            newcount: 10,
            noticecount: 10
        };
        (function init() {
            $('body,html').animate({
                scrollTop: 0
            }, 300);
            queryNewsList('NEWS', 'zh', $scope.param.newcount);
            queryNoticeList('NOTICE', 'zh', $scope.param.noticecount);
        })();

        //查询新闻列表
        function queryNewsList(topic, language, count) {
            NewsService.ListArticles(topic, language, count)
                .then(function (response) {
                    if (response.success) {
                        $scope.param.newslist = response.data.data;
                    }
                });
        }

        //查询公告列表
        function queryNoticeList(topic, language, count) {
            NewsService.ListArticles(topic, language, count)
                .then(function (response) {
                    if (response.success) {
                        $scope.param.noticeslist = response.data.data;
                    }
                });
        }


        //点击更多
        $scope.newsMore = function (type) {
            if (type == 'news') {
                $scope.param.newcount = $scope.param.newcount + 10;
                queryNewsList('NEWS', 'zh', $scope.param.newcount);
            } else {
                $scope.param.noticecount = $scope.param.noticecount + 10;
                queryNoticeList('NOTICE', 'zh', $scope.param.noticecount);
            }
        }

        $scope.getDetailUrl = function (id) {
            $location.path('/news/detail/' + id);

        }

    }

    function NewsDetailController($scope, $stateParams, NewsService) {

        $scope.id = $stateParams.id;
        $scope.params = {};

        $scope.init = function () {
            $('body,html').animate({
                scrollTop: 0
            }, 300);
            NewsService.GetArticle($scope.id).then(function (res) {
                console.log(res.data)
                $scope.params = res.data[0];
            }, function (res) {
                console.log(res.message);
            })
        }
        $scope.init();
    }
	
	function NewsMoreController($scope, NewsService, $location) {
		NewsService.ListArticles('NEWS', 'zh', 10)
		.then(function (response) {
			if (response.success) {
				$scope.newslist = response.data.data;
			}
		});
		$scope.newsDetail = function(id) {
			$location.path('/news/detail/' + id);
		}
	}
	
	function NoticeMoreController($scope, NewsService, $location) {
		NewsService.ListArticles('NOTICE', 'zh', 10)
			.then(function (response) {
			if (response.success) {
				$scope.noticeslist = response.data.data;
			}
		});
		
		$scope.noticeDetail = function(id) {
			$location.path('/news/detail/' + id);
		}
			
	}


})();

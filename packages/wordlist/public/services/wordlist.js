'use strict';

angular.module('mean.wordlist').factory('Word', ['$resource',
    function($resource) {
		return $resource('mywords/:myWordId', {
			myWordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}/*,
			meaning: {
				method: 'GET',
				url: '/DictService/Define',
				transformResponse : function(data, headersGetter){
					return angular.fromJson(data);
				}
			}*/
		});
	}
]);

angular.module('mean.wordlist').factory('DictService', ['$resource',
    function($resource) {
		return $resource('/DictService/Define');
	}
]);

angular.module('mean.wordlist').factory('WordAppSettings', ['$resource',
    function($resource) {
		return {
			CTRL_MSG_DISP_DURS:3000,
			WORDLIST_MAX_FETCH:2000
		};
	}
]);

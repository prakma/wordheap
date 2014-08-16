'use strict';

angular.module('mean.wordlist').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('words_main_page', {
            url: '/wordlist/main',
            templateUrl: 'wordlist/views/index.html'
        });
    }
]);

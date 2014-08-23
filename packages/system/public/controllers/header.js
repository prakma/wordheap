'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', '$rootScope', '$window', '$location', 'Global', 'Menus',
    function($scope, $rootScope, $window, $location, Global, Menus) {
        $scope.global = Global;
        $scope.menus = {};

        // Default hard coded menu items for main menu
        var defaultMainMenu = [];

        // Query menus added by modules. Only returns menus that user is allowed to see.
        function queryMenu(name, defaultMenu) {

            Menus.query({
                name: name,
                defaultMenu: defaultMenu
            }, function(menu) {
                $scope.menus[name] = menu;
            });
        }

        // Query server for menus and check permissions
        queryMenu('main', defaultMainMenu);

        $scope.isCollapsed = false;

        $rootScope.$on('loggedin', function() {

            queryMenu('main', defaultMainMenu);

            $scope.global = {
                authenticated: !! $rootScope.user,
                user: $rootScope.user
            };
        });

        $rootScope.$on('$viewContentLoaded', function(event) {
            $window.__gaTracker('send', 'pageview', {
                'page' : $location.path(),
                'hitCallback': function() {
                    console.log('ga pageview data sent for ',$location.path(),$window.document.title);
                }
            });
        });

    }
]);

angular.module('mean.wordlist').
filter('fromNow', function() {
    return function(dateObj) {
        return moment(dateObj).fromNow();
    };
});
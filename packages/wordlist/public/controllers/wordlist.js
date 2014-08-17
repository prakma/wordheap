'use strict';

angular.module('mean.wordlist').controller('WordlistController', ['$scope', 'Global', 'Word', 'DictService', '$modal', '$timeout', '$state','$filter','$window', 'WordAppSettings',
    function($scope, Global, Word, DictService, $modal, $timeout, $state, $filter, $window, WordAppSettings) {
    	var myWordCount = 0;
        var paginationWordIndex = 0;
        var WORDS_IN_A_ROW = 2;
        $scope.global = Global;
        $scope.c = '';
        $scope.newExample = 'bah';
        

        function fetchWordList() {
        	$scope.wordlistMax = Word.query(function(){
	        	myWordCount = $scope.wordlistMax.length || 0;
                $scope.wordFilterChange();
	        });
        }

        fetchWordList();

        $scope.wordFilterChange = function(){
            // get words matching this filter
            $scope.wordlistFilter = $filter('filter')($scope.wordlistMax, $scope.q);

            // reset pagination
            paginationWordIndex = 0;

            // set the scope with words that should be visible as per pagination
            $scope.wordlistOnPage = $scope.wordlistFilter.slice(paginationWordIndex, paginationWordIndex + WORDS_IN_A_ROW);

        };


        $scope.paginate = function(isOlder){

            $timeout(function(){
                if(isOlder === true){
                    if(paginationWordIndex === myWordCount) return;
                    ++paginationWordIndex;
                } else {
                    if(paginationWordIndex === 0) return;
                    --paginationWordIndex;
                }
                $scope.wordlistOnPage = $scope.wordlistFilter.slice(paginationWordIndex, paginationWordIndex + WORDS_IN_A_ROW);
            }, 300);
            
            //console.log('current pagination is at',paginationWordIndex, 'out of', myWordCount);
        };

        $scope.addNewWord = function(){
        	var newWord = new Word();
        	newWord.word = $scope.q;
        	newWord.serial = ++myWordCount;
        	newWord.$save(function(){
        		$scope.q = '';
	        	$scope.c = 'New word added in your list !';
                fetchWordList();
	        	$timeout(function(){
	        		$scope.c = '';
	        		$scope.q = '';
	        		//$state.go('recent_words_page');
	        	},WordAppSettings.CTRL_MSG_DISP_DURS) ;
        	});
        };

        $scope.showMeaning = function(selectedWord){
            $scope.selectedWord = selectedWord;
            //console.log(selectedWord);
            DictService.get({word: selectedWord.word}, function(meaning){
                $scope.selectedWord.tmeaning = meaning;
            });
            // selectedWord.$meaning({word:selectedWord.word},function(wordMeaning){
            //     console.log('meaning method invoked - ', wordMeaning);
            //     console.log('selected word', selectedWord);
            //     //selectedWord.tmeaning = wordMeaning;kkjhjkkjhj

            //     $scope.selectedMeaning = $filter('json')(wordMeaning);
            // });
            //console.log('selected text is ',$window.getSelection().toString());
            $modal.open({
                  templateUrl: 'meaningModalContent.html',
                  resolve: {
                    items: function () {
                        DictService.get({word: selectedWord.word}, function(meaning){
                            $scope.selectedWord.tmeaning = meaning;
                        });
                    }
                  },
                  scope: $scope
                });

        };

        $scope.setMeaning = function(selectedWord){
            $scope.selectedWord = selectedWord;
            if($window.getSelection()){
                $scope.selectedWord.content = $window.getSelection().toString();
            }
            
        };

        $scope.saveMeaning = function(selectedWord){
            console.log(' save meaing called. ', selectedWord.content);
            $scope.selectedWord = selectedWord;
            selectedWord.$update(function(){
                console.log('meaing updated');
                $scope.c = ' Meaning saved ! ';
                $timeout(function(){
                    $scope.c = '';
                },WordAppSettings.CTRL_MSG_DISP_DURS) ;

            });

        };

        $scope.saveExample = function(selectedWord){
            console.log(' save example called. ', selectedWord.tNewExample);
            $scope.selectedWord = selectedWord;
            if(selectedWord.tNewExample === undefined || 
                /[\w.]+/.test(selectedWord.tNewExample) === false) {
                return;
            }
            $scope.selectedWord.examples.push(selectedWord.tNewExample);
            selectedWord.tNewExample = '';
            selectedWord.$update(function(){
                $scope.c = ' Example saved ! ';
                $timeout(function(){
                    $scope.c = '';
                },WordAppSettings.CTRL_MSG_DISP_DURS) ;

            });
        };
    }
]);

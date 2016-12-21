var app = angular.module('chatApp',['ui.router', 'firebase', 'LocalStorageModule']);



app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', function($scope, $firebaseArray, $rootScope, $state, localStorageService){
    var ref = firebase.database().ref();

    var info = localStorageService.get('_INFOUSER');

    if(!info.username){
        $state.go('login');
        return;
    }

    $scope.username = info.username;

    function init (){
        $scope.items = $firebaseArray(ref);    
    }
    
    $scope.addMessage = function(){
        if(!$scope.newText) return false;
        var data = {
            username: $scope.username,
            text: $scope.newText,
            posteddate: Date.now()
        };
        $scope.items.$add(data);
        $scope.newText = '';
    };
    
    init();
}]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue)
                {
                    console.log(element[0].scrollTop = element[0].scrollHeight);
                    element[0].scrollTop = element[0].scrollHeight;
                }
            });
        }
    }
});







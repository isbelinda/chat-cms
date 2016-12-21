var app = angular.module('chatApp',['firebase']);

app.controller('chatController',['$scope', '$firebaseArray', function($scope, $firebaseArray){
    var ref = firebase.database().ref();
    
    function init (){
        $scope.items = $firebaseArray(ref);    
    }
    
    $scope.addMessage = function(){
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







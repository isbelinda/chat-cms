var app = angular.module('chatApp',['ui.router', 'firebase', 'LocalStorageModule']);

app.constant('CONFIG', {

});

app.constant('FIREBASE_CONFIG', {
    apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
    authDomain: "fir-webchat-31ebc.firebaseapp.com",
    databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
    storageBucket: "fir-webchat-31ebc.appspot.com",
    messagingSenderId: "588615177650"
});

app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', function($scope, $firebaseArray, localStorageService){
    var info = localStorageService.get('_INFOUSER');
    var getInfoRoom = firebase.database().ref('chatroom').child('mixhotel');

    var queryRooms = getInfoRoom.orderByChild('timeStamp');

    if(!info.username){
        $state.go('login');
        return;
    }

    function init() {
        $scope.username = info.username;
        $scope.rooms = $firebaseArray(queryRooms);
        console.log($scope.rooms);
    }

    $scope.removeRoom = function(id){
        $scope.rooms.$remove(id);
    };

    $scope.createRoom = function(){
        var newRoom = {
            roomName: 'testhotel',
            createdDate: Date.now(),
            timeStamp: Date.now()
        };

        $scope.rooms.$add(newRoom)
    };

    init();
}]);

app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject){
    console.log($stateParams.id);

    var info = localStorageService.get('_INFOUSER');
    var getMessages = firebase.database().ref('chatroom').child('mixhotel').child($stateParams.id);

    $scope.infoRoom = $firebaseObject(getMessages);

    if(!info.username){
        $state.go('login');
        return;
    }

    $scope.username = info.username;

    function init (){
        var msgSync = getMessages.child('chatMessage');
        $scope.items = $firebaseArray(msgSync);
    }

    $scope.addMessage = function(){
        if(!$scope.newText) return false;

        $scope.infoRoom.timeStamp = Date.now();
        var data = {
            username: $scope.username,
            text: $scope.newText,
            postedDate: Date.now()
        };

        $scope.infoRoom.$save().then(function(){
            $scope.items.$add(data);
        }).catch(function(error){
            console.log('error', error)
        });

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

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});







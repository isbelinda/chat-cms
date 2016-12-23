app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('login',{
            url: '/',
            templateUrl: 'views/login.html'
        })
        .state('rooms', {
            url: '/chatRooms',
            templateUrl: 'views/chatRooms.html',
            controller: 'chatRoomsController'
        })
        .state('rooms.chat',{
            url: '/chat/:id',
            templateUrl: 'views/chat.html',
            controller: 'chatController'
        })
}]);

app.run(['$state', '$rootScope', 'localStorageService', 'FIREBASE_CONFIG', function ($state, $rootScope, localStorageService, FIREBASE_CONFIG) {
    // Initialize Firebase
    var config = FIREBASE_CONFIG;
    
    firebase.initializeApp(config);
    
    $rootScope.login = function(data){
        console.log(data);
        if(data){
            var info = {
                username: data.username,
                hotel: data.hotelId
            };
        
            localStorageService.set('_INFOUSER', info);
            $state.go('rooms');
        }
    }
}]);
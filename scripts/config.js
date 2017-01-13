app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('login',{
            url: '/',
            templateUrl: 'views/login.html',
            controller: `mainController`
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

app.run(['$state', '$rootScope', 'localStorageService', 'FIREBASE_CONFIG', '$firebaseAuth', 'apiService', function ($state, $rootScope, localStorageService, FIREBASE_CONFIG, $firebaseAuth, apiService) {
    // Initialize Firebase
    const config = FIREBASE_CONFIG;

    firebase.initializeApp(config);
}]);

// ADD AUTHORIZATION IN HEADER FOR GET API
app.factory('oauthHttpInterceptor', ['localStorageService', function (localStorageService) {
    return {
        request: function (config) {
            if (config.headers.Accept.indexOf('json') > -1)
                config.headers['Authorization_user'] = localStorageService.get('_TOKEN');

            console.log(config);
            return config;
        }
    };
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('oauthHttpInterceptor');
});
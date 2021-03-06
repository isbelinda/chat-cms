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
    
        .state('admin', {
            url: '/admin',
            abstract: true,
            templateUrl: 'views/admin/layout.html',
            controller: 'mainAdminController'
        })

        .state('admin.user', {
            url: '/user',
            templateUrl: 'views/admin/index.html',
            controller: 'adminController'
        })
}]);

app.run(['$state', '$rootScope', 'localStorageService', 'FIREBASE_CONFIG', '$firebaseAuth', 'apiService', function ($state, $rootScope, localStorageService, FIREBASE_CONFIG, $firebaseAuth, apiService) {
    // Initialize Firebase
    const config = FIREBASE_CONFIG;

    firebase.initializeApp(config);

    $rootScope.signOut = () => {
        console.log(`log out`);
        const info = localStorageService.get('_INFOUSER');
        let oldId = window.location.hash.split('#!/chatRooms/chat/')[1]
        let roomChat = `${info.roomPath + oldId}/status`;
        const getRoomSelect = firebase.database().ref(roomChat);

        getRoomSelect.update({
            is_admin_chatting: false
        });
        localStorageService.clearAll();
        $state.go('login');
    }
}]);

// ADD AUTHORIZATION IN HEADER FOR GET API
app.factory('oauthHttpInterceptor', ['localStorageService', function (localStorageService) {
    return {
        request: function (config) {
            if (config.headers.Accept.indexOf('json') > -1)
                config.headers['authorization_cms'] = localStorageService.get('_TOKEN');
                // config.headers['Authorization_user'] = localStorageService.get('_TOKEN');

            // console.log(config);
            return config;
        }
    };
}]);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('oauthHttpInterceptor');
});
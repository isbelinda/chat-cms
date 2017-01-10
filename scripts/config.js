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

app.run(['$state', '$rootScope', 'localStorageService', 'FIREBASE_CONFIG', '$firebaseAuth', function ($state, $rootScope, localStorageService, FIREBASE_CONFIG, $firebaseAuth) {
    // Initialize Firebase
    const config = FIREBASE_CONFIG;

    // const auth = firebase.auth();
    
    firebase.initializeApp(config);
    
    $rootScope.login = function(data){
        // console.log(data);
        if(data){
            var info = {
                username: data.username,
                businessId: data.hotelId
            };

            // const infoUser = {
            //     email: `bow@socket9.com`,
            //     password: `belinda123`
            // };

            // auth.signInWithEmailAndPassword(infoUser.email, infoUser.password)
            //     .then(() => {
            //         var user = auth.currentUser;
            //         console.log(user);
            //
            //         localStorageService.set('_INFOUSER', info);
            //         $state.go('rooms');
            //     })
            //     .catch(function(error) {
            //         console.log(error);
            // });

            localStorageService.set('_INFOUSER', info);
            $state.go('rooms');
        }
    };
}]);
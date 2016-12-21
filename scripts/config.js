app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('login',{
            url: '/',
            templateUrl: 'views/login.html'
        })
        .state('chat',{
            url: '/chat',
            templateUrl: 'views/chat.html',
            controller: 'chatController'
        })
}]);

app.run(['$state', '$rootScope', 'localStorageService', function ($state, $rootScope, localStorageService) {
    $rootScope.login = function(user){
        if(user){
            var info = {
                username: user
            };

            localStorageService.set('_INFOUSER', info);
            $state.go('chat');
        }
    }
}]);
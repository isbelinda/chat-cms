app.controller('mainController', [`$scope`, `apiService`, `$state`, `localStorageService`, `$sce`, function ($scope, apiService, $state, localStorageService, $sce) {
    $scope.login = (data) => {
        apiService.user.login(data, (res) => {
            console.log(res);
            if(res.isSuccess){
                let info;

                if(res.results.roleId === 2){
                    info = {
                        userId: res.results.userId,
                        username: res.results.username,
                        roomCategoryId: res.results.siteId || res.results.siteId,
                        roomCategoryName: res.results.hotelName,
                        token: res.results.token,
                        token_fcm: res.results.token_fcm,
                        roomPath: res.roomPath
                    };
                    $state.go('rooms');
                } else {
                    info = {
                        userId: res.results.userId,
                        username: res.results.username,
                        token: res.results.token
                    };
                    $state.go('admin.user');
                }

                localStorageService.set('_INFOUSER', info);
                localStorageService.set('_TOKEN', res.results.token);
            } else {
                $scope.errMessage = `<i class="fa fa-times" aria-hidden="true"></i> This is user can not login. Please contact admin.`;
            }
            // if(res.isSuccess && res.results.roleId === 2){
            //     let info = {
            //         userId: res.results.userId,
            //         username: res.results.username,
            //         roomCategoryId: res.results.siteId || res.results.siteId,
            //         roomCategoryName: res.results.hotelName,
            //         token: res.results.token,
            //         token_fcm: res.results.token_fcm,
            //         roomPath: res.roomPath
            //     };
            //
            //     localStorageService.set('_INFOUSER', info);
            //     localStorageService.set('_TOKEN', res.results.token);
            //     $state.go('rooms');
            // } else {
            //     $scope.errMessage = `<i class="fa fa-times" aria-hidden="true"></i> This user not admin.`;
            // }
        })
    };

    const messaging = firebase.messaging();

    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
            messaging.getToken()
                .then(function(currentToken) {
                    console.log(currentToken);
                    if (currentToken) {
                        localStorageService.set('TOKEN_FCM', currentToken)
                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify. ', err);
        });

    messaging.onMessage(function(payload) {
        console.log('Message received.', payload);

    });


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
                    // console.log(element[0].scrollTop = element[0].scrollHeight);
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

app.filter('checkSite', function(SITE) {
    return function(id){
        if(!id) return "-";
        let getSite = SITE.filter((n) => n.id == id);
        return getSite[0].name;
    }
});

app.filter('checkHotel', function(SITE) {
    return function(id){
        if(!id) return "-";
        let getSite = SITE.filter((n) => n.id == id);
        return getSite[0].name;
    }
});

app.filter('filterLastedDate', function() {
    return function(items) {
        return items.sort((a, b) => b.status.update_date - a.status.update_date)
    }
})
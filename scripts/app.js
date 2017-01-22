var app = angular.module('chatApp',['ui.router', 'ngResource', 'firebase', 'LocalStorageModule', 'ngSanitize']);

app.constant('CONFIG', {
    // DATE_NOW: new Date().toISOString(),
    // DATE_NOW: Date.now(),
    DATE_NOW: firebase.database.ServerValue.TIMESTAMP,
    PATH_FIREBASE: `chatRooms/`,
    // PATH_API: `http://localhost:3001/api`,
    // PATH_API: `http://localhost:3004/api`,
    // PATH_API: `http://api2.handigothailand.com/api`,
    PATH_API: `https://apichat.herokuapp.com/api`,
    ROLE_CHAT: 1 // Mark user
});

// app.constant('FIREBASE_CONFIG', {
//     apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
//     authDomain: "fir-webchat-31ebc.firebaseapp.com",
//     databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
//     storageBucket: "fir-webchat-31ebc.appspot.com",
//     messagingSenderId: "588615177650"
// });

app.constant('FIREBASE_CONFIG', {
    apiKey: "AIzaSyAFAOy5FbbMdcCduxMZ1qJDeGjabOI_MBc",
    authDomain: "handigo-437c3.firebaseapp.com",
    databaseURL: "https://handigo-437c3.firebaseio.com",
    storageBucket: "handigo-437c3.appspot.com",
    messagingSenderId: "507994112278"
});


app.controller('mainController', [`$scope`, `apiService`, `$state`, `localStorageService`, `$sce`, function ($scope, apiService, $state, localStorageService, $sce) {
    $scope.login = (data) => {
        apiService.user.login(data, (res) => {
            console.log(res);
            if(res.isSuccess && res.results.roleId === 2){
                let info = {
                    userId: res.results.userId,
                    username: res.results.username,
                    roomCategoryId: res.results.hotelId,
                    roomCategoryName: res.results.hotelName,
                    token: res.results.token,
                    token_fcm: res.results.token_fcm
                };

                localStorageService.set('_INFOUSER', info);
                localStorageService.set('_TOKEN', res.results.token);
                $state.go('rooms');
            } else {
                $scope.errMessage = `<i class="fa fa-times" aria-hidden="true"></i> This user not admin.`;
            }
        })
    };

    
}]);

app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', 'CONFIG', '$firebaseObject', '$state', '$firebaseAuth', 'apiService', function($scope, $firebaseArray, localStorageService, CONFIG, $firebaseObject, $state, $firebaseAuth, apiService){
    const info = localStorageService.get('_INFOUSER');
    const getInfoRoom = firebase.database().ref(CONFIG.PATH_FIREBASE + info.roomCategoryId);
    const queryRooms = getInfoRoom.orderByChild('timeStamp');
    const messaging = firebase.messaging();

    if(!info.username){
        $state.go('login');
        return;
    }

    const init = () => {
        $scope.username = info.username;
        $scope.rooms = $firebaseArray(queryRooms);
    };

    $scope.goChatRoom = function(data){
        // console.log(data);
        const getRoomSelect = firebase.database().ref(`${CONFIG.PATH_FIREBASE}/${info.roomCategoryId}/${data.$id}/admin`);

        getRoomSelect.update({
            unReadMessage: 0
        });

        $state.go('rooms.chat', {id: data.$id});
    };

    const getTokenMessaging = () => {
        console.log(`get token`);
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        messaging.getToken()
            .then(function(currentToken) {
                console.log(currentToken);
                if (currentToken) {
                    console.log('update');
                    updateToken(currentToken);
                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            })
            .catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);
            });
    };

    const updateToken = (token) => {
        apiService.user.updateToken({ token_fcm: token}, (res) => {
            if(res.isSuccess){
                console.log(`update token success`);
            }
        });
    };

    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
            getTokenMessaging();
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify. ', err);
        });

    messaging.onMessage(function(payload) {
        console.log('Message received.', payload);

    });

    init();
}]);

app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', 'CONFIG', 'apiService', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject, CONFIG, apiService){
    const info = localStorageService.get('_INFOUSER');
    const getPath = firebase.database().ref(CONFIG.PATH_FIREBASE + info.roomCategoryId);
    const getMessages = getPath.child($stateParams.id);

    $scope.infoRoom = $firebaseObject(getMessages);

    if(!info.username){
        $state.go('login');
        return;
    }

    $scope.username = info.username;

    function init (){
        const msgSync = getMessages.child('chatMessage');
        $scope.items = $firebaseArray(msgSync);

        $scope.items.$loaded(() => {
            console.log(`loaded`);
        });
    }

    $scope.addMessage = () => {
        if(!$scope.newText) return false;
        
        const dataMessage = {
            notification: {
                body: $scope.newText
            },
            userId: $stateParams.id
        };
        
        const data = {
            username: $scope.username,
            text: $scope.newText,
            postedDate: CONFIG.DATE_NOW,
            role: CONFIG.ROLE_CHAT
        };
        
        // console.log(dataMessage);

        $scope.infoRoom.$save().then(() => {
            $scope.items.$add(data);
            apiService.user.sendMessage(dataMessage, (res) => {
                console.log(res);
                if(res.isSuccess){

                } else {
                    console.log(res.message);
                }
            });
        }).catch((error) => {
            console.log('error', error)
        });

        getMessages.update({
            timeStamp: CONFIG.DATE_NOW,
            unReadMessage: ($scope.infoRoom.unReadMessage || 0) + 1
        });

        getMessages.child(`admin`).update({
            unReadMessage: 0
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


// curl -X POST -H "Authorization: key=AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o" -H "Content-Type: application/json" -d '{
// "notification": {
//     "title": "Portugal vs. Denmark",
//         "body": "5 to 1",
//         "click_action": "http://localhost:6010"
// },
// "to": "ADDl5SHpBaUqM9Nz1gQcPwVjqnNM1n85kT3zd1atyBPpdaa_eHpTLSk4Iz7cL4slr-hg5SzFiWvcWOBKAClPIEhrqeSQzswhRCOXwK1zsWaHQXfNY3_YsRToreDXa4vb9NerJz0cVAjoQcvcCTAoQxEbir54ChD5mDHhaMyNwZuo6TFCtcCt1_PUJcClzL7AU6RXAm5RU814EW-cVyTuDYLrhrljJQCEMw"
// }' "https://fcm.googleapis.com/fcm/send"

//
// curl -X POST --header "Authorization: key=AAAAiQwy1bI:APA91bFsiMmjaWhVj6-uWFFMTo-2_ra70fjn1Gyuufzi7F3HXIqWl6VMTvRKJuGV21M6O2MF60NpzXKBc0mlvLIcR5kK3RNU990KLKaCTUJMHqGsORtyM2C07A6YzEn1BqVwGWRAdHmlj5eja9JoIx3MB9VX7JBAFw" \
// --Header "Content-Type: application/json" \
// https://fcm.googleapis.com/fcm/send \
//     -d "{\"to\":\"d4ol-GDihLw:APA91bG0mjbmZmXrpg0p6sBhXvs5CEKittshNvg3vXnJ7FVh4ZdYKoqkRQiM-X6yr_PQrxVGVG9XTzqgX_vr-pg6Bq_2OVn6Mm5xa2H6b1HDOvh7K1Z6avSDf_k5XnWqhjB0W5g99zHX\",\"notification\":{\"body\":\"Yellow\"},\"priority\":10}"

// curl -X POST -H "Authorization: key=AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o" -H "Content-Type: application/json" -d '{
// "to": "d4ol-GDihLw:APA91bG0mjbmZmXrpg0p6sBhXvs5CEKittshNvg3vXnJ7FVh4ZdYKoqkRQiM-X6yr_PQrxVGVG9XTzqgX_vr-pg6Bq_2OVn6Mm5xa2H6b1HDOvh7K1Z6avSDf_k5XnWqhjB0W5g99zHX"
// }' "https://fcm.googleapis.com/fcm/send"

// curl --header "Authorization: key=AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o" \
// --header Content-Type:"application/json" \
// https://fcm.googleapis.com/fcm/send \
//     -d "{\"registration_ids\":[\"ABC\"]}"


// "Messaging: Please change your web app manifest's 'gcm_sender_id' value to '103953800507' to use Firebase messaging. (messaging/incorrect-gcm-sender-id)."

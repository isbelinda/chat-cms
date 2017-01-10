var app = angular.module('chatApp',['ui.router', 'firebase', 'LocalStorageModule']);

app.constant('CONFIG', {
    // DATE_NOW: new Date().toISOString(),
    // DATE_NOW: Date.now(),
    DATE_NOW: firebase.database.ServerValue.TIMESTAMP,
    PATH_FIREBASE: `chatRooms/Socket9Hotel/`
});

app.constant('FIREBASE_CONFIG', {
    apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
    authDomain: "fir-webchat-31ebc.firebaseapp.com",
    databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
    storageBucket: "fir-webchat-31ebc.appspot.com",
    messagingSenderId: "588615177650"
});

app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', 'CONFIG', '$firebaseObject', '$state', '$firebaseAuth', function($scope, $firebaseArray, localStorageService, CONFIG, $firebaseObject, $state, $firebaseAuth){
    const info = localStorageService.get('_INFOUSER');
    const getInfoRoom = firebase.database().ref(CONFIG.PATH_FIREBASE);
    const queryRooms = getInfoRoom.orderByChild('timeStamp');
    const messaging = firebase.messaging();

    if(!info.username){
        $state.go('login');
        return;
    }

    const init = () => {
        $scope.username = info.username;
        $scope.rooms = $firebaseArray(queryRooms);
        // console.log($scope.rooms);

        // messaging.getToken()
        //     .then(function(refreshedToken) {
        //         console.log(refreshedToken);
        //         console.log('Token get.');
        //         // Indicate that the new Instance ID token has not yet been sent to the
        //         // app server.
        //         // setTokenSentToServer(false);
        //         // // Send Instance ID token to app server.
        //         // sendTokenToServer(refreshedToken);
        //         // ...
        //     })
        //     .catch(function(err) {
        //         console.log('Unable to retrieve refreshed token ', err);
        //         // showToken('Unable to retrieve refreshed token ', err);
        //     });

    };

    $scope.goChatRoom = function(data){
        // console.log(data);
        const getRoomSelect = firebase.database().ref(CONFIG.PATH_FIREBASE + data.roomName + '/admin');

        getRoomSelect.update({
            unReadMessage: 0
        });

        $state.go('rooms.chat', {id: data.$id});
    };



    // $scope.showToken = () => {
    //     // Get Instance ID token. Initially this makes a network call, once retrieved
    //     // subsequent calls to getToken will return from cache.
    //     messaging.getToken()
    //         .then(function(currentToken) {
    //             if (currentToken) {
    //                 console.log("currentToken", currentToken);
    //                 $scope.token = currentToken;
    //             } else {
    //                 // Show permission request.
    //                 console.log('No Instance ID token available. Request permission to generate one.');
    //
    //             }
    //         })
    //         .catch(function(err) {
    //             console.log('An error occurred while retrieving token. ', err);
    //         });
    // }

    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
            // TODO(developer): Retrieve a Instance ID token for use with FCM.
            // ...
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify. ', err);
        });

    messaging.onMessage(function(payload) {
        console.log('Message received.', payload);
        let notificationTitle = 'New message';
        const notificationOptions = {
            body: `You have new message.`,
            icon: 'contents/images/icons/icon.png',
            badge: 'contents/images/icons/icon.png'
        };

        // if(event.data) {
        //     notificationTitle = 'Received Payload';
        //     notificationOptions.body = payload;
        // }

        // const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);
        // payload.waitUntil(notificationPromise);

    });

    init();
}]);

app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', 'CONFIG', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject, CONFIG){
    const info = localStorageService.get('_INFOUSER');
    const getPath = firebase.database().ref(CONFIG.PATH_FIREBASE);
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

        const data = {
            username: $scope.username,
            text: $scope.newText,
            postedDate: CONFIG.DATE_NOW
        };

        $scope.infoRoom.$save().then(() => {
            $scope.items.$add(data);
        }).catch((error) => {
            console.log('error', error)
        });

        getMessages.update({
            timeStamp: CONFIG.DATE_NOW,
            unReadMessage: ($scope.infoRoom.unReadMessage || 0) + 1
        });

        // updateCountMsg.transaction(function(currentValue) {
        //     return (currentValue || 0) + 1;
        // });

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

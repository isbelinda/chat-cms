// var app = angular.module('chatApp',['ui.router', 'ngResource', 'firebase', 'LocalStorageModule', 'ngSanitize']);

// app.constant('CONFIG', {
//     // DATE_NOW: new Date().toISOString(),
//     // DATE_NOW: Date.now(),
//     DATE_NOW: firebase.database.ServerValue.TIMESTAMP,
//     PATH_FIREBASE: `chatRooms/`,
//     // PATH_API: `http://localhost:3001/api`,
//     // PATH_API: `http://localhost:3004/api`,
//     PATH_API: `https://livechatapi.handigothailand.com/api`,
//     // PATH_API: `https://apichat.herokuapp.com/api`,
//     ROLE_CHAT: 1 // Mark user
// });

// // app.constant('FIREBASE_CONFIG', {
// //     apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
// //     authDomain: "fir-webchat-31ebc.firebaseapp.com",
// //     databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
// //     storageBucket: "fir-webchat-31ebc.appspot.com",
// //     messagingSenderId: "588615177650"
// // });

// app.constant('FIREBASE_CONFIG', {
//     apiKey: "AIzaSyAFAOy5FbbMdcCduxMZ1qJDeGjabOI_MBc",
//     authDomain: "handigo-437c3.firebaseapp.com",
//     databaseURL: "https://handigo-437c3.firebaseio.com",
//     storageBucket: "handigo-437c3.appspot.com",
//     messagingSenderId: "507994112278"
// });


// app.controller('mainController', [`$scope`, `apiService`, `$state`, `localStorageService`, `$sce`, function ($scope, apiService, $state, localStorageService, $sce) {
//     $scope.login = (data) => {
//         apiService.user.login(data, (res) => {
//             console.log(res);
//             if(res.isSuccess && res.results.roleId === 2){
//                 let info = {
//                     userId: res.results.userId,
//                     username: res.results.username,
//                     roomCategoryId: res.results.siteId || res.results.siteId,
//                     roomCategoryName: res.results.hotelName,
//                     token: res.results.token,
//                     token_fcm: res.results.token_fcm,
//                     roomPath: res.roomPath
//                 };

//                 localStorageService.set('_INFOUSER', info);
//                 localStorageService.set('_TOKEN', res.results.token);
//                 $state.go('rooms');
//             } else {
//                 $scope.errMessage = `<i class="fa fa-times" aria-hidden="true"></i> This user not admin.`;
//             }
//         })
//     };

//     const messaging = firebase.messaging();

//     messaging.requestPermission()
//         .then(function() {
//             console.log('Notification permission granted.');
//             messaging.getToken()
//                 .then(function(currentToken) {
//                     console.log(currentToken);
//                     if (currentToken) {
//                         localStorageService.set('TOKEN_FCM', currentToken)
//                     } else {
//                         // Show permission request.
//                         console.log('No Instance ID token available. Request permission to generate one.');
//                     }
//                 })
//                 .catch(function(err) {
//                     console.log('An error occurred while retrieving token. ', err);
//                 });
//         })
//         .catch(function(err) {
//             console.log('Unable to get permission to notify. ', err);
//         });

//     messaging.onMessage(function(payload) {
//         console.log('Message received.', payload);
    
//     });

    
// }]);

// app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', 'CONFIG', '$firebaseObject', '$state', '$firebaseAuth', 'apiService', function($scope, $firebaseArray, localStorageService, CONFIG, $firebaseObject, $state, $firebaseAuth, apiService){
//     const info = localStorageService.get('_INFOUSER');

//     if(!info){
//         $state.go('login');
//     }

//     const getInfoRoom = firebase.database().ref(info.roomPath);
//     const queryRooms = getInfoRoom.orderByChild('timeStamp');
    
//     if(!info.username){
//         $state.go('login');
//         return;
//     }

//     const init = () => {
//         $scope.username = info.username;
//         $scope.rooms = $firebaseArray(queryRooms);
//         updateToken(localStorageService.get('TOKEN_FCM'));
//     };

//     $scope.goChatRoom = function(data){
//         // console.log(data);
//         let roomChat = `${info.roomPath + data.$id}/admin`;
//         const getRoomSelect = firebase.database().ref(roomChat);

//         getRoomSelect.update({
//             unReadMessage: 0
//         });

//         $state.go('rooms.chat', {id: data.$id});
//     };

//     const updateToken = (token) => {
//         apiService.user.updateToken({ token_fcm: token}, (res) => {
//             console.log(res)
//             if(res.isSuccess){
//                 console.log(`update token success`);
//             }
//         });
//     };

//     init();
// }]);

// app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', 'CONFIG', 'apiService', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject, CONFIG, apiService){
//     const info = localStorageService.get('_INFOUSER');
//     const getPath = firebase.database().ref(info.roomPath);
//     const getMessages = getPath.child($stateParams.id);

//     $scope.infoRoom = $firebaseObject(getMessages);
    
//     if(!info.username){
//         $state.go('login');
//         return;
//     }

//     $scope.username = info.username;
//     $scope.roleChat = CONFIG.ROLE_CHAT;

//     function init (){
//         const msgSync = getMessages.child('chatMessage');
//         $scope.items = $firebaseArray(msgSync);
//         console.log('test chat');

//         $scope.items.$loaded(() => {
//             console.log(`loaded`);
//         });
//     }

//     $scope.addMessage = () => {
//         if(!$scope.newText) return false;
        
//         const dataMessage = {
//             notification: {
//                 body: $scope.newText
//             },
//             deviceId: $stateParams.id
//         };
        
//         const data = {
//             username: $scope.username,
//             text: $scope.newText,
//             postedDate: CONFIG.DATE_NOW,
//             role: CONFIG.ROLE_CHAT
//         };
        
//         console.log(dataMessage);
//         console.log('test chat controller');

//         $scope.infoRoom.$save().then(() => {
//             $scope.items.$add(data);
//             apiService.user.sendMessage(dataMessage, (res) => {
//                 console.log(res);
//             });
//         }).catch((error) => {
//             console.log('error', error)
//         });

//         getMessages.update({
//             timeStamp: CONFIG.DATE_NOW,
//             unReadMessage: ($scope.infoRoom.unReadMessage || 0) + 1
//         });

//         getMessages.child(`admin`).update({
//             unReadMessage: 0
//         });

//         $scope.newText = '';

//     };
    
//     init();
// }]);

// app.directive('myEnter', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//             if(event.which === 13) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.myEnter);
//                 });

//                 event.preventDefault();
//             }
//         });
//     };
// });

// app.directive('scrollBottom', function () {
//     return {
//         scope: {
//             scrollBottom: "="
//         },
//         link: function (scope, element) {
//             scope.$watchCollection('scrollBottom', function (newValue) {
//                 if (newValue)
//                 {
//                     // console.log(element[0].scrollTop = element[0].scrollHeight);
//                     element[0].scrollTop = element[0].scrollHeight;
//                 }
//             });
//         }
//     }
// });

// app.filter('reverse', function() {
//     return function(items) {
//         return items.slice().reverse();
//     };
// });


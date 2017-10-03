var app = angular.module('chatApp',['ui.router', 'ngResource', 'firebase', 'LocalStorageModule', 'ngSanitize']);

app.constant('CONFIG', {
    // DATE_NOW: new Date().toISOString(),
    // DATE_NOW: Date.now(),
    DATE_NOW: firebase.database.ServerValue.TIMESTAMP,
    PATH_FIREBASE: `chatRooms/`,
    // PATH_API: `http://localhost:3004/api`,
    PATH_API: `https://livechatapi.handigo.run/api`,
    // PATH_API: `https://apichat.herokuapp.com/api`,
    ROLE_CHAT: 1, // Mark user
    PATH_HANDIGO: `http://localhost:3001/api`
});

// app.constant('FIREBASE_CONFIG', {
//     apiKey: "AIzaSyBRccipNzuLK6veZgpAQPOIUEZAu8Mpy5o",
//     authDomain: "fir-webchat-31ebc.firebaseapp.com",
//     databaseURL: "https://fir-webchat-31ebc.firebaseio.com",
//     storageBucket: "fir-webchat-31ebc.appspot.com",
//     messagingSenderId: "588615177650"
// });

// app.constant('FIREBASE_CONFIG', {
//     apiKey: "AIzaSyAFAOy5FbbMdcCduxMZ1qJDeGjabOI_MBc",
//     authDomain: "handigo-437c3.firebaseapp.com",
//     databaseURL: "https://handigo-437c3.firebaseio.com",
//     storageBucket: "handigo-437c3.appspot.com",
//     messagingSenderId: "507994112278"
// });

app.constant('FIREBASE_CONFIG', {
    apiKey: "AIzaSyAGFW0AlijqMgTASQ3nICPTMsvRsGGEx5A",
    authDomain: "handigov2.firebaseapp.com",
    databaseURL: "https://handigov2.firebaseio.com",
    projectId: "handigov2",
    storageBucket: "handigov2.appspot.com",
    messagingSenderId: "362680386470"
});

app.constant('SITE', [
    { id: 1, name: "HandiGo" },
    { id: 2, name: "NaviGo" }
]);

app.constant('ROLE', [
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" }
]);


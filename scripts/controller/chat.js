app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', 'CONFIG', '$firebaseObject', '$state', '$firebaseAuth', 'apiService', function($scope, $firebaseArray, localStorageService, CONFIG, $firebaseObject, $state, $firebaseAuth, apiService){
    const info = localStorageService.get('_INFOUSER');

    if(!info){
        $state.go('login');
    }

    const getInfoRoom = firebase.database().ref(info.roomPath);
    const queryRooms = getInfoRoom.orderByChild('timeStamp');

    if(!info.username){
        $state.go('login');
        return;
    }

    const init = () => {
        $scope.username = info.username;
        $scope.rooms = $firebaseArray(queryRooms);
        updateToken(localStorageService.get('TOKEN_FCM'));
    };

    $scope.goChatRoom = function(data){
        // console.log(data);
        let roomChat = `${info.roomPath + data.$id}/admin`;
        const getRoomSelect = firebase.database().ref(roomChat);

        getRoomSelect.update({
            unReadMessage: 0
        });

        $state.go('rooms.chat', {id: data.$id});
    };

    const updateToken = (token) => {
        apiService.user.updateToken({ token_fcm: token}, (res) => {
            console.log(res)
            if(res.isSuccess){
                console.log(`update token success`);
            }
        });
    };

    init();
}]);

app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', 'CONFIG', 'apiService', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject, CONFIG, apiService){
    const info = localStorageService.get('_INFOUSER');
    const getPath = firebase.database().ref(info.roomPath);
    const getMessages = getPath.child($stateParams.id);

    $scope.infoRoom = $firebaseObject(getMessages);

    if(!info.username){
        $state.go('login');
        return;
    }

    $scope.username = info.username;
    $scope.roleChat = CONFIG.ROLE_CHAT;

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
            deviceId: $stateParams.id
        };

        const data = {
            username: $scope.username,
            text: $scope.newText,
            postedDate: CONFIG.DATE_NOW,
            role: CONFIG.ROLE_CHAT
        };

        console.log(dataMessage);
        console.log('test chat controller');

        $scope.infoRoom.$save().then(() => {
            $scope.items.$add(data);
            apiService.user.sendMessage(dataMessage, (res) => {
                console.log(res);
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
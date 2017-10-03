app.controller('chatRoomsController', ['$scope', '$firebaseArray', 'localStorageService', 'CONFIG', '$firebaseObject', '$state', '$firebaseAuth', 'apiService', '$stateParams', function($scope, $firebaseArray, localStorageService, CONFIG, $firebaseObject, $state, $firebaseAuth, apiService, $stateParams){
    const info = localStorageService.get('_INFOUSER');

    if(!info){
        $state.go('login');
    }

    const getInfoRoom = firebase.database().ref(info.roomPath);
    //const queryRooms = getInfoRoom.orderByChild('timeStamp');

    if(!info.username){
        $state.go('login');
        return;
    }

    const init = () => {
        $scope.username = info.username;
        $scope.rooms = $firebaseArray(getInfoRoom);
        updateToken(localStorageService.get('TOKEN_FCM'));
    };

    $scope.goChatRoom = function(data){
        let oldId = window.location.hash.split('#!/chatRooms/chat/')[1]

        if(oldId && oldId !== data.$id) {
            let roomChat = `${info.roomPath + oldId}/status`;
            console.log(roomChat)
            const getRoomSelect = firebase.database().ref(roomChat);
    
            getRoomSelect.update({
                is_admin_chatting: false
            });
        }
        
        let roomChat = `${info.roomPath + data.$id}/status`;
        const getRoomSelect = firebase.database().ref(roomChat);

        getRoomSelect.update({
            is_admin_chatting: true,
            unread_admin_count: 0
        });

        $state.go('rooms.chat', {id: data.$id});
    };

    const updateToken = (token) => {
        apiService.user.updateToken({ token_fcm: token}, (res) => {
            //console.log(res)
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
        const msgSync = getMessages.child('chat');
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
            chat: $scope.newText,
            create_date: CONFIG.DATE_NOW,
            is_admin: true
        };

        $scope.infoRoom.$save().then(() => {
            $scope.items.$add(data);
            // apiService.user.sendMessage(dataMessage, (res) => {
            //     console.log(res);
            // });
        }).catch((error) => {
            console.log('error', error)
        });

        getMessages.child(`status`).update({
            unread_user_count: $scope.infoRoom.status.unread_user_count + 1
        });

        $scope.newText = '';

    };

    init();
}]);
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
        let getRoomBefore = $scope.rooms.filter(i => i.$id === oldId)[0]
        if(getRoomBefore && oldId && oldId !== data.$id) {
            let roomChat = `${info.roomPath + oldId}/status`;
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

app.controller('chatController',['$scope', '$firebaseArray', '$rootScope', '$state', 'localStorageService', '$stateParams', '$firebaseObject', 'CONFIG', 'apiService', '$http', function($scope, $firebaseArray, $rootScope, $state, localStorageService, $stateParams, $firebaseObject, CONFIG, apiService, $http){
    const info = localStorageService.get('_INFOUSER');
    const getPath = firebase.database().ref(info.roomPath);
    const getMessages = getPath.child($stateParams.id);
    let isAutoTranslate = localStorageService.get('_isAutoTranslate')

    $scope.infoRoom = $firebaseObject(getMessages);
    $scope.autoTranslate = isAutoTranslate? isAutoTranslate: false
    let translateMessage = undefined;
    $scope.isLoading = false;

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
            console.log($scope.items.length)
        });
    }

    $scope.getTranslate = item => {
        if(!item.newTranslate) {
            $http.post(`${CONFIG.PATH_TRANSLATE}/translate`, { message: item.chat })
            .then(res => {
                if(res.data.Status === 200) {
                    angular.forEach($scope.items, function(value, key) {
                        if(value.$id === item.$id) {
                            value.newTranslate = res.data.data.message
                        }
                    })
                }
            })
        }
    }

    $scope.getAutoTranslate = item => {
        localStorageService.set('_isAutoTranslate', item)
    }

    $scope.addMessage = () => {
        if(!$scope.newText) return false;
        let message = $scope.newText
        $scope.isLoading = true;
        const dataMessage = {
            notification: {
                body: message
            },
            deviceId: $stateParams.id
        };

        let data = {};

        $scope.infoRoom.$loaded()
            .then((data) => {
                console.log(data.chat)
                if(data.chat) {
                    if(localStorageService.get('_isAutoTranslate')) {
                        let chatUser = $scope.items.filter(i => !i.is_admin)
                        let chatUserLasted = chatUser[chatUser.length - 1]
                        $http.post(`${CONFIG.PATH_TRANSLATE}/GetCodeLanguage`, { message: chatUserLasted.chat })
                            .then(response => {
                                if(response.data.Status === 200) {
                                    $http.post(`${CONFIG.PATH_TRANSLATE}/translate`, { message: message, lang: response.data.data.code })
                                    .then(res => {
                                        if(res.data.Status === 200) {
                                            data = {
                                                chat: res.data.data.message,
                                                chat_original: message,
                                                create_date: CONFIG.DATE_NOW,
                                                is_admin: true
                                            };
                                            updateMessage(data)
                                        }
                                    })
                                }
                            })
                        
                    } else {
                        data = {
                            chat: message,
                            create_date: CONFIG.DATE_NOW,
                            is_admin: true
                        }
                        updateMessage(data)
                    }
                } else {
                    alert('This room is expire.')
                    $state.go('rooms')
                    return false
                }
            })        
    };

    function updateMessage(data) {
        $scope.isLoading = false;
        $scope.infoRoom.$save().then(() => {
            $scope.items.$add(data);
            // apiService.user.sendMessage(dataMessage, (res) => {
            //     console.log(res);
            // });
        }).catch((error) => {
            console.log('error', error)
        });

        getMessages.child(`status`).update({
            unread_user_count: $scope.infoRoom.status.unread_user_count + 1,
            update_date: Date.now()
        });

        $scope.newText = '';
    }

    init();
}]);

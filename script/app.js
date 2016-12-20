var app = angular.module('chatApp',['firebase']);

app.controller('chatController',['$scope', function($scope){
    var URL_API = 'https://fir-webchat-31ebc.firebaseio.com/';
    var myFirebase = new Firebase(URL_API);
    $scope.send = function(){
        $scope.data.timeStamp = new Date();
        console.log($scope.data);
        myFirebase.push($scope.data);
        
        $scope.data.text = '';
    };

    /** Function to add a data listener **/
    function startListening(){
        myFirebase.on('child_added', function(snapshot) {
            var msg = snapshot.val();

            console.log(msg);

//            var msgUsernameElement = document.createElement("b");
//            msgUsernameElement.textContent = msg.username;
//
//            var msgTextElement = document.createElement("p");
//            msgTextElement.textContent = msg.text;
//
//            var msgElement = document.createElement("div");
//            msgElement.appendChild(msgUsernameElement);
//            msgElement.appendChild(msgTextElement);
//
//            msgElement.className = "msg";
//            document.getElementById("results").appendChild(msgElement);
            displayChatMessage(msg.username, msg.text);
        });
    };

    function displayChatMessage(name, text) {
        var msgUsernameElement = document.createElement("b");
        msgUsernameElement.textContent = name;

        var msgTextElement = document.createElement("p");
        msgTextElement.textContent = text;

        var msgElement = document.createElement("div");
        msgElement.appendChild(msgUsernameElement);
        msgElement.appendChild(msgTextElement);

        msgElement.className = "msg";
        document.getElementById("results").appendChild(msgElement);
//        document.getElementById("results").append(msgElement);
//        $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#results'));
//        $('#results')[0].scrollTop = $('#results')[0].scrollHeight;
    };

    // Begin listening for data
    startListening();

}]);







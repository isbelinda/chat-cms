var app = angular.module('chatApp',['firebase']);

app.controller('chatController',['$scope', function($scope){
    $scope.text = 'test';
    console.log($scope.text);

    var myFirebase = new Firebase('https://fir-webchat-31ebc.firebaseio.com/');
    var usernameInput = document.querySelector('#username');
    var textInput = document.querySelector('#text');
    var postButton = document.querySelector('#post');

    postButton.addEventListener("click", function() {
        var msgUser = usernameInput.value;
        var msgText = textInput.value;
        var date = new Date();
        // Push text
        myFirebase.push({
            username: msgUser,
            text: msgText,
            timeStamp: date
        });
        textInput.value = "";
    });

    /** Function to add a data listener **/
    var startListening = function() {
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



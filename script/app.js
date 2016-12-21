var app = angular.module('chatApp',['firebase']);

app.controller('chatController',['$scope', '$firebaseArray', function($scope, $firebaseArray){
    var ref = firebase.database().ref();
    
    function init (){
        $scope.items = $firebaseArray(ref);    
    }
    
    $scope.addMessage = function(){
        var data = {
            username: $scope.username,
            text: $scope.newText,
            posteddate: Date.now()
        };
        $scope.items.$add(data);
        $scope.newText = '';
    };
    
    init();
    
    
//     var URL_API = 'https://fir-webchat-31ebc.firebaseio.com/';
//     var myFirebase = new Firebase(URL_API);
//     var sync = $firebase(myFirebase);
//
//     $scope.send = function(){
//         var data = {
//             username: $scope.data.username,
//             text: $scope.data.text,
//             posteddate: Date.now()
//         };
//         console.log(data);
//         myFirebase.push(data);
//        
//         $scope.data.text = '';
//     };
//
//     /** Function to add a data listener **/
//     function startListening(){
//         myFirebase.on('child_added', function(snapshot) {
//             var msg = snapshot.val();
//            
// //            var msgUsernameElement = document.createElement("b");
// //            msgUsernameElement.textContent = msg.username;
// //
// //            var msgTextElement = document.createElement("p");
// //            msgTextElement.textContent = msg.text;
// //
// //            var msgElement = document.createElement("div");
// //            msgElement.appendChild(msgUsernameElement);
// //            msgElement.appendChild(msgTextElement);
// //
// //            msgElement.className = "msg";
// //            document.getElementById("results").appendChild(msgElement);
//             displayChatMessage(msg.username, msg.text);
//         });
//     };
//
//     function displayChatMessage(name, text) {
//         var msgUsernameElement = document.createElement("b");
//         msgUsernameElement.textContent = name;
//
//         var msgTextElement = document.createElement("p");
//         msgTextElement.textContent = text;
//
//         var msgElement = document.createElement("div");
//         msgElement.appendChild(msgUsernameElement);
//         msgElement.appendChild(msgTextElement);
//
//         msgElement.className = "msg";
//         document.getElementById("results").appendChild(msgElement);
// //        document.getElementById("results").append(msgElement);
// //        $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#results'));
// //        $('#results')[0].scrollTop = $('#results')[0].scrollHeight;
//     };
//
//     // Begin listening for data
//     startListening();

}]);

app.directive('scrollBottom', function () {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue)
                {
                    element[0].scrollTop = element[0].scrollHeight;
                }
            });
        }
    }
})







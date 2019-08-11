"use strict";




// Store user nick in browser memory
var userNickInfo = document.getElementById('userNickInfo');
//var setNickButton = document.getElementById('setNickButton');

if (!localStorage.getItem('userNick')) {
    userNickInfo.textContent = "Welcome on chat room! Please set your nick by clicking button below, we will save it in your browser memory";
    createButtonToSetNick();
    setNickButton.onclick = function () {
        setUserNick();    
    };
}
else {
    var storedNick = localStorage.getItem('userNick');
    userNickInfo.textContent = 'Hello ' + storedNick;
}


function setUserNick() {
    var userNick = prompt('Please enter your nick.');
    localStorage.setItem('userNick', userNick);
    userNickInfo.textContent = 'Hello ' + userNick;
    document.getElementById('setNickButton').style.display = "none";
}

function createButtonToSetNick() {
    var setNickButton = document.createElement('button');
    setNickButton.innerHTML = 'Set your nick';
    setNickButton.setAttribute('id', 'setNickButton');
    document.getElementById('setNickButtonArea').appendChild(setNickButton);
}











// SignalR 
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = storedNick; //document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
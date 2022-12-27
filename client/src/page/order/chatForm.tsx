const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');

function appendMessage(message){
    if (message != null && message != ''){
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageContainer.append(messageElement);
    }
}
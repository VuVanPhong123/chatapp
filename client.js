const inputField = document.getElementById('userName');
const saveButton = document.getElementById('nameButton');
const userNameField = document.getElementById('userNameField');
const inputTextField = document.getElementById('message');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');
const chatContent= document.getElementById("chat")

let userName = 'NO NAME USER';

if (localStorage.getItem('userName')) {
    userName = localStorage.getItem('userName');
    userNameField.textContent = `name: ${userName}`;
}



saveButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    const name = inputField.value.trim();
    if (name !== '') {
        userName = name;
        localStorage.setItem('userName', userName);
    }
    userNameField.textContent = `name: ${userName}`;
    inputField.value = '';
});

sendButton.addEventListener('click', (event) => {
    event.preventDefault(); 

    const message = inputTextField.value.trim();
    if (!message) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const payload = {
        time: `${time} ${day}/${month}`,
        name: userName,
        message: message
    };

    ws.send(JSON.stringify(payload));
    inputTextField.value = '';
});


fetch('chat.json')
    .then(response => response.json())
    .then(jsonArray => {
        chatContent.innerHTML = jsonArray.join('<br>');
    })
    .catch(err => console.error('Error loading chat.json:', err));


const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log(' Connected to WebSocket server.');
};

ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const messageElement = document.createElement('p');
    messageElement.textContent = `[${msg.time}] ${msg.name}: ${msg.message}`;
    messagesDiv.appendChild(messageElement);
};

ws.onclose = () => {
    console.log(' Disconnected from server.');
};

ws.onerror = (err) => {
    console.error('Error:', err);
};


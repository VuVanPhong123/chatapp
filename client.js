const inputField = document.getElementById('userName');
const saveButton = document.getElementById('nameButton');
const userNameField = document.getElementById('userNameField');
const inputTextField = document.getElementById('message');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');
let chatContent ='';


let userName = 'NO NAME USER';
let ws;
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

sendButton.addEventListener('click', () => {

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
        chatContent = jsonArray.join('<br>');
        ws = new WebSocket('ws://localhost:8080');
        connect();
    })
    .catch(err => console.error('Error loading chat.json:', err));

async function connect() {
    let myPromise = new Promise(function(resolve, reject) {
        
        ws.onopen = function() {
            resolve(chatContent);
        };
        
        ws.onerror = function() {
            reject("Cannot connect to WebSocket");
        };
        
    });

    try {
        const result = await myPromise;
        document.getElementById("chat").innerHTML = result;
    } catch (error) {
        document.getElementById("chat").innerHTML = error;
        document.getElementById("chat").style.color = "red";
    }
}


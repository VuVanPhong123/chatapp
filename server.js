const WebSocket = require('ws');
const fs = require('fs');
const wss = new WebSocket.Server({ port: 8080 });

const logFile = 'chat.json';

fs.writeFileSync(logFile, JSON.stringify([], null, 2), 'utf-8');
console.log(' chat.json cleared on startup.');

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const logLine = `[${data.time}] ${data.name}: ${data.message}`;
            console.log(logLine);

            let logs = [];
            if (fs.existsSync(logFile)) {
                logs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
            }
            logs.push(logLine);
            fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf-8');

        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
});

console.log(' WebSocket server running on ws://localhost:8080');

import {webSocketServer} from './index.js';
import {Router} from 'express';

export const router = Router();

let count = 0;
let connectionCount = 0;

// An express route for /api/count.
router.get("/count", function(req, res) {
    res.json(count);
});

// Handle WebSocket connections
webSocketServer.on('connection', (webSocket, req) => {
    // Assign an id to keep track of WebSockets for logging purposes
    webSocket.id = ++connectionCount;

    console.log('Incoming WebSocket connection', webSocket.id);
    webSocket.send(JSON.stringify({command: 'setCount', value: count}));

    // Handle incoming messages on this WebSocket connection
    webSocket.on('message', (data) => {
        data = JSON.parse(data);
        console.log('Incoming WebSocket data', data, 'from', webSocket.id);
        if (data.command === 'incrCount') {
            count++;
            webSocketServer.clients.forEach(function each(client) {
                // Send the new count to everybody, except the connection we received the count from.
                if (client !== webSocket && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({command: 'setCount', value: count}));
                }
            });
        } else {
            console.log("Invalid command", data);
        }
    });
});

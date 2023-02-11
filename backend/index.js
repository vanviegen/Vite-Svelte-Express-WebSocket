import {WebSocketServer} from 'ws';
import * as HTTP from 'http';
import * as Vite from 'vite';
import {default as Express} from 'express';
import {svelte} from '@sveltejs/vite-plugin-svelte';

// Read host and port from environment variables.
const host = process.env.HOST || '0.0.0.0';
const port = (0|process.env.PORT) || 3000;

// Create a web server.
const httpServer = HTTP.createServer();

// Create a WebSocket /api server, and attach it to the web server.
export const webSocketServer = new WebSocketServer({noServer: true});
httpServer.on('upgrade', function(req, socket, head) {
	if (req.url === '/api') {
		webSocketServer.handleUpgrade(req, socket, head, (ws) => {
			webSocketServer.emit('connection', ws, req)
		});
	}
});

async function start() {
	// Import api.js after creating webSocketServer, so that the API may use it.
	const API = await import('./api.js');

	// Create an express app, and attach it to the web server.
	const app = Express();
	httpServer.on('request', app);

	// Attach the /api router to the express app.
	app.use('/api', API.router);

	// Configure express to use Vite with the Svelte plugin.
	app.use((await Vite.createServer({
		logLevel: 'info',
		server: {
			middlewareMode: true,
			hmr: {server: httpServer}
		},
		plugins: [
			svelte(),
		],
		appType: 'spa',
	})).middlewares);

	// Bind the web server to a TCP port.
	httpServer.listen(port, host, () => {
		console.log(`Running at http://${host}:${port}`);
	});
}

start();

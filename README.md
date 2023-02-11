# Vite + Svelte + Express + WebSocket

Template for using Vite, Svelte (not SvelteKit), hot module replacement (HMR), Express and WebSocket (for backend APIs), all served through a HTTP server running on a single port. This makes it easier to expose your development environment on a public address using something like `ngrok`.

How to use:

- Start the server using `npm start`. Defaults to listening on `0.0.0.0:3000`, but this can be overridden by the `HOST` and `PORT` environment variables.
- The backend entry point is in `backend/api.js`. It provides some examples to get you started with REST and WebSocket. The server automatically restarts when any changes are made in `backend/`.
- The `frontend/` directory contains a the default Svelte template, modified such that the counter is synchronized across all connected browsers.

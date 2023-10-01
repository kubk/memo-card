
## Contributing

This project consists of two applications: the frontend and backend, both of which are written in TypeScript. The backend is built using Cloudflare functions.

### Why Cloudflare

Cloudflare Pages is a good choice to build a Telegram Mini App.
- Domain names for both frontend and backend with SSL enabled.
- Automatic CI/CD; a simple `git push` deploys both the frontend and backend.
- 100,000 free requests per day.
- A per-function [logging UI](https://developers.cloudflare.com/pages/platform/functions/debugging-and-logging/)

### Running locally
- Obtain your API key from [BotFather](https://core.telegram.org/bots/tutorial)
- Install dependencies using `npm i`
- Copy the API environment file: `cp .dev.vars.example .dev.vars`. This file is used by Cloudflare workers for local development. You can learn more about it [here](https://developers.cloudflare.com/workers/configuration/environment-variables/).
- Update the `BOT_TOKEN` environment variable to match your API key. 
- Run Cloudflare functions with `npm run dev:api:start`
- Copy the frontend environment file: `cp .env .env.local`. 
- Expose your backend and enable SSL: `npm run dev:api:tunnel`
- Update the `VITE_API_URL` to point frontend to the new domain you received from serveo.net.
- Start the frontend project with `npm run dev:frontend:start`
- Expose your frontend and enable SSL using: `npm run dev:frontend:tunnel`.
- Tell the BotFather to update settings: go to Bot Settings -> Menu Button -> Edit Menu Button URL, and enter the domain you obtained earlier.

### On localhost exposing
There are multiple methods to expose your project with SSL enabled, and you're not limited to any particular one. Serveo.net is used here merely as an example. Alternatives include: 
- [ngrok](https://ngrok.com/), which is paid if you need more than 1 stable domain name.
- [localtunnel](https://localtunnel.github.io/www/) which is free but doesn't have stable domains.
- You can also generate your own certificates with [mkcert](https://github.com/FiloSottile/mkcert) as described [here](https://roj1512.medium.com/developing-web-apps-locally-6b8ccbd5c742).

### Deploy
Deployment is automated upon `git push` once you connect your repository to the Cloudflare dashboard. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Workers & Pages -> Overview -> select the Pages tab -> click Connect to Git.

### Telegram validation

The data received via the Mini App [must be validated](https://core.telegram.org/bots/webapps#testing-mini-apps) to prevent unauthorized access.
In this application the implementation is based on [Web Crypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/). Cloudflare Workers operate in a unique environment that isn't exactly a browser, but it's also not a traditional server-side setting like Node.js. They run on Cloudflare's edge network, and their execution environment resembles that of a web browser's Service Worker. That's why we should use Web Crypto API to validate data received via the Mini App

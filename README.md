<p align="center">
<img width="600" alt="Screenshot 2023-10-13 at 19 41 35" src="https://github.com/kubk/memo-card/assets/22447849/7f754776-3e57-4669-becc-410e1b285199"></p>

<p align="center">
  Available in: <a href="./README.md">English</a>, <a href="./README.ru.md">Русский</a>, <a href="./README.ua.md">Українська</a>
</p>

People tend to forget things. Within an hour, up to 60% of new information can slip away, and by the end of a week, only about 10% may remain. However, consistent revisiting the information combats this decline. This bot uses the proven flashcard method, assisting users in retaining and mastering languages, history, and more.

Website: [memocard.org](https://memocard.org)

About: https://teletype.in/@alteregor/memocard-telegram-contest-win 

## Example use cases
- You're a tourist in a new country and want to acquire basic knowledge of the foreign language. 
- You're a developer looking to recall complex bash commands or programming constructs more effectively.
- You're medical student aiming to memorize all the Latin names of muscles.
- You're keen on improving your geography skills, aiming to memorize countries, capitals, major cities, mountains, rivers, and other geographical facts.
- You're studying music and want to practice the harmony.
- You're delving into history and want to retain key historical facts.
- You're an English teacher who wants to share your decks with your students.

## How it differs from other apps

While there are free applications like Anki available, they come with platform limitations and feature gaps:
- Anki doesn't offer a direct approach for users to privately share decks with friends or colleagues outside of its public shared decks feature. Moreover, sharing a deck demands a switch between the desktop and web versions of Anki. With the Memo Card bot, users can effortlessly share decks directly within Telegram.
- For additional functionality in Anki, users must install plugins, which are limited only to the desktop version. In contrast, the Memo Card bot is accessible on Mac, Windows, iOS, Android, and web versions of Telegram.
- Anki lacks automatic push notifications to alert users of upcoming reviews. It is easy to solve with Telegram push notifications

## For Developers

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
- Start the frontend project with `npm run dev:frontend:start`
- In order to expose your frontend and API to the internet and provide SSL you can use [ngrok](https://ngrok.com). After signing up you'll get 1 free stable domain. Grab it [here](https://dashboard.ngrok.com/cloud-edge/domains) and run `ngrok http --domain=<your_domain>.ngrok-free.app 5173`   
- Tell the BotFather to update settings: go to Bot Settings -> Menu Button -> Edit Menu Button URL, and enter the domain you obtained earlier.

Once you've completed these steps, it's enough to run `npm run dev:api:start`, `npm run dev:frontend:start` and `ngrok` to spin up the local version of the bot.

### Deploy
Deployment is automated upon `git push` once you connect your repository to the Cloudflare dashboard. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Workers & Pages -> Overview -> select the Pages tab -> click Connect to Git.

In the Cloudflare panel, add environment variables BOT_TOKEN, SUPABASE_KEY, and SUPABASE_URL.

### Database
The project uses [Supabase](https://supabase.com/) as its primary data storage. It's a cloud relational database with a UI and a JavaScript client for API communication. Under the hood, it utilizes PostgreSQL, which means you can leverage all of its features.

To set up the database do these steps:

- Register at [supabase.com](https://supabase.com/dashboard/projects), add a project
- Copy `SUPABASE_KEY` and `SUPABASE_URL` from the project settings
- For local development, paste `SUPABASE_KEY` and `SUPABASE_URL` into `.dev.vars`
- For production, add these environment variables in the Cloudflare dashboard.
- To familiarize yourself with supabase, it's recommended to read [the official guide](https://supabase.com/docs/guides/database/overview).

### Telegram validation

The data received via the Mini App [must be validated](https://core.telegram.org/bots/webapps#testing-mini-apps) to prevent unauthorized access.
In this application the implementation is based on [Web Crypto API](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/). Cloudflare Workers operate in a unique environment that isn't exactly a browser, but it's also not a traditional server-side setting like Node.js. They run on Cloudflare's edge network, and their execution environment resembles that of a web browser's Service Worker. That's why we should use Web Crypto API to validate data received via the Mini App. In this application, the user’s data is [passed via HTTP headers](https://github.com/kubk/memo-card/blob/main/src/lib/request/request.ts#L17) and is [validated](https://github.com/kubk/memo-card/blob/main/functions/lib/telegram/validate-telegram-request.ts#L26) on each API request.

### Telegram webhook

To set up the bot to respond to user messages in chat, configure the webhook:

- Dev: `curl "https://api.telegram.org/bot<DEV_BOT_TOKEN>/setWebhook?url=<ngrok_domain>/api/bot?token=DEV_BOT_TOKEN"`
- Prod: `curl "https://api.telegram.org/bot<PROD_BOT_TOKEN>/setWebhook?url=<prod_domain>/bot?token=PROD_BOT_TOKEN"`
 
Note that for the production environment, the endpoint is `/bot?token=`, while for development it's `/api/bot?token=` due to the proxy server configured for development via the Vite configuration.

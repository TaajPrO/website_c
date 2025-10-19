# ChatGPT-style Single-Page App + OpenRouter proxy

This project is a minimal single-page chatbot UI (React via CDN + Tailwind Play CDN) and a tiny Express server
that proxies requests to the OpenRouter API so you don't expose your API key in the browser.

## Quick start (after unzip)

1. Copy `.env.example` to `.env` and set your OpenRouter API key:
   ```
   cp .env.example .env
   # edit .env and replace OPENROUTER_API_KEY with your key
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## Notes

- The client sends conversation messages to the server at `/api/chat`. The server forwards them to OpenRouter:
  `https://openrouter.ai/api/v1/chat/completions`.
- Default model: `openrouter/auto`. Change `OPENROUTER_MODEL` in `.env` if you want another model available via OpenRouter.
- This setup is intentionally small and dependency-light (no build step). It uses React and Babel in the browser via CDN for convenience.

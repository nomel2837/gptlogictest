# GPTLogic API (Vercel-ready) - Structure B (modular)

This project is a Node.js reimplementation of the FastAPI example you provided.
It keeps the same endpoints, parameters, response format and the 30-day history logic,
but forwards GPT requests to **chatgpt4online.org** and obtains the required nonce by scraping the chat page (using `cheerio`) — matching the scraping approach you provided.

## Structure (modular)
```
project/
├─ src/
│  ├─ utils/
│  │   ├─ scrapeNonce.js
│  │   ├─ randomIP.js
│  │   └─ chatRequest.js
│  └─ history/
│      └─ history.js
├─ api/
│  ├─ gptlogic.js
│  └─ gptlogic-history.js
├─ chat_history.json
├─ package.json
└─ README.md
```

## Endpoints (same as original)
- `GET /api/gptlogic?logic=<logic>&p=<prompt>`
  - sends prompt to chatgpt4online (messages is empty for parity with original)
- `GET /api/gptlogic-history?user_id=<id>&logic=<logic>&p=<prompt>`
  - loads saved history for `user_id`, appends system and user messages, sends to chatgpt4online, and saves both user+assistant messages

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo to Vercel (https://vercel.com/new).
3. Vercel will detect the `api/` folder and deploy serverless functions automatically.

## Notes & caveats
- This project scrapes `https://chatgpt4online.org/chat` to extract `restNonce`. If the target page structure changes, scraping will fail.
- The project stores chat history in `chat_history.json` at root. On Vercel serverless functions, this file is ephemeral — for persistent storage use an external DB or object storage.
- Timeout on remote request set to 120s; adjust if needed.

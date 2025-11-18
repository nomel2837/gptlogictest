import axios from "axios";
import scrapeNonce from "./scrapeNonce.js";
import randomIP from "./randomIP.js";

/**
 * messages: array of {role, content} objects (will be forwarded to chat endpoint)
 * q: string, newMessage (user prompt)
 * returns: reply string or the raw response data depending on remote API
 */
export default async function sendChatRequest(messages = [], q) {
  // scrape nonce first
  const nonce = await scrapeNonce();

  const payload = {
    botId: "default",
    messages: messages,
    newMessage: q,
    stream: false,
  };

  const { data } = await axios.post(
    "https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit",
    payload,
    {
      headers: {
        "X-WP-Nonce": nonce,
        "Content-Type": "application/json",
        "x-forwarded-for": randomIP(),
      },
      timeout: 120000,
    }
  );

  // the site returns { reply: "..." } in many cases; attempt to return reply if present
  if (data && typeof data === "object" && "reply" in data) return data.reply;
  return data;
}

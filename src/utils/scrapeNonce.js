import axios from "axios";
import { load } from "cheerio";

export default async function scrapeNonce() {
  const url = "https://chatgpt4online.org/chat";

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Referer": "https://chatgpt4online.org/",
      "DNT": "1",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
    },
  });

  const $ = load(data);
  const attr = $(".mwai-chatbot-container").attr("data-system");

  if (!attr) {
    throw new Error("Cannot extract nonce (data-system missing)");
  }

  const parsed = JSON.parse(attr);

  if (!parsed.restNonce) {
    throw new Error("restNonce not found");
  }

  return parsed.restNonce;
}

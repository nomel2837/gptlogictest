import axios from "axios";
import cheerio from "cheerio";

export default async function scrapeNonce() {
  const url = "https://chatgpt4online.org/chat";
  const resp = await axios.get(url);
  const $ = cheerio.load(resp.data || "");
  const attr = $(".mwai-chatbot-container").attr("data-system");
  if (!attr) throw new Error("data-system attribute not found on chat page");
  const parsed = JSON.parse(attr);
  if (!parsed.restNonce) throw new Error("restNonce not found in data-system");
  return parsed.restNonce;
}

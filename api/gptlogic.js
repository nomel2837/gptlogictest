import sendChatRequest from "../src/utils/chatRequest.js";
import { ensureHistoryFile } from "../src/history/history.js";

export default async function handler(req, res) {
  const { logic, p } = req.query;

  if (!logic || !p)
    return res.status(400).json({
      creator: "Astri",
      data: { result: "Missing ?logic= and/or ?p=" },
      status: 400,
    });

  try {
    // The original FastAPI didn't pass messages for this endpoint, so we send an empty messages list
    const reply = await sendChatRequest([], p);

    return res.json({
      creator: "Astri",
      data: { result: reply },
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      creator: "Astri",
      data: { result: "Error: " + String(err.message || err) },
      status: 500,
    });
  }
}

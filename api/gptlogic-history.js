import { readHistory, cleanupHistory, saveMessage } from "../src/history/history.js";
import sendChatRequest from "../src/utils/chatRequest.js";

export default async function handler(req, res) {
  const { user_id, logic, p } = req.query;

  if (!user_id || !logic || !p)
    return res.status(400).json({
      creator: "Astri",
      data: { result: "Missing parameters" },
      status: 400,
    });

  try {
    cleanupHistory();

    const history = readHistory()[user_id] || [];

    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    // follow same pattern as original: system then user appended
    messages.push({ role: "system", content: logic });
    messages.push({ role: "user", content: p });

    const reply = await sendChatRequest(messages, p);

    // save user and assistant messages (reply may be string or object)
    saveMessage(user_id, "user", p);
    saveMessage(user_id, "assistant", reply);

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

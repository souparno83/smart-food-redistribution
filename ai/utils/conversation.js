// In-memory conversation memory per session
const conversations = {}; // { sessionId: [{role: "user|assistant", content: "..."}] }

function addMessage(sessionId, role, content) {
  if (!conversations[sessionId]) conversations[sessionId] = [];
  conversations[sessionId].push({ role, content });
}

function getConversation(sessionId) {
  return conversations[sessionId] || [];
}

module.exports = { addMessage, getConversation };

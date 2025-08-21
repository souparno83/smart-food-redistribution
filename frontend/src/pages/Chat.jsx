import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (msg.trim()) {
      setMessages([...messages, { text: msg, sender: "You" }]);
      setMsg("");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Live Chat 💬</h2>
      <div className="card shadow p-4">
        {/* Messages */}
        <div className="chat-box mb-3" style={{ height: "300px", overflowY: "auto" }}>
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}   // start hidden + down
                animate={{ opacity: 1, y: 0 }}    // fade in + slide up
                exit={{ opacity: 0, y: -20 }}     // exit animation
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <strong>{m.sender}: </strong> {m.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

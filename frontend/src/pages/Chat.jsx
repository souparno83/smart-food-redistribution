import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    // Use a session ID to maintain conversation
    const sessionId = localStorage.getItem("sessionId") || Date.now().toString();
    localStorage.setItem("sessionId", sessionId);

    // Add user message
    setMessages((prev) => [...prev, { text: msg, sender: "You" }]);
    setMsg("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5001/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: msg }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "AI" }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "AI failed to respond", sender: "AI" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #56ab2f, #ffb347)",
      }}
    >
      <h2
        className="text-center mb-4 text-white fw-bold"
        style={{ textShadow: "1px 1px 5px #000" }}
      >
        Live Chat 💬
      </h2>

      <div
        className="card shadow-lg rounded-4 p-4 mx-auto"
        style={{ maxWidth: "600px", backgroundColor: "#fffdf5" }}
      >
        {/* Chat messages */}
        <div
          className="chat-box mb-3 p-3"
          style={{
            height: "400px",
            overflowY: "auto",
            backgroundColor: "#f7f7f7",
            borderRadius: "15px",
          }}
        >
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`d-flex mb-2 ${
                  m.sender === "You" ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    background: m.sender === "You" ? "#56ab2f" : "#ffb347",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  <strong>{m.sender}: </strong>
                  {m.text}
                </div>
              </motion.div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="d-flex mb-2 justify-content-start"
              >
                <div
                  style={{
                    background: "#ffb347",
                    color: "#fff",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    display: "flex",
                    gap: "4px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  <span className="dot bounce"></span>
                  <span className="dot bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="dot bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef}></div>
          </AnimatePresence>
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="d-flex">
          <input
            type="text"
            className="form-control rounded-pill me-2"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{ transition: "0.3s" }}
            onFocus={(e) => (e.target.style.boxShadow = "0 0 8px #56ab2f")}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
          />
          <button
            className="btn btn-primary rounded-pill"
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Send
          </button>
        </form>
      </div>

      {/* Typing dots animation */}
      <style>
        {`
          .dot {
            width: 8px;
            height: 8px;
            background-color: #fff;
            border-radius: 50%;
            display: inline-block;
          }
          .bounce {
            animation: bounce 1s infinite;
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};

export default Chat;

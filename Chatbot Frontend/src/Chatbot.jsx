import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", text: input, type: "user" },
    ]);

    setInput("");

    const query = input.replace(/\s+/g, "+");

    try {
      const response = await fetch(`http://127.0.0.1:5000/query/${query}`);
      const data = await response.json();
      const message = data.top.res;
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Chatbot", text: message, type: "bot" },
      ]);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "scroll" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-start" : "flex-end",
              margin: "5px",
            }}
          >
            <div
              style={{
                background: message.type === "user" ? "#444654" : "#202123",
                padding: "15px",
                borderRadius: "10px",
                maxWidth: "60%",
                color: "white",
              }}
            >
              <strong style={{ marginRight: "10px" }}>
                {message.user}:
              </strong>
              <pre>{message.text}</pre>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          style={{
            position: "sticky",
            bottom: 0,
            padding: "10px",
            width: "96%",
          }}
        />
        <button type="submit" style={{ display: "none" }}>
          send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;

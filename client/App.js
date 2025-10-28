import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && name.trim()) {
      const timestamp = new Date().toLocaleTimeString();
      const msgData = { name, message, time: timestamp };
      socket.emit("send_message", msgData);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Real-Time Chat</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.name}</strong> [{msg.time}]: {msg.message}
          </p>
        ))}
      </div>
      <div style={styles.bottom}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.messageBox}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "400px", margin: "50px auto", textAlign: "center" },
  chatBox: { height: "250px", overflowY: "auto", border: "1px solid #ccc", padding: "10px", marginTop: "10px" },
  input: { width: "80%", padding: "8px", marginBottom: "10px" },
  messageBox: { width: "75%", padding: "8px" },
  button: { padding: "8px 15px", marginLeft: "5px" },
  bottom: { marginTop: "10px" },
};

export default App;

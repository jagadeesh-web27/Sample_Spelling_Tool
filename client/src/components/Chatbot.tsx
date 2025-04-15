import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import "./Chatbot.css";
import { getClient } from '@botpress/webchat';

interface Message {
  text: string;
  sender: "user" | "bot";
}

const clientId = "41237795-8f33-4546-a7d8-d3743c2ba1cf"; // Replace with your actual Client ID

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const botpressClientRef = useRef<ReturnType<typeof getClient> | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  useEffect(() => {
    // Speech recognition setup
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spokenText = event.results[0][0].transcript;
        setInput(spokenText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn("Speech recognition is not supported in this browser.");
    }

    // Initialize Botpress client
    const client = getClient({ clientId });
    botpressClientRef.current = client;

    // Listen for bot messages
    client.on('message', (payload: any) => {
      console.log("Received message from Botpress:", payload);
      if (payload?.type === 'bubble' && payload?.payload?.block?.type === 'text' && payload?.payload?.block?.text) {
        const botMessage: Message = { text: payload.payload.block.text, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    });

    // Connect the client
    client.connect().then(() => {
      console.log("Botpress client connected");
    }).catch((error: any) => {
      console.error("Error connecting Botpress client:", error);
    });

    // Cleanup on unmount
    return () => {
      client.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !botpressClientRef.current) return;

    const newUserMessage: Message = { text: message, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");

    try {
      await botpressClientRef.current.sendMessage({ type: 'text', text: message, userId: 'user', channel: 'web' });
      console.log("Message sent to Botpress:", message);
    } catch (error) {
      console.error("Error sending message to Botpress:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "⚠️ Error sending message.", sender: "bot" }]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleMicPress = () => {
    if (!isListening && recognitionRef.current) {
      setIsListening(true);
      setInput("");
      recognitionRef.current.start();
    }
  };

  const handleMicRelease = () => {
    if (isListening && recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Button */}
      <button className="chatbot-btn" onClick={() => setIsOpen(!isOpen)}>💬 Chat</button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chat With Us</span>
            <button onClick={() => setIsOpen(false)}>❌</button>
          </div>
          <div className="chatbot-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === "user" ? "chat-user" : "chat-bot"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or use the mic..."
            />
            <button onClick={() => sendMessage(input)}>Send</button>
            <button
              onMouseDown={handleMicPress}
              onMouseUp={handleMicRelease}
              onTouchStart={handleMicPress}
              onTouchEnd={handleMicRelease}
              style={{ backgroundColor: isListening ? "red" : "white" }}
            >
              🎤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
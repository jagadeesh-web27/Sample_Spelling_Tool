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
      // Set to true if you want continuous listening until explicitly stopped
      // recognition.continuous = true;
      recognition.continuous = false; // Based on your current code

      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spokenText = event.results[0][0].transcript;
        setInput(spokenText);
        // Optionally send message immediately after speech recognition completes
        // sendMessage(spokenText);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended.");
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false); // Ensure listening state is reset on error
          // Provide user feedback if necessary (e.g., "Microphone error, please try again.")
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
      // Ensure the payload structure matches your Botpress version
      if (payload?.type === 'bubble' && payload?.payload?.block?.type === 'text' && payload?.payload?.block?.text) {
        const botMessage: Message = { text: payload.payload.block.text, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else if (payload?.type === 'text' && payload?.text) { // Fallback for direct text payloads
          const botMessage: Message = { text: payload.text, sender: "bot" };
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
      // Ensure the message format matches Botpress client's expected payload
      await botpressClientRef.current.sendMessage({ type: 'text', text: message });
      console.log("Message sent to Botpress:", message);
    } catch (error) {
      console.error("Error sending message to Botpress:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "⚠️ Error sending message.", sender: "bot" }]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(input);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Modified function to handle the microphone toggle
  const toggleMicListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        console.log("Stopping speech recognition.");
        recognitionRef.current.stop();
      } else {
        console.log("Starting speech recognition.");
        setInput(""); // Clear input when starting new recognition
        setIsListening(true);
        try {
          recognitionRef.current.start();
        } catch (error) {
          // Catch errors if recognition is already in progress or not supported
          console.error("Error starting speech recognition:", error);
          setIsListening(false);
        }
      }
    } else {
      console.warn("Speech recognition API not available or not initialized.");
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
              aria-label="Type your message" // Good for accessibility
            />
            <button onClick={() => sendMessage(input)} aria-label="Send message">Send</button>
            <button
              onClick={toggleMicListening} // Use onClick for keyboard/mouse click
              style={{ backgroundColor: isListening ? "red" : "white" }}
              aria-label={isListening ? "Stop listening" : "Start listening"} // Good for accessibility
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
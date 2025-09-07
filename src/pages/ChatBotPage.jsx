import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  DollarSign,
  Package,
  ShoppingBag,
  Send,
  User,
} from "lucide-react";
import { NavigationBar, Sidebar } from "../components/common";

function ChatBotPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarTabs = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "chatbot", name: "Chatbot", icon: <Bot className="w-5 h-5" /> },
    { id: "profit", name: "Profit", icon: <DollarSign className="w-5 h-5" /> },
    {
      id: "amazon",
      name: "Amazon Integration",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "shopify",
      name: "Shopify Integration",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  // Static responses for dummy chatbot
  const getRandomResponse = (userMessage) => {
    const responses = [
      "That's interesting! Can you tell me more about that?",
      "I understand your question. Here's what I can help you with...",
      "Based on your query, I'd recommend checking your dashboard for detailed analytics.",
      "Great question! Let me help you with that information.",
      "I'm here to assist you with your business analytics and data insights.",
      "Thank you for your message. Is there anything specific about your sales data you'd like to know?",
      "I can help you analyze your profit margins and sales performance.",
      "Would you like me to explain any specific metrics from your uploaded data?",
      "I'm designed to help with business queries and data analysis.",
      "Feel free to ask me about your products, sales, or profit analysis!",
    ];

    // Simple keyword-based responses
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("sales") || lowerMessage.includes("revenue")) {
      return "I can see you're interested in sales data. Your dashboard shows comprehensive sales analytics with interactive charts.";
    } else if (
      lowerMessage.includes("profit") ||
      lowerMessage.includes("margin")
    ) {
      return "Profit analysis is crucial for business growth. Check the Profit tab for detailed margin calculations.";
    } else if (
      lowerMessage.includes("product") ||
      lowerMessage.includes("item")
    ) {
      return "Product performance can be viewed in your dashboard. Each product row is clickable for detailed insights.";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("assist")
    ) {
      return "I'm here to help! You can ask me about sales, profits, products, or any data-related questions.";
    } else {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getRandomResponse(inputMessage),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <NavigationBar
        title="Chatbot"
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar tabs={sidebarTabs} activeTab="chatbot" useRouter={true} />

        {/* Main Content - Chat Interface */}
        <div className="flex-1 p-6">
          <div className="max-w-full mx-auto h-[calc(100vh-120px)] flex flex-col">
            {/* Chat Header */}
            <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    AI Assistant
                  </h2>
                  <p className="text-sm text-green-600">● Online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 bg-white shadow-md overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                    )}

                    <div
                      className={`relative p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>

                    {message.sender === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <div className="bg-white rounded-b-lg shadow-md p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || inputMessage.trim() === ""}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setInputMessage("Show me my sales data")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  📊 Sales Data
                </button>
                <button
                  onClick={() => setInputMessage("Analyze my profit margins")}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  💰 Profit Analysis
                </button>
                <button
                  onClick={() =>
                    setInputMessage("Help me understand my dashboard")
                  }
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  ❓ Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;

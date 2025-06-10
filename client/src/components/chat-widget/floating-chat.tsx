import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Mic, Bot } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws?sessionId=floating-chat`,
    {
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
    }
  );

  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === 'bot_message') {
          const botMessage: ChatMessage = {
            id: data.message.id || Math.random().toString(36),
            type: 'bot',
            content: data.message.content,
            timestamp: data.message.timestamp || new Date().toISOString(),
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add welcome message when first opening
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: 'Hello! I\'m your BotSmith assistant. How can I help you today?',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && sendMessage) {
      const userMessage: ChatMessage = {
        id: Math.random().toString(36),
        type: 'user',
        content: inputValue,
        timestamp: new Date().toISOString(),
        isVoice: isListening,
      };

      setMessages(prev => [...prev, userMessage]);

      sendMessage(JSON.stringify({
        type: 'user_message',
        content: inputValue,
        chatbotId: 1, // Demo chatbot
      }));

      setInputValue('');
      resetTranscript();
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-primary hover:bg-primary/90'
        } text-white`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-slate-800 shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-sm">BotSmith</p>
                <p className="text-xs text-white/80">
                  {isConnected ? "Online" : "Connecting..."}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleChat}
              className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="p-4 h-80 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex space-x-2 chat-message ${
                    message.type === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-2 max-w-[200px] ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-slate-700'
                    }`}
                  >
                    <p className={`text-sm ${
                      message.type === 'user' 
                        ? 'text-white' 
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {message.content}
                    </p>
                    {message.isVoice && (
                      <span className="text-xs opacity-75">🎤</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="flex items-center space-x-2 border border-gray-200 dark:border-slate-600 rounded-lg p-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 text-sm border-none focus:outline-none shadow-none bg-transparent"
              />
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`h-8 w-8 ${
                    isListening 
                      ? 'text-red-500 voice-recording' 
                      : 'text-gray-400 hover:text-primary'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || !isConnected}
                className="bg-primary hover:bg-primary/90 text-white h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

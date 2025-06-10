import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Mic, Send, Copy } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export function ChatPreview() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! How can I help you today?',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const wsUrl = useMemo(() => 
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws?sessionId=preview`,
    []
  );
  
  const wsOptions = useMemo(() => ({
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
  }), []);
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, wsOptions);

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

  const handleSendMessage = useCallback(() => {
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
  }, [inputValue, sendMessage, isListening, resetTranscript]);

  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, stopListening, startListening]);

  const copyEmbedCode = useCallback(() => {
    const embedCode = '<script src="https://yoursite.com/widget.js" data-chatbot-id="abc123"></script>';
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied!",
      description: "The embed code has been copied to your clipboard.",
    });
  }, [toast]);

  return (
    <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 dark:text-white">Chat Preview</CardTitle>
          <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
            {isConnected ? "Live Preview" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chat Widget Preview */}
        <div className="border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 h-80 overflow-hidden relative">
          {/* Chat Header */}
          <div className="bg-primary text-white p-3 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3" />
              </div>
              <div>
                <p className="font-medium text-sm">Support Assistant</p>
                <p className="text-xs text-white/80">{isConnected ? "Online" : "Offline"}</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-48 overflow-y-auto p-3 space-y-3">
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
                      : 'bg-white dark:bg-slate-700 shadow-sm border border-gray-200 dark:border-slate-600'
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
                    <span className="text-xs opacity-75">🎤 Voice</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm border-gray-200 dark:border-slate-600"
              />
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={`h-8 w-8 ${isListening ? 'text-red-500 voice-recording' : 'text-gray-400 hover:text-primary'}`}
                  title={isListening ? "Stop recording" : "Start voice input"}
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
        </div>

        {/* Embed Code */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Embed Code:</p>
            <Button variant="ghost" size="sm" onClick={copyEmbedCode}>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 break-all block">
            &lt;script src="https://yoursite.com/widget.js" data-chatbot-id="abc123"&gt;&lt;/script&gt;
          </code>
        </div>
      </CardContent>
    </Card>
  );
}

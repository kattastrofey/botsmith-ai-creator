import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, MessageCircle, Settings, Sparkles, User, Bot } from "lucide-react";
import { nanoid } from "nanoid";

interface Message {
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  selectionType?: 'single' | 'multiple';
  buttonText?: string;
  showPreview?: boolean;
}

interface AgentProfile {
  name?: string;
  personality?: string;
  communicationStyle?: string;
  jobTitle?: string;
  topTasks?: string;
  lifeAreas?: string[];
  problemSolvingStyle?: string;
  stressResponse?: string;
  responseDetail?: string;
  forbiddenTopics?: string;
  quirks?: string;
  catchphrase?: string;
  additionalInfo?: string;
  profession?: string;
}

interface ConversationResponse {
  messages: Message[];
  showPreview: boolean;
  agentProfile: AgentProfile;
  createdChatbotId?: number;
}

export function EnhancedConversation() {
  const [sessionId] = useState(() => nanoid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [createdChatbotId, setCreatedChatbotId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentMessage, showPreview]);

  useEffect(() => {
    // Start conversation with BotSmith welcome
    setMessages([{
      type: 'bot',
      content: "🤖 Welcome to BotSmith! I'm here to help you create the perfect AI agent. Let's start by choosing what type of agent you'd like to create:",
      options: [
        'Business Coach',
        'Personal Assistant',
        'Creative Partner',
        'Health & Wellness Guide',
        'Learning Companion',
        'Financial Advisor',
        'Home Manager',
        'Entertainment Curator',
        'Custom Agent'
      ],
      selectionType: 'single'
    }]);
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() && selectedOptions.length === 0) return;

    setIsLoading(true);
    
    // Add user message to chat
    const userMessage = message || selectedOptions.join(', ');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      const response = await fetch('/api/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessage,
          sessionId: sessionId
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data: ConversationResponse = await response.json();
      
      // Update conversation state
      setMessages(prev => [...prev, ...data.messages]);
      setAgentProfile(data.agentProfile);
      setShowPreview(data.showPreview);
      
      if (data.createdChatbotId) {
        setCreatedChatbotId(data.createdChatbotId);
      }
      
      // Set current message for option handling
      if (data.messages.length > 0) {
        setCurrentMessage(data.messages[data.messages.length - 1]);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
      setUserInput('');
      setSelectedOptions([]);
    }
  };

  const handleOptionSelect = (option: string, selectionType: 'single' | 'multiple' = 'single') => {
    if (selectionType === 'single') {
      sendMessage(option);
    } else {
      // Multiple selection
      setSelectedOptions(prev => 
        prev.includes(option) 
          ? prev.filter(o => o !== option)
          : [...prev, option]
      );
    }
  };

  const handleMultipleSubmit = () => {
    if (selectedOptions.length > 0) {
      sendMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(userInput);
    }
  };

  const resetConversation = async () => {
    try {
      await fetch('/api/conversation/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      
      // Reset local state
      setMessages([{
        type: 'bot',
        content: "🤖 Let's create another amazing AI agent! What type would you like to build?",
        options: [
          'Business Coach',
          'Personal Assistant',
          'Creative Partner',
          'Health & Wellness Guide',
          'Learning Companion',
          'Financial Advisor',
          'Home Manager',
          'Entertainment Curator',
          'Custom Agent'
        ],
        selectionType: 'single'
      }]);
      setAgentProfile({});
      setShowPreview(false);
      setCreatedChatbotId(null);
      setCurrentMessage(null);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" style={{backgroundColor: 'rgba(255, 255, 255, 0.02)'}}>
      {/* Header */}
      <Card className="glass-card border-white/20 bg-white/8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="h-8 w-8 text-ai-purple" />
            <span className="gradient-text-purple">BotSmith AI Agent Creator</span>
            <Sparkles className="h-6 w-6 text-ai-cyan animate-pulse" />
          </CardTitle>
          <p className="text-foreground/80">
            Create your perfect AI companion through natural conversation
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Panel */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-white/20 bg-white/8 h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-ai-blue" />
                Conversation
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 scroll-smooth" 
                   style={{scrollBehavior: 'smooth', maxHeight: '400px'}}>
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-ai-blue text-white ml-12'
                        : 'bg-white/15 backdrop-blur-sm border border-white/30 mr-12'
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 text-ai-cyan flex-shrink-0" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          
                          {/* Options */}
                          {message.options && (
                            <div className="mt-3 space-y-2">
                              {message.options.map((option, optIndex) => (
                                <div key={optIndex}>
                                  {message.selectionType === 'multiple' ? (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        checked={selectedOptions.includes(option)}
                                        onCheckedChange={() => handleOptionSelect(option, 'multiple')}
                                      />
                                      <label className="text-sm cursor-pointer" onClick={() => handleOptionSelect(option, 'multiple')}>
                                        {option}
                                      </label>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full justify-start text-left h-auto p-2 bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/40"
                                      onClick={() => handleOptionSelect(option, 'single')}
                                    >
                                      {option}
                                    </Button>
                                  )}
                                </div>
                              ))}
                              
                              {message.selectionType === 'multiple' && selectedOptions.length > 0 && (
                                <Button 
                                  onClick={handleMultipleSubmit}
                                  className="w-full mt-2 bg-ai-purple hover:bg-ai-purple/90"
                                >
                                  {message.buttonText || 'Continue'} ({selectedOptions.length} selected)
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/15 backdrop-blur-sm border border-white/30 p-3 rounded-lg mr-12">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-ai-cyan animate-pulse" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-ai-cyan rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-ai-cyan rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-ai-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Invisible div to scroll to */}
                <div ref={messagesEndRef} style={{height: '1px'}} />
              </div>
              
              {/* Input */}
              {!currentMessage?.options && (
                <div className="flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response..."
                    className="resize-none h-20 bg-white/10 border-white/30 focus:border-ai-blue"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => sendMessage(userInput)}
                    disabled={isLoading || !userInput.trim()}
                    className="self-end bg-ai-blue hover:bg-ai-blue/90"
                  >
                    Send
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Preview Panel */}
        <div className="space-y-6">
          {/* Current Progress */}
          <Card className="glass-card border-white/20 bg-white/8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-ai-purple" />
                Agent Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentProfile.name && (
                <div>
                  <p className="text-sm text-foreground/70">Name</p>
                  <p className="font-medium text-foreground/90">{agentProfile.name}</p>
                </div>
              )}
              
              {agentProfile.jobTitle && (
                <div>
                  <p className="text-sm text-foreground/70">Role</p>
                  <Badge className="bg-ai-purple/30 text-ai-purple border-ai-purple/40">
                    {agentProfile.jobTitle}
                  </Badge>
                </div>
              )}
              
              {agentProfile.personality && (
                <div>
                  <p className="text-sm text-foreground/60">Personality</p>
                  <p className="text-sm">{agentProfile.personality}</p>
                </div>
              )}
              
              {agentProfile.communicationStyle && (
                <div>
                  <p className="text-sm text-foreground/60">Communication Style</p>
                  <p className="text-sm">{agentProfile.communicationStyle}</p>
                </div>
              )}
              
              {agentProfile.lifeAreas && agentProfile.lifeAreas.length > 0 && (
                <div>
                  <p className="text-sm text-foreground/60">Focus Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {agentProfile.lifeAreas.map((area, index) => (
                      <Badge key={index} className="bg-ai-blue/20 text-ai-blue border-ai-blue/30 text-xs">
                        {area.split('(')[0].trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {agentProfile.catchphrase && agentProfile.catchphrase !== 'None' && (
                <div>
                  <p className="text-sm text-foreground/60">Catchphrase</p>
                  <p className="text-sm italic">"${agentProfile.catchphrase}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="glass-card border-white/20 bg-white/8">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {createdChatbotId && (
                  <Button 
                    className="w-full bg-gradient-to-r from-ai-purple to-ai-pink hover:from-ai-purple/90 hover:to-ai-pink/90"
                    onClick={() => window.open(`/dashboard?chatbot=${createdChatbotId}`, '_blank')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Created Agent
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={resetConversation}
                  className="w-full border-white/30 hover:bg-white/15"
                >
                  Create Another Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


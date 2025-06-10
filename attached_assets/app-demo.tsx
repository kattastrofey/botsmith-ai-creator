import React, { useState } from 'react';
import { Bot, MessageSquare, Mic, Paperclip, Send, Settings, User, Zap, X, Share2, Edit, Download } from 'lucide-react';

// Demo component that showcases a simplified version of the app
const AgentCreatorDemo = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [showPreview, setShowPreview] = useState(false);
  
  // Agent profile data
  const agentProfile = {
    name: "BusinessPro",
    profession: "Small/Medium Business Services",
    focus: "Client relationship management and sales automation",
    tasks: [
      "Client scheduling and reminders",
      "Lead qualification",
      "Service follow-ups",
      "Invoice generation and tracking"
    ],
    workflows: [
      "Lead capture to qualification",
      "Consultation to proposal",
      "Service delivery to invoice"
    ]
  };
  
  // Sample messages for the chat demo
  const messages = [
    { 
      type: 'bot', 
      content: 'Welcome to AI Agent Creator! I can help you build a customized AI assistant for your profession. What type of business do you work in?',
      options: [
        'Mental Health Professional',
        'Small/Medium Business Services',
        'Real Estate Agent',
        'Sports Expert',
        'Human Resources Professional'
      ]
    },
    {
      type: 'user',
      content: 'Small/Medium Business Services'
    },
    {
      type: 'bot',
      content: "Great! I'll help you create an AI agent for Small/Medium Business Services. Let's start by giving your agent a name."
    },
    {
      type: 'user',
      content: 'BusinessPro'
    },
    {
      type: 'bot',
      content: "Nice to meet BusinessPro! Now, tell me what's the main focus of your Small/Medium Business Services practice or business?"
    },
    {
      type: 'user',
      content: 'Client relationship management and sales automation'
    },
    {
      type: 'bot',
      content: "Thanks! I've created a draft AI agent based on your Small/Medium Business Services business. You can preview it now or continue customizing by selecting specific tasks and workflows.",
      options: ['Preview Agent', 'Customize Tasks & Workflows']
    }
  ];
  
  // Sample prompts based on profession for the preview
  const samplePrompts = [
    "I need to generate an invoice for a new client",
    "How do I follow up with leads from last week?",
    "Create a proposal template for our services"
  ];

  // Sample responses for the preview
  const sampleResponses = [
    "I'll prepare that invoice for you. Would you like me to use the standard template or customize it based on your specifications?",
    "I can help with lead follow-ups. I've identified 12 leads from last week that haven't been contacted yet. Would you like me to prepare follow-up emails for them?",
    "I'll create a proposal template for your services. What specific sections would you like to include in your proposals?"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="mr-2" />
          <h1 className="text-xl font-bold">AI Agent Creator</h1>
        </div>
        <div>
          <Settings className="cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - visible on larger screens */}
        <div className="hidden md:block w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Templates</h2>
          </div>
          <div className="p-2">
            <div className="p-2 rounded cursor-pointer bg-indigo-100">
              Small/Medium Business Services
            </div>
            <div className="p-2 rounded cursor-pointer hover:bg-indigo-50">
              Mental Health Professional
            </div>
            <div className="p-2 rounded cursor-pointer hover:bg-indigo-50">
              Real Estate Agent
            </div>
            <div className="p-2 rounded cursor-pointer hover:bg-indigo-50">
              Sports Expert
            </div>
            <div className="p-2 rounded cursor-pointer hover:bg-indigo-50">
              Human Resources Professional
            </div>
          </div>
        </div>

        {/* Main Chat/Preview Area */}
        <div className="flex-1 flex flex-col">
          {showPreview ? (
            <div className="flex-1 p-4 overflow-auto bg-white">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto overflow-hidden">
                {/* Header with tabs */}
                <div className="border-b">
                  <div className="flex">
                    <button className="px-4 py-3 font-medium text-indigo-600 border-b-2 border-indigo-600">
                      Preview
                    </button>
                    <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                      Configuration
                    </button>
                    <button className="px-4 py-3 font-medium text-gray-500 hover:text-gray-700">
                      Integration
                    </button>
                  </div>
                </div>

                {/* Preview content */}
                <div className="p-6">
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                      <Bot className="mr-2" /> {agentProfile.name}
                    </h2>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                        <Share2 size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => setShowPreview(false)} 
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 bg-indigo-50 p-4 rounded-lg">
                    <p className="text-indigo-800">
                      <span className="font-semibold">Agent Type:</span> {agentProfile.profession}
                    </p>
                    <p className="text-indigo-800 mt-1">
                      <span className="font-semibold">Focus:</span> {agentProfile.focus}
                    </p>
                  </div>

                  <div className="border rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 p-3 border-b">
                      <h3 className="font-medium">Conversation Preview</h3>
                    </div>
                    <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                      {samplePrompts.map((prompt, idx) => (
                        <div key={idx}>
                          <div className="flex justify-end mb-2">
                            <div className="bg-indigo-500 text-white rounded-lg py-2 px-3 max-w-md">
                              <p>{prompt}</p>
                            </div>
                          </div>
                          <div className="flex mb-4">
                            <div className="bg-white border border-gray-200 rounded-lg py-2 px-3 max-w-md shadow-sm">
                              <p>{sampleResponses[idx]}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md mr-4 flex items-center">
                      <Download className="mr-2" size={18} />
                      Deploy Agent
                    </button>
                    <button 
                      onClick={() => setShowPreview(false)}
                      className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-6 rounded-md flex items-center"
                    >
                      <Edit className="mr-2" size={18} />
                      Edit Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 overflow-auto">
              <div className="max-w-3xl mx-auto">
                {/* Chat Messages */}
                {messages.map((message, index) => (
                  <div key={index} className="mb-4">
                    {message.type === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-indigo-500 text-white rounded-lg py-2 px-4 max-w-md">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex">
                        <div className="bg-white rounded-lg py-3 px-4 max-w-md shadow-sm">
                          <p>{message.content}</p>
                          
                          {message.options && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.options.map((option, i) => (
                                <button 
                                  key={i}
                                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm"
                                  onClick={() => {
                                    if (option === 'Preview Agent') {
                                      setShowPreview(true);
                                    }
                                  }}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Final message with preview button */}
                <div className="mb-4">
                  <div className="flex justify-center">
                    <button 
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                      onClick={() => setShowPreview(true)}
                    >
                      Preview Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          {!showPreview && (
            <div className="p-4 border-t bg-white">
              <div className="max-w-3xl mx-auto flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Paperclip className="text-gray-400 mr-2 cursor-pointer" />
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none py-2"
                />
                <button className="mx-2 text-gray-400">
                  <Mic />
                </button>
                <button className="bg-indigo-600 text-white p-2 rounded-full">
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCreatorDemo;
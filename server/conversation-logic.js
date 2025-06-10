// Enhanced ConversationLogic.js - Comprehensive AI Agent Creation Flow
// Combines structured agent creation with detailed personality assessment from Ultimate AI Agent Intake Form

// Process and generate response based on user input
export const getResponse = (
  userMessage, 
  currentTemplate, 
  agentProfile, 
  agentCreationStage,
  templates
) => {
  const result = {
    messages: [],
    newTemplate: null,
    newProfile: null,
    newStage: null,
    showPreview: false
  };

  // STAGE 0: Welcome and Initial Template Selection
  if (!currentTemplate && templates[userMessage]) {
    result.newTemplate = userMessage;
    result.newProfile = {...agentProfile, profession: userMessage};
    result.newStage = 1;
    
    result.messages = [
      {
        type: 'bot',
        content: `🤖 Awesome! I'll help you create an AI agent for ${userMessage}. Let's start by giving your AI agent a name - this creates an immediate personal connection. Could be anything from "Alex" to "Captain Awesome" to "Pixel" — whatever feels right!`
      }
    ];
    
    return result;
  }

  // STAGE 1: Core Identity - Agent Name
  if (currentTemplate && agentCreationStage === 1) {
    result.newProfile = {...agentProfile, name: userMessage};
    result.newStage = 2;
    
    result.messages = [
      {
        type: 'bot',
        content: `Nice to meet ${userMessage}! 🎯 Now, in 2-3 sentences, describe ${userMessage}'s personality. For example: "Sarcastic but supportive, like a friend who won't let me get away with excuses but always has my back" or "Calm and methodical, like a zen master meets scientist."`
      }
    ];
    
    return result;
  }

  // STAGE 2: Core Identity - Personality Description
  if (currentTemplate && agentCreationStage === 2) {
    result.newProfile = {...agentProfile, personality: userMessage};
    result.newStage = 3;
    
    result.messages = [
      {
        type: 'bot',
        content: `Perfect! Now let's define ${agentProfile.name}'s communication style:`,
        options: [
          'Direct and concise ("Here\'s what you need to do...")',
          'Warm and conversational ("Hey there! I was thinking we could...")',
          'Witty and humorous ("Another day, another existential crisis to solve!")',
          'Formal and professional ("I would like to suggest the following course of action...")',
          'Custom style (I\'ll describe it)'
        ],
        selectionType: 'single'
      }
    ];
    
    return result;
  }

  // STAGE 3: Communication Style Selection
  if (currentTemplate && agentCreationStage === 3) {
    if (userMessage === 'Custom style (I\'ll describe it)') {
      result.newStage = 31; // Sub-stage for custom style input
      result.messages = [
        {
          type: 'bot',
          content: `Great! Please describe the communication style you'd like ${agentProfile.name} to have:`
        }
      ];
      return result;
    }
    
    result.newProfile = {...agentProfile, communicationStyle: userMessage};
    result.newStage = 4;
    
    result.messages = [
      {
        type: 'bot',
        content: `Excellent! If ${agentProfile.name} had a human job title, what would it be? Examples: "Snarky Life Coach," "Executive Brain Assistant," "Creative Muse," "Chief Overthinking Prevention Officer"`
      }
    ];
    
    return result;
  }

  // STAGE 3.1: Custom Communication Style Input
  if (currentTemplate && agentCreationStage === 31) {
    result.newProfile = {...agentProfile, communicationStyle: userMessage};
    result.newStage = 4;
    
    result.messages = [
      {
        type: 'bot',
        content: `Perfect! If ${agentProfile.name} had a human job title, what would it be? Examples: "Snarky Life Coach," "Executive Brain Assistant," "Creative Muse," "Chief Overthinking Prevention Officer"`
      }
    ];
    
    return result;
  }

  // STAGE 4: Job Title/Role Definition
  if (currentTemplate && agentCreationStage === 4) {
    result.newProfile = {...agentProfile, jobTitle: userMessage};
    result.newStage = 5;
    
    result.messages = [
      {
        type: 'bot',
        content: `🎯 Now for the big question: What are the TOP 3 tasks you want ${agentProfile.name} to help with? Be specific! Examples: "Help me stick to my workout schedule by checking in daily and not accepting my lame excuses" or "Brainstorm creative marketing ideas when I'm stuck in a rut"`
      }
    ];
    
    return result;
  }

  // STAGE 5: Top 3 Tasks Definition
  if (currentTemplate && agentCreationStage === 5) {
    result.newProfile = {...agentProfile, topTasks: userMessage};
    result.newStage = 6;
    
    result.messages = [
      {
        type: 'bot',
        content: `Fantastic! Which areas of life will ${agentProfile.name} assist with?`,
        options: [
          'Personal productivity (because your to-do list is currently in 17 different places)',
          'Health & fitness (for when you need someone to remind you that, yes, the gym still exists)',
          'Creative projects (for battling the blank page and "I have no ideas" syndrome)',
          'Learning & education (because that skill isn\'t going to learn itself)',
          'Home management (for when adulting is just too much)',
          'Financial tracking (so you can pretend to be responsible with money)',
          'Emotional support (for those moments when humans just don\'t get it)',
          'Entertainment & recommendations (because you\'ve watched everything on Netflix... twice)'
        ],
        selectionType: 'multiple',
        buttonText: 'These are my focus areas'
      }
    ];
    
    return result;
  }

  // STAGE 6: Life Areas Selection
  if (currentTemplate && agentCreationStage === 6) {
    const selectedAreas = userMessage.split(',').map(area => area.trim());
    result.newProfile = {...agentProfile, lifeAreas: selectedAreas};
    result.newStage = 7;
    
    result.messages = [
      {
        type: 'bot',
        content: `Perfect! How would you like ${agentProfile.name} to approach problems?`,
        options: [
          'Offer multiple solutions with pros/cons (for the overthinkers who need ALL the options)',
          'Give one clear recommendation (for the "just tell me what to do" crowd)',
          'Ask questions to help me figure it out myself (for those who want to feel smart)',
          'Provide step-by-step guidance (for when you need your hand held... no judgment)'
        ],
        selectionType: 'single'
      }
    ];
    
    return result;
  }

  // STAGE 7: Problem-Solving Approach
  if (currentTemplate && agentCreationStage === 7) {
    result.newProfile = {...agentProfile, problemSolvingStyle: userMessage};
    result.newStage = 8;
    
    result.messages = [
      {
        type: 'bot',
        content: `🗣️ How should ${agentProfile.name} respond when you're stressed or frustrated?`,
        options: [
          'With calm, practical solutions ("Here\'s what we can do about this...")',
          'With empathy and emotional support ("That sounds really tough. I\'m here for you.")',
          'With humor to lighten the mood ("Well, at least your hair still looks great!")',
          'By giving you space and minimal responses (sometimes less is more)'
        ],
        selectionType: 'single'
      }
    ];
    
    return result;
  }

  // STAGE 8: Stress Response Style
  if (currentTemplate && agentCreationStage === 8) {
    result.newProfile = {...agentProfile, stressResponse: userMessage};
    result.newStage = 9;
    
    result.messages = [
      {
        type: 'bot',
        content: `How much detail do you prefer in ${agentProfile.name}'s responses?`,
        options: [
          'Ultra-concise (bullet points, minimal text, for the "get to the point" people)',
          'Balanced (clear but complete, for the Goldilocks "just right" crowd)',
          'Detailed (thorough explanations, for the "I want to understand everything" folks)',
          'Adaptive (brief at first, with option to expand, for the "it depends on my mood" types)'
        ],
        selectionType: 'single'
      }
    ];
    
    return result;
  }

  // STAGE 9: Response Detail Level
  if (currentTemplate && agentCreationStage === 9) {
    result.newProfile = {...agentProfile, responseDetail: userMessage};
    result.newStage = 10;
    
    result.messages = [
      {
        type: 'bot',
        content: `What topics should ${agentProfile.name} NEVER bring up? We all have our no-go zones. Examples: "Diet culture," "Politics," "My ex," "That time I embarrassed myself at the company party" (or type "None" if there aren't any)`
      }
    ];
    
    return result;
  }

  // STAGE 10: Forbidden Topics
  if (currentTemplate && agentCreationStage === 10) {
    result.newProfile = {...agentProfile, forbiddenTopics: userMessage};
    result.newStage = 11;
    
    result.messages = [
      {
        type: 'bot',
        content: `✨ Fun part! What's one quirk or inside joke you'd like ${agentProfile.name} to have? Examples: "Always blames Mercury retrograde for problems," "Makes puns about cheese," "Refers to my cat as 'The Supreme Leader'" (or "None" if you prefer serious)`
      }
    ];
    
    return result;
  }

  // STAGE 11: Quirks and Inside Jokes
  if (currentTemplate && agentCreationStage === 11) {
    result.newProfile = {...agentProfile, quirks: userMessage};
    result.newStage = 12;
    
    result.messages = [
      {
        type: 'bot',
        content: `If ${agentProfile.name} had a catchphrase, what would it be? Examples: "Let's crush this!" or "According to my calculations..." or "Have you tried turning yourself off and on again?" (or "None" for no catchphrase)`
      }
    ];
    
    return result;
  }

  // STAGE 12: Catchphrase
  if (currentTemplate && agentCreationStage === 12) {
    result.newProfile = {...agentProfile, catchphrase: userMessage};
    result.newStage = 13;
    
    result.messages = [
      {
        type: 'bot',
        content: `Almost done! Anything else you want me to know about you or ${agentProfile.name}? This is your chance to tell me anything else that might help create your perfect AI companion! (or "Nothing else" if you're ready to proceed)`
      }
    ];
    
    return result;
  }

  // STAGE 13: Final Additional Info
  if (currentTemplate && agentCreationStage === 13) {
    result.newProfile = {...agentProfile, additionalInfo: userMessage};
    result.newStage = 14;
    
    result.messages = [
      {
        type: 'bot',
        content: `🎉 Amazing! ${agentProfile.name} is almost ready! Before we finish, I'd love to get your contact information so you can stay connected with your new AI agent. What's your full name?`
      }
    ];
    
    return result;
  }

  // STAGE 14: Contact Collection - Name
  if (currentTemplate && agentCreationStage === 14) {
    result.newProfile = {...agentProfile, ownerName: userMessage};
    result.newStage = 15;
    
    result.messages = [
      {
        type: 'bot',
        content: `Great to meet you, ${userMessage}! What's your email address? This will help you manage and access your AI agent.`
      }
    ];
    
    return result;
  }

  // STAGE 15: Contact Collection - Email
  if (currentTemplate && agentCreationStage === 15) {
    result.newProfile = {...agentProfile, ownerEmail: userMessage};
    result.newStage = 16;
    
    result.messages = [
      {
        type: 'bot',
        content: `Perfect! And your phone number? (Optional, but helpful for important updates about your AI agent)`
      }
    ];
    
    return result;
  }

  // STAGE 16: Contact Collection - Phone & Completion
  if (currentTemplate && agentCreationStage === 16) {
    result.newProfile = {...agentProfile, ownerPhone: userMessage};
    result.newStage = 17;
    result.showPreview = true;
    
    result.messages = [
      {
        type: 'bot',
        content: `🚀 Fantastic! ${agentProfile.name} - your personalized AI ${agentProfile.jobTitle} - is now ready! They're designed to help with ${agentProfile.lifeAreas?.join(', ')} using their ${agentProfile.communicationStyle} approach. Preview your new AI agent below!`,
        showPreview: true,
        options: ['Deploy Agent', 'Make Adjustments', 'Create Another Agent']
      }
    ];
    
    return result;
  }

  // Handle post-creation actions
  if (userMessage === 'Deploy Agent') {
    result.newStage = 18; // Set to completed stage
    result.messages = [
      {
        type: 'bot',
        content: `🚀 ${agentProfile.name} is now deployed and ready to assist! You can start chatting or embed them on your website. Thank you ${agentProfile.ownerName}! What would you like to do next?`,
        options: ['Chat with Agent', 'Get Embed Code', 'Create Another Agent', 'View Dashboard']
      }
    ];
    return result;
  }

  if (userMessage === 'Make Adjustments') {
    result.newStage = 1; // Restart the creation process
    result.messages = [
      {
        type: 'bot',
        content: `No problem! Let's fine-tune ${agentProfile.name}. What would you like to adjust first?`,
        options: [
          'Personality & Communication Style',
          'Tasks & Focus Areas', 
          'Problem-Solving Approach',
          'Quirks & Personal Touches',
          'Start Over Completely'
        ]
      }
    ];
    return result;
  }

  if (userMessage === 'Create Another Agent') {
    // Reset everything for a new agent
    result.newStage = 0;
    result.newTemplate = null;
    result.newProfile = {};
    result.showPreview = false;
    result.messages = [
      {
        type: 'bot',
        content: "🤖 Ready to create another amazing AI agent! Let's start by choosing what type of agent you'd like to create:",
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
      }
    ];
    return result;
  }

  // Handle completed agent actions
  if (agentCreationStage === 18) {
    if (userMessage === 'Chat with Agent') {
      result.messages = [
        {
          type: 'bot',
          content: `🎊 Here's how to chat with ${agentProfile.name}: Go to your dashboard and click on ${agentProfile.name} to start chatting!`,
          options: ['View Dashboard', 'Create Another Agent', 'Get Embed Code']
        }
      ];
      return result;
    }
    
    if (userMessage === 'Get Embed Code') {
      result.messages = [
        {
          type: 'bot',
          content: `💻 To embed ${agentProfile.name} on your website, visit your dashboard and click the "Embed" button next to ${agentProfile.name} for the HTML code!`,
          options: ['View Dashboard', 'Create Another Agent', 'Chat with Agent']
        }
      ];
      return result;
    }
    
    if (userMessage === 'View Dashboard') {
      result.messages = [
        {
          type: 'bot',
          content: `📊 Your dashboard is where you can manage ${agentProfile.name} and all your AI agents. Click the dashboard link to get started!`,
          options: ['Create Another Agent', 'Chat with Agent', 'Get Embed Code']
        }
      ];
      return result;
    }
  }

  // Handle preview request
  if (userMessage === 'Preview Agent') {
    result.showPreview = true;
    
    result.messages = [
      {
        type: 'bot',
        content: `Here's a preview of ${agentProfile.name}. You can make changes anytime.`,
        options: ['Deploy Agent', 'Make Adjustments', 'Continue Customizing']
      }
    ];
    
    return result;
  }

  // Handle any unrecognized inputs during creation flow
  if (currentTemplate && agentCreationStage > 0 && agentCreationStage < 17) {
    result.messages = [
      {
        type: 'bot',
        content: "I didn't quite understand that. Let me ask the question again to keep us moving forward with creating your AI agent."
      }
    ];
    
    // Re-ask the current stage question by calling the function recursively with empty message
    const retryResult = getResponse('', currentTemplate, agentProfile, agentCreationStage - 1, templates);
    if (retryResult.messages.length > 0) {
      result.messages = result.messages.concat(retryResult.messages);
    }
    
    return result;
  }

  // Default fallback response
  result.messages = [
    {
      type: 'bot',
      content: "I'm BotSmith, and I'm here to help create your perfect AI agent! What would you like to do?",
      options: [
        'Create New Agent',
        'Preview Existing Agent', 
        'View My Agents',
        'Get Help'
      ]
    }
  ];
  
  return result;
};

// Helper function to generate agent profile summary
export const generateAgentSummary = (profile) => {
  return {
    name: profile.name || 'Unnamed Agent',
    personality: `${profile.personality || 'Helpful AI assistant'} with ${profile.communicationStyle || 'balanced communication'}`,
    role: profile.jobTitle || 'AI Assistant',
    specialties: profile.lifeAreas || [],
    approach: profile.problemSolvingStyle || 'Balanced problem-solving',
    catchphrase: profile.catchphrase !== 'None' ? profile.catchphrase : null,
    quirks: profile.quirks !== 'None' ? profile.quirks : null,
    restrictions: profile.forbiddenTopics !== 'None' ? profile.forbiddenTopics : null,
    owner: {
      name: profile.ownerName,
      email: profile.ownerEmail,
      phone: profile.ownerPhone
    }
  };
};

// Helper function to validate stage progression
export const validateStageProgression = (currentStage, userInput) => {
  const requiredFields = {
    1: 'name',
    2: 'personality', 
    3: 'communicationStyle',
    4: 'jobTitle',
    5: 'topTasks',
    6: 'lifeAreas',
    7: 'problemSolvingStyle',
    8: 'stressResponse',
    9: 'responseDetail',
    10: 'forbiddenTopics',
    11: 'quirks',
    12: 'catchphrase',
    13: 'additionalInfo'
  };
  
  return userInput && userInput.trim().length > 0;
};

// Additional helper functions for conversation management
export const getTemplateOptions = () => {
  return [
    'Business Coach',
    'Personal Assistant', 
    'Creative Partner',
    'Health & Wellness Guide',
    'Learning Companion',
    'Financial Advisor',
    'Home Manager',
    'Entertainment Curator',
    'Custom Agent'
  ];
};

export const generatePersonalityPrompt = (profile) => {
  let prompt = `You are ${profile.name}, a ${profile.jobTitle}. `;
  
  if (profile.personality) {
    prompt += `Your personality: ${profile.personality}. `;
  }
  
  if (profile.communicationStyle) {
    prompt += `Communication style: ${profile.communicationStyle}. `;
  }
  
  if (profile.problemSolvingStyle) {
    prompt += `Problem-solving approach: ${profile.problemSolvingStyle}. `;
  }
  
  if (profile.stressResponse) {
    prompt += `When user is stressed: ${profile.stressResponse}. `;
  }
  
  if (profile.catchphrase && profile.catchphrase !== 'None') {
    prompt += `Your catchphrase: "${profile.catchphrase}". `;
  }
  
  if (profile.quirks && profile.quirks !== 'None') {
    prompt += `Your quirk: ${profile.quirks}. `;
  }
  
  if (profile.forbiddenTopics && profile.forbiddenTopics !== 'None') {
    prompt += `Never discuss: ${profile.forbiddenTopics}. `;
  }
  
  if (profile.topTasks) {
    prompt += `Your main tasks: ${profile.topTasks}. `;
  }
  
  if (profile.lifeAreas && profile.lifeAreas.length > 0) {
    prompt += `You assist with: ${profile.lifeAreas.join(', ')}. `;
  }
  
  return prompt;
};


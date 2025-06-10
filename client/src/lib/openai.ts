// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<ChatCompletion> {
  const response = await fetch('/api/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      model: options.model || 'gpt-4o',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function generateChatbotResponse(
  userMessage: string,
  chatbotPersonality: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are a BotSmith assistant with the following personality: ${chatbotPersonality}. 
                Respond helpfully and in character. Keep responses concise and engaging.`
    },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const completion = await createChatCompletion(messages);
    return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    return 'I apologize, but I\'m experiencing technical difficulties. Please try again.';
  }
}

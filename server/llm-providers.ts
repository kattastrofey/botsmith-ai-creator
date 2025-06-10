// Multi-LLM Provider Support
import { ChatMessage } from "@shared/schema";

export interface LLMProvider {
  name: string;
  generateResponse(messages: any[], model: string, systemPrompt?: string): Promise<string>;
  isAvailable(): boolean;
  getModels(): string[];
}

// Ollama Provider (Local)
export class OllamaProvider implements LLMProvider {
  name = "Ollama";
  private baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  async generateResponse(messages: any[], model: string = 'llama3.2'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Ollama error:', error);
      throw new Error('Ollama service unavailable');
    }
  }

  isAvailable(): boolean {
    return true; // Assume available if configured
  }

  getModels(): string[] {
    return ['llama3.2', 'llama3.1', 'mistral', 'codellama', 'phi3', 'qwen2.5'];
  }
}

// Anthropic Provider
export class AnthropicProvider implements LLMProvider {
  name = "Anthropic";
  private apiKey = process.env.ANTHROPIC_API_KEY;

  async generateResponse(messages: any[], model: string = 'claude-3-7-sonnet-20250219'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: messages.filter(m => m.role !== 'system'),
          system: messages.find(m => m.role === 'system')?.content || undefined
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content?.[0]?.text || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Anthropic error:', error);
      throw new Error('Anthropic service unavailable');
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getModels(): string[] {
    return [
      'claude-3-7-sonnet-20250219',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-3-opus-20240229'
    ];
  }
}

// OpenAI Provider
export class OpenAIProvider implements LLMProvider {
  name = "OpenAI";
  private apiKey = process.env.OPENAI_API_KEY;

  async generateResponse(messages: any[], model: string = 'gpt-4o'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('OpenAI service unavailable');
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
  }
}

// Google Gemini Provider
export class GoogleProvider implements LLMProvider {
  name = "Google";
  private apiKey = process.env.GOOGLE_API_KEY;

  async generateResponse(messages: any[], model: string = 'gemini-pro'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google API key not configured');
    }

    try {
      // Convert messages to Gemini format
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      const systemInstruction = messages.find(m => m.role === 'system')?.content;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Google error:', error);
      throw new Error('Google service unavailable');
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getModels(): string[] {
    return ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  }
}

// Hugging Face Provider
export class HuggingFaceProvider implements LLMProvider {
  name = "Hugging Face";
  private apiKey = process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  async generateResponse(messages: any[], model: string = 'microsoft/DialoGPT-medium'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    try {
      // Convert messages to text format for most HF models
      const text = messages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: 512,
            temperature: 0.7,
            do_sample: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0]?.generated_text || data.generated_text || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Hugging Face error:', error);
      throw new Error('Hugging Face service unavailable');
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getModels(): string[] {
    return [
      'microsoft/DialoGPT-medium',
      'microsoft/DialoGPT-large',
      'facebook/blenderbot-400M-distill',
      'microsoft/GODEL-v1_1-base-seq2seq',
      'google/flan-t5-base',
      'EleutherAI/gpt-neo-2.7B'
    ];
  }
}

// Provider Manager
export class LLMProviderManager {
  private providers: Map<string, LLMProvider> = new Map();

  constructor() {
    this.providers.set('ollama', new OllamaProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('google', new GoogleProvider());
    this.providers.set('huggingface', new HuggingFaceProvider());
  }

  getProvider(providerName: string): LLMProvider | undefined {
    return this.providers.get(providerName.toLowerCase());
  }

  getAvailableProviders(): Array<{ name: string; models: string[]; available: boolean }> {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      models: provider.getModels(),
      available: provider.isAvailable()
    }));
  }

  async generateResponse(
    messages: ChatMessage[],
    providerName: string,
    model: string,
    systemPrompt?: string
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    if (!provider.isAvailable()) {
      throw new Error(`Provider ${providerName} is not available`);
    }

    // Convert ChatMessage to provider format
    const formattedMessages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    return await provider.generateResponse(formattedMessages, model);
  }

  // Extract provider and model from full model string (e.g., "anthropic:claude-3-sonnet")
  parseModelString(modelString: string): { provider: string; model: string } {
    if (modelString.includes(':')) {
      const [provider, model] = modelString.split(':', 2);
      return { provider, model };
    }
    
    // Default to Ollama for backward compatibility
    return { provider: 'ollama', model: modelString };
  }
}

export const llmManager = new LLMProviderManager();
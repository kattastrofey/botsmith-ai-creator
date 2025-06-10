# Environment Variables Setup Guide

This guide will help you set up the required environment variables for the unified AI application server.

## Quick Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your actual values:
   ```bash
   nano .env  # or use your preferred editor
   ```

3. Verify your configuration:
   ```bash
   npm run verify-env
   ```

## Required Environment Variables

### Database Configuration
- **DATABASE_URL**: PostgreSQL connection string for Neon or your database
  - Example: `postgresql://username:password@host:5432/database_name`

### Server Configuration
- **PORT**: Server port (default: 3000)
- **NODE_ENV**: Environment mode (`development`, `production`)

## Optional AI Provider Variables

Configure the AI providers you want to use:

### OpenAI
- **OPENAI_API_KEY**: Your OpenAI API key
  - Get from: https://platform.openai.com/api-keys
  - Format: `sk-...`

### Anthropic (Claude)
- **ANTHROPIC_API_KEY**: Your Anthropic API key
  - Get from: https://console.anthropic.com/
  - Format: `sk-ant-...`

### Google (Gemini)
- **GOOGLE_API_KEY**: Your Google AI API key
  - Get from: https://aistudio.google.com/app/apikey
  - Format: `AIza...`

### Hugging Face
- **HUGGING_FACE_API_KEY** or **HF_TOKEN**: Your Hugging Face token
  - Get from: https://huggingface.co/settings/tokens
  - Format: `hf_...`
  - Used for accessing Hugging Face models and transformers

### Ollama (Local LLMs)
- **OLLAMA_BASE_URL**: Ollama server URL (default: `http://localhost:11434`)
  - Install Ollama from: https://ollama.ai/

### Email (SendGrid)
- **SENDGRID_API_KEY**: Your SendGrid API key
  - Get from: https://app.sendgrid.com/settings/api_keys
  - Format: `SG...`

### Payments (Stripe)
- **STRIPE_SECRET_KEY**: Your Stripe secret key
- **STRIPE_PUBLISHABLE_KEY**: Your Stripe publishable key
  - Get from: https://dashboard.stripe.com/apikeys

### Sessions
- **SESSION_SECRET**: Random string for session encryption
  - Generate a secure random string

## Setting Up Your Hugging Face Token

Since you have a Hugging Face token configured, here's how to use it:

1. Go to https://huggingface.co/settings/tokens
2. Create a new token or copy your existing one
3. Add it to your `.env` file:
   ```
   HF_TOKEN=hf_your_token_here
   HUGGING_FACE_API_KEY=hf_your_token_here
   ```

## Server Port Configuration

The server is configured to run on **PORT 3000** as specified. You can:

1. Set it in your `.env` file:
   ```
   PORT=3000
   ```

2. Or set it when starting the server:
   ```bash
   PORT=3000 npm run dev
   ```

## Development Workflow

1. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - Loads environment variables from `.env`
   - Runs on PORT 3000
   - Includes hot reload

2. **Verify Configuration**:
   ```bash
   npm run verify-env
   ```
   - Shows which variables are set
   - Identifies missing required variables
   - Lists available AI providers

3. **Check Available Providers**:
   The server will automatically detect which AI providers are available based on your API keys.

## Security Notes

- ✅ `.env` files are automatically excluded from Git (see `.gitignore`)
- ✅ Use `.env.example` for sharing configuration structure
- ✅ Never commit actual API keys or secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for development and production

## Troubleshooting

### Missing Environment Variables
If you see errors about missing environment variables:
1. Check your `.env` file exists
2. Ensure variables are properly formatted
3. Run `npm run verify-env` to diagnose issues

### API Key Issues
- Verify keys are valid and active
- Check API quotas and billing
- Ensure keys have necessary permissions

### Port Issues
If port 3000 is in use:
1. Change PORT in `.env` file
2. Or use: `PORT=3001 npm run dev`

## Provider-Specific Notes

### Hugging Face
- Supports both `HF_TOKEN` and `HUGGING_FACE_API_KEY`
- Works with Inference API models
- Free tier available with rate limits

### Ollama
- Requires local installation
- No API key needed
- Great for privacy and offline use
- Install models with: `ollama pull llama3.2`

For more information, see the main application documentation.


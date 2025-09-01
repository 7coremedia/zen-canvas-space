# AI Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# AI Integration Environment Variables

# Together AI API Key (for real AI responses)
# Get your API key from: https://together.ai
VITE_TOGETHER_API_KEY=your_together_ai_api_key_here

# AI Model Configuration (optional)
VITE_AI_MODEL=meta-llama/Llama-2-70b-chat-hf
VITE_AI_TEMPERATURE=0.7
VITE_AI_MAX_TOKENS=1000

# Debug Mode (optional)
VITE_AI_DEBUG=true
```

## Getting Your Together AI API Key

1. **Sign up** at [https://together.ai](https://together.ai)
2. **Navigate** to the API Keys section
3. **Create** a new API key
4. **Copy** the key and paste it in your `.env.local` file

## Testing the Integration

1. **Start your development server**: `npm run dev`
2. **Open** the AI Brand Chat page
3. **Press** `Ctrl/Cmd + Shift + A` to open the admin panel
4. **Expand** the admin panel to see the AI Test Panel
5. **Click** "Test AI Connection" to verify everything is working

## Fallback Behavior

- If no API key is provided, the system will show an error message
- Error handling provides clear guidance on what's needed
- You can still test the full AI integration flow with proper API keys

## Troubleshooting

### Common Issues:

1. **"API request failed"** - Check your API key is correct
2. **"No AI provider available"** - Ensure your `.env.local` file is in the project root
3. **"Rate limit exceeded"** - Together AI has rate limits, wait a moment and try again

### Debug Mode:

Set `VITE_AI_DEBUG=true` to see detailed logs in the browser console.

## Next Steps

Once the AI integration is working:

1. **Test** the full brand creation flow
2. **Verify** responses are generated correctly for each step
3. **Check** that error handling works when needed
4. **Monitor** API usage and costs on Together AI dashboard

# AI Providers Setup Guide

This guide will help you set up different AI providers for your brand creation project, from free testing to production-ready solutions.

## 🎯 **Provider Priority Order**

1. **Google Gemini** (Free production) - 15 requests/minute free
2. **OpenAI** (Development/Production) - $0.002 per 1K tokens
3. **Together AI** (Fallback) - $0.20 per 1M tokens
4. **Error Handling** - Graceful degradation with clear error messages

## 🚀 **Quick Start: Free Testing (Choose One)**

### **Option A: Google Gemini (Recommended for Production)**

#### Step 1: Get Gemini API Key (Free)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key

#### Step 2: Add to Environment Variables
```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### **Step 3: Test the Setup**
1. Start your development server: `npm run dev`
2. Check the browser console for provider initialization messages
3. Test the AI brand creation wizard

## 🔧 **Provider Details**



### **Google Gemini (Free Production)**
**Cost**: Free (15 requests/minute, 1M characters/month)
**Models**: Gemini Pro, Gemini Pro Vision
**Setup**: Google API key
**Best For**: Production, high-quality responses, free tier

### **OpenAI (Development/Production)**
**Cost**: $0.002 per 1K tokens (GPT-3.5-turbo)
**Models**: GPT-3.5-turbo, GPT-4, GPT-4-turbo
**Setup**: API key from OpenAI
**Best For**: Production, high-quality responses

### **Together AI (Fallback)**
**Cost**: $0.20 per 1M tokens
**Models**: DeepSeek, Llama, Mistral, and many others
**Setup**: API key from Together AI
**Best For**: Fallback, specific model access

## 📋 **Environment Variables Reference**

```bash
# Free Testing (Choose one or both)
VITE_GEMINI_API_KEY=your_gemini_key_here

# Development (Optional)
VITE_OPENAI_API_KEY=sk-your_openai_key_here

# Fallback (Optional)
VITE_TOGETHER_API_KEY=your_together_key_here
```

## 🎮 **Usage Instructions**

### **Testing Phase (Free)**
1. **Get API Key** (5 minutes) - Gemini
2. **Add to .env file** (1 minute)
3. **Start development server** (1 minute)
4. **Test brand creation wizard** (5 minutes)

### **Development Phase (Low Cost)**
1. **Add OpenAI API Key** (optional)
2. **Use GPT-3.5-turbo** for testing ($0.002 per 1K tokens)
3. **Monitor usage** in OpenAI dashboard

### **Production Phase**
1. **Use Gemini** for free production (15 req/min)
2. **Use GPT-4** for best quality (paid)
3. **Monitor costs** and usage

## 🔍 **Testing Your Setup**

### **Check Provider Status**
Open browser console and look for:
```
AI Service Manager initialized with X providers
Primary provider: [Provider Name]
```

### **Test AI Response**
1. Go to your brand creation wizard
2. Start a conversation
3. Check if responses are generated
4. Monitor console for any errors

### **Verify API Keys**
If you see "No AI providers available", check:
1. API keys are correctly set in `.env`
2. Environment variables are loaded
3. No typos in variable names

## 💰 **Cost Comparison**

### **Free Options**
- **Google Gemini**: 15 requests/minute = Free
- **Typical brand creation session**: 10-20 requests
- **Monthly capacity**: 1,500-3,000 brand creation sessions

### **Paid Options**
- **OpenAI GPT-3.5**: $0.40-$1.00 per 100 sessions
- **OpenAI GPT-4**: $9-$24 per 100 sessions
- **Together AI**: $0.20 per 1M tokens

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"No AI providers available"**
   - Check API keys in `.env` file
   - Restart development server
   - Verify environment variables are loaded

2. **"API Error" responses**
   - Check API key validity
   - Verify account has credits/quota
   - Check rate limits

3. **Slow responses**
   
   - Gemini is generally faster
   - Check internet connection

### **Provider-Specific Issues**

**Google Gemini**:
- Verify API key is valid
- Check rate limits (15 req/min)
- Ensure model is available

**OpenAI**:
- Verify API key has credits
- Check rate limits
- Ensure model name is correct

**Together AI**:
- Verify API key is valid
- Check account balance
- Ensure model is available

## 🎯 **Recommended Setup**

### **For Testing (Free)**
```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### **For Development (Low Cost)**
```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_OPENAI_API_KEY=sk-your_openai_key_here
```

### **For Production (Best Quality)**
```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_OPENAI_API_KEY=sk-your_openai_key_here
```

## 🎯 **Next Steps**

1. **Start with Gemini** (free, high quality)
2. **Test thoroughly** with brand creation wizard
3. **Add OpenAI** when ready for development
4. **Monitor costs** and usage
5. **Scale to production** with appropriate models

## 📞 **Support**

- **Google Gemini**: [Documentation](https://ai.google.dev/docs)

- **OpenAI**: [API Documentation](https://platform.openai.com/docs)
- **Together AI**: [API Documentation](https://docs.together.ai/)

The setup provides a robust, cost-effective way to test and deploy your AI brand creation system!

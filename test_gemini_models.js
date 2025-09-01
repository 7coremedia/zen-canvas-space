// Test script to check available Gemini models
// Run this in your browser console or as a Node.js script

const API_KEY = 'AIzaSyC2-xv4OaJFAdin5aPXeIfwjzUcPKcIm34'; // Your API key
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function testGeminiModels() {
  console.log('🔍 Testing available Gemini models...');
  
  try {
    // First, let's list available models
    const listResponse = await fetch(`${BASE_URL}?key=${API_KEY}`);
    const listData = await listResponse.json();
    
    console.log('📋 Available models:');
    if (listData.models) {
      listData.models.forEach(model => {
        console.log(`  - ${model.name}: ${model.description || 'No description'}`);
      });
    }
    
    // Test specific models
    const modelsToTest = [
      'gemini-1.5-pro',
      'gemini-1.5-flash', 
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    console.log('\n🧪 Testing model responses:');
    
    for (const model of modelsToTest) {
      try {
        const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Hello, this is a test message.' }]
            }],
            generationConfig: {
              maxOutputTokens: 50,
              temperature: 0.7
            }
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`  ✅ ${model}: Works!`);
        } else {
          const errorData = await response.json();
          console.log(`  ❌ ${model}: ${errorData.error?.message || 'Failed'}`);
        }
      } catch (error) {
        console.log(`  ❌ ${model}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing models:', error);
  }
}

// Run the test
testGeminiModels();

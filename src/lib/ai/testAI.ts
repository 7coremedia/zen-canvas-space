// Simple AI Integration Test

import { AIServiceManager } from './aiServiceManager';
import { BrandCreationStep } from '@/components/ai-brand-chat/types';

export const testAIIntegration = async () => {
  console.log('🧪 Testing AI Integration...');
  
  const aiService = new AIServiceManager();
  
  // Test 1: Check provider status
  console.log('📊 Provider Status:');
  const providerStatus = aiService.getProviderStatus();
  providerStatus.forEach(provider => {
    console.log(`  - ${provider.name}: ${provider.available ? '✅ Available' : '❌ Unavailable'} ${provider.isCurrent ? '(Current)' : ''}`);
  });
  
  // Test 2: Test connection
  console.log('🔗 Testing Connection...');
  const connectionTest = await aiService.testConnection();
  console.log(`  - Success: ${connectionTest.success ? '✅' : '❌'}`);
  console.log(`  - Provider: ${connectionTest.provider}`);
  if (connectionTest.error) {
    console.log(`  - Error: ${connectionTest.error}`);
  }
  
  // Test 3: Test actual response generation
  console.log('🤖 Testing Response Generation...');
  try {
    const testContext = {
      conversationHistory: [],
      currentStep: BrandCreationStep.IDEA,
      userSelections: {},
      brandIdea: 'A sustainable fashion startup'
    };
    
    const response = await aiService.generateResponse('Generate brand name suggestions', testContext);
    console.log(`  - Success: ${!response.error ? '✅' : '❌'}`);
    console.log(`  - Content Length: ${response.content.length} characters`);
    console.log(`  - Model: ${response.metadata?.model || 'Unknown'}`);
    if (response.error) {
      console.log(`  - Error: ${response.error}`);
    } else {
      console.log(`  - Preview: ${response.content.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`  - Error: ${error}`);
  }
  
  console.log('✅ AI Integration Test Complete!');
  return {
    providerStatus,
    connectionTest,
    success: connectionTest.success
  };
};

// Auto-run test if this file is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    testAIIntegration().then(result => {
      console.log('🎯 AI Integration Test Results:', result);
    });
  }, 2000);
}

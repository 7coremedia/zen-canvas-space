import { validateAIResponse, testValidator } from './validateAIResponse';
import { Orchestrator, Steps } from '../../orchestrator/stateMachine';
import { AIResponse, BrandCreationStep } from '../../types/aiResponse';

/**
 * Stone A Test Runner
 * 
 * Tests the foundation components:
 * - AIResponse type validation
 * - State machine transitions
 * - Step 1 flow end-to-end
 */
export function testStoneA() {
  console.log('🧪 Testing Stone A Foundations...\n');

  let allTestsPassed = true;

  // Test 1: AIResponse Validator
  console.log('1. Testing AIResponse Validator...');
  const validatorResults = testValidator();
  if (!validatorResults.validTest || !validatorResults.invalidTest) {
    console.log('❌ AIResponse validator tests failed');
    allTestsPassed = false;
  } else {
    console.log('✅ AIResponse validator tests passed');
  }

  // Test 2: State Machine Transitions
  console.log('\n2. Testing State Machine Transitions...');
  const orchestrator = new Orchestrator();
  
  // Test initial state
  if (orchestrator.getCurrentStep() !== Steps.IDEA_GATHERING) {
    console.log('❌ Initial state should be IDEA_GATHERING');
    allTestsPassed = false;
  } else {
    console.log('✅ Initial state correct');
  }

  // Test valid transition
  const transitionResult = orchestrator.transition(Steps.PRODUCT_SERVICE_DETAILS, {
    idea: "Organic artisanal ice cream with unique local ingredients"
  });
  
  if (!transitionResult.success) {
    console.log('❌ Valid transition failed:', transitionResult.errors);
    allTestsPassed = false;
  } else {
    console.log('✅ Valid transition succeeded');
  }

  // Test invalid transition
  const invalidTransition = orchestrator.transition(Steps.NAME_GENERATION);
  if (invalidTransition.success) {
    console.log('❌ Invalid transition should have failed');
    allTestsPassed = false;
  } else {
    console.log('✅ Invalid transition correctly rejected');
  }

  // Test 3: Step 1 Guard Validation
  console.log('\n3. Testing Step 1 Guard Validation...');
  
  // Test valid idea
  const validIdea = { idea: "Premium organic coffee with unique single-origin beans" };
  const validGuardResult = orchestrator.validate(validIdea);
  if (!validGuardResult.canProceed) {
    console.log('❌ Valid idea should pass guard:', validGuardResult.errors);
    allTestsPassed = false;
  } else {
    console.log('✅ Valid idea passes guard');
  }

  // Test invalid idea (too short)
  const invalidIdea = { idea: "Coffee" };
  const invalidGuardResult = orchestrator.validate(invalidIdea);
  if (invalidGuardResult.canProceed) {
    console.log('❌ Invalid idea should fail guard');
    allTestsPassed = false;
  } else {
    console.log('✅ Invalid idea correctly fails guard');
  }

  // Test 4: Brand Data Persistence
  console.log('\n4. Testing Brand Data Persistence...');
  orchestrator.persist({ idea: "Test brand idea" });
  const brandData = orchestrator.getBrandData();
  
  if (brandData.idea !== "Test brand idea") {
    console.log('❌ Brand data not persisted correctly');
    allTestsPassed = false;
  } else {
    console.log('✅ Brand data persisted correctly');
  }

  // Test 5: Step History
  console.log('\n5. Testing Step History...');
  const stepHistory = orchestrator.getStepHistory();
  
  if (!stepHistory.includes(Steps.IDEA_GATHERING)) {
    console.log('❌ Step history missing initial step');
    allTestsPassed = false;
  } else {
    console.log('✅ Step history tracks correctly');
  }

  // Summary
  console.log('\n📊 Stone A Test Results:');
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED - Stone A foundations are ready!');
    console.log('\nNext steps:');
    console.log('- Wire Step 1 prompts with actual LLM integration');
    console.log('- Implement Step 1 UI component');
    console.log('- Add remaining step guards');
    console.log('- Implement error handling and recovery');
  } else {
    console.log('❌ Some tests failed - review and fix issues');
  }

  return allTestsPassed;
}

/**
 * Quick validation test for development
 */
export function quickTest() {
  console.log('🔍 Quick Stone A Validation...');
  
  // Test validator
  const validatorTest = testValidator();
  
  // Test orchestrator
  const orchestrator = new Orchestrator();
  const transitionTest = orchestrator.transition(Steps.PRODUCT_SERVICE_DETAILS, {
    idea: "Test idea with unique features"
  });
  
  return {
    validator: validatorTest.validTest && validatorTest.invalidTest,
    orchestrator: transitionTest.success,
    overall: validatorTest.validTest && validatorTest.invalidTest && transitionTest.success
  };
}

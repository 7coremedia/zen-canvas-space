import { ProfessionalAIBrandingService } from './ProfessionalAIBrandingService';
import { ResponseValidator } from './ResponseValidator';
import { TemplateProvider } from './TemplateProvider';
import { AIContext } from '../aiService';

/**
 * Professional AI Consultation System Validation Demo
 * 
 * This script demonstrates the professional consultation capabilities
 * and validates that responses meet executive-level standards.
 */
export class ValidationDemo {
  private aiService: ProfessionalAIBrandingService;
  private validator: ResponseValidator;

  constructor() {
    this.aiService = new ProfessionalAIBrandingService();
    this.validator = new ResponseValidator();
  }

  /**
   * FINAL VALIDATION TEST as specified in requirements
   * 
   * Ask the system the marketing plan question and verify it returns 
   * a structured, professional response comparable to what a senior 
   * business consultant would provide in a client meeting.
   */
  async runFinalValidationTest(): Promise<void> {
    console.log('🎯 PROFESSIONAL AI CONSULTATION SYSTEM - FINAL VALIDATION TEST');
    console.log('================================================================');
    
    const testQuery = 'How do I create a marketing plan for my B2B software company?';
    const testContext: AIContext = {
      conversationHistory: [],
      currentStep: 'STRATEGY' as any,
      userSelections: {
        industry: 'Technology',
        businessType: 'B2B Software',
        targetMarket: 'Enterprise'
      },
      brandIdea: 'B2B software solution for enterprise clients'
    };

    console.log(`📋 Test Query: "${testQuery}"`);
    console.log('⏳ Processing with professional consultation system...\n');

    try {
      const response = await this.aiService.processQuery(testQuery, testContext, 'strategic');
      
      console.log('✅ RESPONSE GENERATED SUCCESSFULLY');
      console.log('==================================');
      
      // Validate response quality
      const validation = this.validator.validateResponse(response.content || '');
      
      console.log(`📊 Quality Score: ${response.qualityScore || validation.score}/100`);
      console.log(`✅ Validation Passed: ${response.validationPassed ? 'YES' : 'NO'}`);
      console.log(`🎯 Consultation Level: ${response.consultationLevel || 'N/A'}`);
      console.log(`🤖 Model Used: ${response.model || 'N/A'}`);
      console.log(`📝 Response Length: ${response.content?.length || 0} characters`);
      
      if (validation.issues.length > 0) {
        console.log('\n⚠️  VALIDATION ISSUES:');
        validation.issues.forEach(issue => console.log(`   - ${issue}`));
      }
      
      if (validation.suggestions.length > 0) {
        console.log('\n💡 SUGGESTIONS:');
        validation.suggestions.forEach(suggestion => console.log(`   - ${suggestion}`));
      }
      
      console.log('\n📄 RESPONSE CONTENT:');
      console.log('====================');
      console.log(response.content || 'No content generated');
      
      // Check success criteria
      console.log('\n🔍 SUCCESS CRITERIA VALIDATION:');
      console.log('================================');
      
      const criteria = [
        { name: 'Begins with immediate strategic value delivery', 
          passed: !response.content?.match(/^(hey|hi|hello|awesome|great)/i) },
        { name: 'Includes specific, actionable frameworks', 
          passed: response.content?.toLowerCase().includes('framework') },
        { name: 'Uses professional business terminology', 
          passed: validation.score >= 60 },
        { name: 'Provides measurable success criteria', 
          passed: response.content?.toLowerCase().includes('metrics') || response.content?.toLowerCase().includes('kpi') },
        { name: 'Maintains consultant-level expertise', 
          passed: response.content && response.content.length > 800 },
        { name: 'No casual greetings or cheerleader language', 
          passed: validation.isValid }
      ];
      
      criteria.forEach(criterion => {
        const status = criterion.passed ? '✅' : '❌';
        console.log(`${status} ${criterion.name}`);
      });
      
      const overallSuccess = criteria.every(c => c.passed);
      console.log(`\n🎯 OVERALL SUCCESS: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
      
      if (overallSuccess) {
        console.log('\n🎉 PROFESSIONAL AI CONSULTATION SYSTEM IS READY FOR PRODUCTION');
        console.log('The system now delivers executive-level strategic guidance.');
      } else {
        console.log('\n⚠️  SYSTEM NEEDS FURTHER REFINEMENT');
        console.log('Review the failed criteria and enhance the system accordingly.');
      }
      
    } catch (error) {
      console.error('❌ VALIDATION TEST FAILED:', error);
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Check API keys are properly configured');
      console.log('2. Verify database connection and migrations');
      console.log('3. Ensure all dependencies are installed');
    }
  }

  /**
   * Test template integration
   */
  async testTemplateIntegration(): Promise<void> {
    console.log('\n📋 TEMPLATE INTEGRATION TEST');
    console.log('============================');
    
    const queries = [
      'marketing plan',
      'brand strategy', 
      'business plan',
      'random query'
    ];
    
    queries.forEach(query => {
      const template = TemplateProvider.getTemplateForQuery(query);
      const hasTemplate = template !== null;
      console.log(`Query: "${query}" → Template Available: ${hasTemplate ? '✅' : '❌'}`);
      
      if (hasTemplate) {
        const templateLength = template!.length;
        console.log(`   Template Length: ${templateLength} characters`);
      }
    });
  }

  /**
   * Test response validation
   */
  testResponseValidation(): void {
    console.log('\n🔍 RESPONSE VALIDATION TEST');
    console.log('===========================');
    
    const testResponses = [
      {
        name: 'Casual Response (Should Fail)',
        content: "Hey there! That's awesome! 🎉 Don't worry, you've got this! Let's dive in!"
      },
      {
        name: 'Professional Response (Should Pass)',
        content: `
        ## Strategic Analysis
        
        The market analysis indicates significant opportunities for growth through targeted customer segmentation and strategic positioning. Implementation of the following framework will deliver measurable results within 90 days.
        
        ## Implementation Framework
        
        1. Develop comprehensive market research methodology
        2. Execute customer segmentation analysis  
        3. Create positioning strategy with differentiation metrics
        4. Build performance measurement system with ROI tracking
        
        ## Success Metrics
        
        Key performance indicators include lead generation benchmarks, conversion rate optimization, and customer acquisition cost analysis with specific targets for each metric.
        `
      }
    ];
    
    testResponses.forEach(testCase => {
      const validation = this.validator.validateResponse(testCase.content);
      console.log(`\n${testCase.name}:`);
      console.log(`   Valid: ${validation.isValid ? '✅' : '❌'}`);
      console.log(`   Score: ${validation.score}/100`);
      console.log(`   Issues: ${validation.issues.length}`);
      
      if (validation.issues.length > 0) {
        validation.issues.forEach(issue => console.log(`     - ${issue}`));
      }
    });
  }

  /**
   * Run complete validation suite
   */
  async runCompleteValidation(): Promise<void> {
    console.log('🚀 STARTING COMPLETE PROFESSIONAL AI CONSULTATION VALIDATION');
    console.log('============================================================\n');
    
    // Test 1: Template Integration
    await this.testTemplateIntegration();
    
    // Test 2: Response Validation
    this.testResponseValidation();
    
    // Test 3: Final Validation Test
    await this.runFinalValidationTest();
    
    console.log('\n🏁 VALIDATION SUITE COMPLETE');
    console.log('============================');
  }
}

// Export for use in other modules
export const runValidationDemo = async () => {
  const demo = new ValidationDemo();
  await demo.runCompleteValidation();
};

// If running directly
if (typeof window === 'undefined') {
  // Node.js environment
  runValidationDemo().catch(console.error);
}

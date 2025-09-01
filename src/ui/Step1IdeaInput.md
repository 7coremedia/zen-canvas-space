# Step 1: IDEA_GATHERING - UI Specification

## Component Overview
**Step1IdeaInput** - Multiline text input component for capturing the user's initial brand idea.

## Behavior Specification

### Input Requirements
- **Type**: Multiline text input
- **Min Length**: 10 characters
- **Max Length**: 240 characters
- **Placeholder**: "Describe your brand idea..."
- **Auto-focus**: Yes (when component mounts)

### Validation Rules
1. **Length Validation**: Must be at least 10 characters
2. **Content Validation**: Must include at least one differentiator keyword
   - Examples: "organic", "fast", "affordable", "luxury", "unique", "premium", "innovative"
3. **Real-time Validation**: Show validation errors as user types
4. **Continue Button**: Disabled until all validations pass

### UI States
1. **Empty State**: Show placeholder text, Continue button disabled
2. **Typing State**: Show character count, real-time validation feedback
3. **Valid State**: Show success indicator, Continue button enabled
4. **Invalid State**: Show error messages, Continue button disabled

### Integration Points
- **Data Persistence**: Save to `BrandData.idea` on valid submission
- **State Machine**: Call `orchestrator.transition(Steps.PRODUCT_SERVICE_DETAILS, { idea: userInput })`
- **Validation**: Use `orchestrator.validate()` to check requirements
- **Error Handling**: Display validation errors from orchestrator

## Component Structure

### Props Interface
```typescript
interface Step1IdeaInputProps {
  // Current brand data
  brandData: BrandData;
  
  // Orchestrator instance
  orchestrator: Orchestrator;
  
  // Callback when step completes
  onStepComplete: (nextStep: Steps, updatedData: Partial<BrandData>) => void;
  
  // Callback for validation errors
  onValidationError: (errors: string[]) => void;
}
```

### State Management
```typescript
interface Step1IdeaInputState {
  // User input
  idea: string;
  
  // Validation state
  isValid: boolean;
  errors: string[];
  
  // UI state
  isSubmitting: boolean;
  characterCount: number;
}
```

## Validation Logic

### Differentiator Keywords Check
```typescript
const DIFFERENTIATOR_KEYWORDS = [
  'organic', 'fast', 'affordable', 'luxury', 'unique', 'premium',
  'innovative', 'sustainable', 'local', 'handcrafted', 'artisanal',
  'exclusive', 'custom', 'personalized', 'revolutionary', 'breakthrough'
];

function hasDifferentiator(text: string): boolean {
  const lowerText = text.toLowerCase();
  return DIFFERENTIATOR_KEYWORDS.some(keyword => lowerText.includes(keyword));
}
```

### Complete Validation
```typescript
function validateIdea(idea: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!idea || idea.length < 10) {
    errors.push('Brand idea must be at least 10 characters');
  }
  
  if (idea && idea.length > 240) {
    errors.push('Brand idea must be 240 characters or less');
  }
  
  if (idea && !hasDifferentiator(idea)) {
    errors.push('Please include what makes your idea special (e.g., unique, organic, fast)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## User Experience Flow

### Initial Load
1. Component mounts with empty state
2. Textarea auto-focuses
3. Continue button is disabled
4. Show placeholder text

### User Interaction
1. User starts typing
2. Character count updates in real-time
3. Validation runs on each keystroke
4. Error messages appear/disappear as needed
5. Continue button enables when valid

### Submission
1. User clicks Continue or presses Enter
2. Final validation runs
3. If valid:
   - Save to `BrandData.idea`
   - Call `orchestrator.transition()`
   - Trigger `onStepComplete()`
4. If invalid:
   - Show error messages
   - Keep user on current step

## Error Handling

### Validation Errors
- Display inline error messages below textarea
- Use red text and error icon
- Clear errors when user starts typing again

### Submission Errors
- Show toast notification for orchestrator errors
- Keep user on current step
- Display specific error message

### Network Errors
- Show retry option
- Preserve user input
- Allow manual retry

## Accessibility

### Keyboard Navigation
- Tab to textarea
- Enter to submit (if valid)
- Escape to clear input

### Screen Reader Support
- Proper ARIA labels
- Error announcements
- Character count announcements

### Focus Management
- Auto-focus on textarea
- Focus trap within component
- Clear focus indicators

## Styling Guidelines

### Visual Design
- Use existing design system components
- Consistent with brand wizard theme
- Responsive design for mobile

### States
- **Default**: Clean, minimal appearance
- **Focus**: Clear focus indicator
- **Error**: Red border and error icon
- **Success**: Green border and checkmark
- **Disabled**: Grayed out appearance

## Integration Notes

### Data Flow
1. User input → Local state
2. Local validation → Error display
3. Valid submission → Orchestrator
4. Orchestrator validation → Step transition
5. Step transition → Parent component

### Performance Considerations
- Debounce validation on typing
- Memoize validation functions
- Optimize re-renders

---

TODO: Implement as React component once schema & state machine validated.

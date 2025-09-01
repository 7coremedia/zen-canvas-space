# Brand Creation Wizard UI Components

This directory contains the 4 core UI components for the Brand Creation Wizard chat interface. These components are designed to work together with the `AIResponse` metadata-driven architecture.

## 🎯 Overview

The UI components follow the **metadata-driven approach** from the ONE PLAN RULES:
- All visibility is controlled by `AIResponse.metadata` flags
- Components are composable and reusable
- No direct API calls - use real AI services
- Strict validation and error handling

## 📦 Components

### 1. Chat Component (`Chat.tsx`)

**Purpose:** Displays AI's response content with word limit enforcement.

**Props:**
- `content: string` - AI's message text (max 120 words enforced)
- `className?: string` - Optional styling classes

**Features:**
- ✅ Enforces 120-word limit with truncation
- ✅ Scrollable container with proper padding
- ✅ Word count indicator when truncated
- ✅ Responsive design

**Usage:**
```tsx
import { Chat } from '@/components/ui/Chat';

<Chat content={aiResponse.content} />
```

### 2. ThinkingPanel Component (`ThinkingPanel.tsx`)

**Purpose:** Shows animated "AI is thinking..." indicator.

**Props:**
- `show: boolean` - Whether to display the thinking animation
- `className?: string` - Optional styling classes
- `duration?: number` - Animation duration in ms (default: 2000ms)

**Features:**
- ✅ Non-blocking animation (user can still type)
- ✅ Auto-hides after specified duration
- ✅ Animated dots and shimmer effect
- ✅ Brain icon with pulse animation

**Usage:**
```tsx
import { ThinkingPanel } from '@/components/ui/ThinkingPanel';

<ThinkingPanel show={aiResponse.metadata.showThinking} />
```

### 3. SummaryPanel Component (`SummaryPanel.tsx`)

**Purpose:** Displays collected brand data and progress from Step 2 onward.

**Props:**
- `brandData: Partial<BrandData>` - Collected brand information
- `step: BrandCreationStep` - Current step in the process
- `show: boolean` - Whether to display the panel
- `className?: string` - Optional styling classes

**Features:**
- ✅ Hidden during Step 1 (IDEA_GATHERING)
- ✅ Progress bar with percentage
- ✅ Formatted brand data display
- ✅ Pending items indicator
- ✅ Icon-based section organization

**Usage:**
```tsx
import { SummaryPanel } from '@/components/ui/SummaryPanel';

<SummaryPanel 
  brandData={brandData}
  step={currentStep}
  show={aiResponse.metadata.showSummary}
/>
```

### 4. SmartInput Component (`SmartInput.tsx`)

**Purpose:** Renders different UI controls based on `metadata.controls.component`.

**Props:**
- `controls: UIControls | null` - UI control specifications from AIResponse
- `onSubmit: (value: any) => void` - Callback when user submits input
- `className?: string` - Optional styling classes

**Supported Input Types:**
- `multilineText` - Multiline text input with validation
- `multipleChoice` - Radio/checkbox group (single/multi-select)
- `ratingInput` - 1-5 star selector
- `selectionInput` - Dropdown or tile grid
- `confirmationInput` - Yes/no buttons

**Features:**
- ✅ Dynamic component rendering based on metadata
- ✅ Validation rules applied (minLength, maxLength, required, etc.)
- ✅ Continue button disabled until validation passes
- ✅ Error messages for invalid input
- ✅ Responsive grid layouts

**Usage:**
```tsx
import { SmartInput } from '@/components/ui/SmartInput';

<SmartInput 
  controls={aiResponse.metadata.controls}
  onSubmit={handleUserInput}
/>
```

## 🧪 Testing

### Test Page
Visit `/ui-test` to see all components working together with real AI services.

### AI Integration
The components are designed to work with real AI responses:
- Step 1: Text input with AI analysis
- Step 2: Multiple choice with AI recommendations
- Step 3: Selection grid with AI insights
- Brand data: Complete brand information from AI

## 🔧 Integration

### With AIResponse
All components expect data from the `AIResponse` interface:
```typescript
interface AIResponse {
  content: string;           // For Chat component
  metadata: AIMetadata;      // Controls all component visibility
  thinking: string;          // For ThinkingPanel (dev-only)
  summary: string;           // For SummaryPanel
}
```

### With BrandData
The SummaryPanel displays data from the `BrandData` interface:
```typescript
interface BrandData {
  idea: string;
  brandName: { selected: string; suggestions: string[] };
  positioning: { statement: string };
  brandColors: { selected: string[] };
  // ... other brand elements
}
```

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components as building blocks
- **cn() utility** for class merging
- **Consistent spacing** and **color tokens**

## 🚀 Next Steps

1. **Wire to Orchestrator** - Connect components to state machine
2. **API Integration** - Connect to real AI services
3. **Enhance Validation** - Add more sophisticated validation rules
4. **Mobile Optimization** - Improve mobile experience
5. **Accessibility** - Add ARIA labels and keyboard navigation

## 📋 Checklist

- [x] All 4 components created and exported
- [x] AI service integration
- [x] Test page with interactive demo
- [x] Documentation and usage examples
- [x] TypeScript interfaces and validation
- [x] Responsive design
- [x] Error handling and validation
- [ ] Integration with orchestrator (Phase 4)
- [ ] Real API integration (Phase 4)
- [ ] Performance optimization
- [ ] Accessibility improvements


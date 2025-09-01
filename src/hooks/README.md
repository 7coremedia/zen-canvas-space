# Persistence System Hooks

This directory contains React hooks for managing brand creation persistence, recovery, and versioning.

## Overview

The persistence system provides three main hooks that work together to ensure brand creation progress is never lost:

- **`useAutosave`** - Automatically saves progress after valid user submissions
- **`useRecovery`** - Loads saved state on page mount and handles recovery from corrupted states
- **`useVersioning`** - Manages brandId + version tracking for A/B testing and branching

## Core Utilities

### `src/utils/persistence.ts`

Core persistence utilities that handle localStorage operations, data validation, and metadata management.

**Key Functions:**
- `saveBrandData()` - Save brand data with validation
- `loadBrandData()` - Load and validate saved data
- `validateBrandData()` - Step-specific data validation
- `createBrandVersion()` - Create new version/branch
- `getStorageInfo()` - Get storage usage statistics

## Hooks

### `useAutosave`

Automatically saves brand creation progress with debouncing and error handling.

```typescript
const autosave = useAutosave(currentStep, brandData, {
  onSaveStart: () => console.log('Starting save...'),
  onSaveSuccess: (data) => console.log('Save successful:', data),
  onSaveError: (error) => console.error('Save failed:', error)
});

// State
autosave.isSaving          // boolean
autosave.lastSaved         // Date | null
autosave.saveError         // string | null
autosave.brandId           // string | null
autosave.version           // number

// Actions
autosave.saveNow()         // Force immediate save
autosave.saveNewVersion()  // Create new version
autosave.resetSaveState()  // Clear error state

// Computed
autosave.hasUnsavedChanges // boolean
autosave.saveStatus        // 'saving' | 'saved' | 'error' | 'idle'
```

### `useRecovery`

Handles automatic recovery of saved state on page mount with rollback support.

```typescript
const recovery = useRecovery({
  onRecoveryStart: () => console.log('Starting recovery...'),
  onRecoverySuccess: (data) => console.log('Recovery successful:', data),
  onRecoveryError: (error) => console.error('Recovery failed:', error),
  onRollback: (step) => console.log('Rolling back to:', step)
});

// State
recovery.isLoading         // boolean
recovery.hasRecoveredData  // boolean
recovery.recoveredData     // PersistedBrandData | null
recovery.recoveryError     // string | null
recovery.rollbackStep      // BrandCreationStep | null

// Actions
recovery.acceptRecovery()  // Restore recovered state
recovery.acceptRollback()  // Rollback to previous step
recovery.rejectRecovery()  // Start fresh
recovery.clearError()      // Clear error state

// Computed
recovery.recoverySummary   // Recovery summary for UI
recovery.canRollback       // boolean
recovery.recoveryStatus    // 'loading' | 'success' | 'error' | 'none'
```

### `useVersioning`

Manages brand versioning and branching for A/B testing scenarios.

```typescript
const versioning = useVersioning(currentStep, brandData, {
  onVersionCreated: (version) => console.log('Version created:', version),
  onVersionSwitched: (version) => console.log('Switched to version:', version),
  onBranchCreated: (version) => console.log('Branch created:', version),
  onError: (error) => console.error('Versioning error:', error)
});

// State
versioning.brandId         // string | null
versioning.currentVersion  // number
versioning.versions        // VersionInfo[]
versioning.isCreatingBranch // boolean
versioning.branchError     // string | null

// Actions
versioning.createBranch()  // Create new version/branch
versioning.switchVersion(version) // Switch to specific version
versioning.clearBranchError() // Clear error state

// Computed
versioning.versionHistory  // Sorted version history
versioning.currentVersionInfo // Current version details
versioning.versionComparison // Version comparison data
versioning.versionSummary  // Version summary for UI
versioning.isLatestVersion // boolean
versioning.canCreateBranch // boolean
versioning.hasMultipleVersions // boolean
```

## Data Structures

### `PersistedBrandData`

```typescript
interface PersistedBrandData {
  brandId: string;
  version: number;
  currentStep: BrandCreationStep;
  brandData: Partial<BrandData>;
  timestamp: Date;
  sessionId: string;
  isValid: boolean;
}
```

### `BrandMetadata`

```typescript
interface BrandMetadata {
  brandId: string;
  versions: {
    version: number;
    step: BrandCreationStep;
    timestamp: Date;
    isValid: boolean;
  }[];
  lastActiveVersion: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### `VersionInfo`

```typescript
interface VersionInfo {
  version: number;
  step: BrandCreationStep;
  timestamp: Date;
  isValid: boolean;
  isActive: boolean;
}
```

## Usage Example

```typescript
import { useAutosave, useRecovery, useVersioning } from '@/hooks';

function BrandWizard() {
  const [currentStep, setCurrentStep] = useState(BrandCreationStep.IDEA_GATHERING);
  const [brandData, setBrandData] = useState<Partial<BrandData>>({});

  // Initialize persistence hooks
  const autosave = useAutosave(currentStep, brandData);
  const recovery = useRecovery();
  const versioning = useVersioning(currentStep, brandData);

  // Handle recovery on mount
  useEffect(() => {
    if (recovery.hasRecoveredData && recovery.recoveredData) {
      const recovered = recovery.acceptRecovery();
      if (recovered) {
        setBrandData(recovered.brandData);
        setCurrentStep(recovered.currentStep);
      }
    }
  }, [recovery.hasRecoveredData]);

  // Handle user input
  const handleInputSubmit = (value: any) => {
    // Update brand data
    const updatedBrandData = { ...brandData };
    // ... update based on current step
    setBrandData(updatedBrandData);
    
    // Move to next step
    setCurrentStep(nextStep);
  };

  return (
    <div>
      {/* Recovery UI */}
      {recovery.hasRecoveredData && (
        <Alert>
          <strong>Recovery Available!</strong>
          <Button onClick={() => recovery.acceptRecovery()}>
            Restore Progress
          </Button>
        </Alert>
      )}

      {/* Save status */}
      <Badge>{autosave.saveStatus}</Badge>

      {/* Version controls */}
      <Button onClick={versioning.createBranch}>
        Create Branch
      </Button>

      {/* Main wizard content */}
      {/* ... */}
    </div>
  );
}
```

## Features

### 🔄 Autosave
- **Debounced saves** (1 second delay to prevent excessive saves)
- **Visual feedback** with save status indicators
- **Manual override** with `saveNow()` function
- **Error handling** with retry mechanisms

### 🛡️ Recovery
- **Automatic restoration** on page reload
- **Data validation** to ensure integrity
- **Rollback support** to previous valid steps
- **Graceful error handling** with user-friendly messages

### 🌿 Versioning
- **Branch creation** for A/B testing scenarios
- **Version history** tracking with timestamps
- **Version switching** between different iterations
- **Metadata management** for comprehensive tracking

### 📊 Storage Management
- **Storage usage monitoring** with percentage tracking
- **Data validation** per step to ensure quality
- **Session management** with unique session IDs
- **Cleanup utilities** for testing and reset

## Testing

Run the persistence tests:

```bash
npm test src/tests/persistence.test.ts
```

## Storage Keys

The system uses the following localStorage keys:
- `brand_creation_data` - Main brand data
- `brand_creation_metadata` - Version metadata
- `brand_session_id` - Session tracking

## Error Handling

All hooks include comprehensive error handling:
- **Network errors** - Graceful fallbacks
- **Storage errors** - User notifications
- **Validation errors** - Automatic rollback
- **Data corruption** - Recovery mechanisms

## Performance

- **Debounced saves** prevent excessive localStorage writes
- **Lazy loading** of metadata only when needed
- **Efficient validation** with step-specific rules
- **Minimal re-renders** with optimized state management

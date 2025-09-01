/**
 * useAutosave Hook
 * 
 * Automatically saves brand creation progress after valid user submissions.
 * Provides visual feedback and error handling for save operations.
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { BrandData } from '@/types/brandData';
import { BrandCreationStep } from '@/types/aiResponse';
import { 
  saveBrandData, 
  generateBrandId, 
  PersistedBrandData,
  getBrandMetadata 
} from '@/utils/persistence';

export interface AutosaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  saveError: string | null;
  brandId: string | null;
  version: number;
}

export interface AutosaveCallbacks {
  onSaveStart?: () => void;
  onSaveSuccess?: (data: PersistedBrandData) => void;
  onSaveError?: (error: string) => void;
}

export const useAutosave = (
  currentStep: BrandCreationStep,
  brandData: Partial<BrandData>,
  callbacks?: AutosaveCallbacks
) => {
  const [state, setState] = React.useState<AutosaveState>({
    isSaving: false,
    lastSaved: null,
    saveError: null,
    brandId: null,
    version: 1
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveDataRef = useRef<string>('');

  // Initialize brand ID and version on mount
  useEffect(() => {
    const metadata = getBrandMetadata();
    if (metadata) {
      setState(prev => ({
        ...prev,
        brandId: metadata.brandId,
        version: metadata.lastActiveVersion
      }));
    } else {
      setState(prev => ({
        ...prev,
        brandId: generateBrandId()
      }));
    }
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((data: Partial<BrandData>, step: BrandCreationStep) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Create data hash for comparison
    const dataHash = JSON.stringify({ data, step });
    
    // Skip save if data hasn't changed
    if (dataHash === lastSaveDataRef.current) {
      return;
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(async () => {
      await performSave(data, step);
      lastSaveDataRef.current = dataHash;
    }, 1000); // 1 second debounce
  }, []);

  // Perform the actual save operation
  const performSave = useCallback(async (
    data: Partial<BrandData>, 
    step: BrandCreationStep
  ) => {
    if (!state.brandId) {
      console.warn('⚠️ No brand ID available for save');
      return;
    }

    setState(prev => ({ ...prev, isSaving: true, saveError: null }));
    callbacks?.onSaveStart?.();

    try {
      const savedData = saveBrandData(state.brandId, step, data, state.version);
      
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        saveError: null
      }));

      callbacks?.onSaveSuccess?.(savedData);
      
      console.log('✅ Autosave successful:', {
        brandId: state.brandId,
        version: state.version,
        step,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Save failed';
      
      setState(prev => ({
        ...prev,
        isSaving: false,
        saveError: errorMessage
      }));

      callbacks?.onSaveError?.(errorMessage);
      
      console.error('❌ Autosave failed:', error);
    }
  }, [state.brandId, state.version, callbacks]);

  // Trigger save when brand data changes
  useEffect(() => {
    // Only save if we have meaningful data
    if (Object.keys(brandData).length > 0) {
      debouncedSave(brandData, currentStep);
    }
  }, [brandData, currentStep, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Manual save function (for immediate saves)
  const saveNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await performSave(brandData, currentStep);
  }, [brandData, currentStep, performSave]);

  // Force save with new version
  const saveNewVersion = useCallback(async () => {
    const newVersion = state.version + 1;
    setState(prev => ({ ...prev, version: newVersion }));
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    await performSave(brandData, currentStep);
  }, [brandData, currentStep, state.version, performSave]);

  // Reset save state
  const resetSaveState = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSaving: false,
      saveError: null
    }));
  }, []);

  return {
    // State
    isSaving: state.isSaving,
    lastSaved: state.lastSaved,
    saveError: state.saveError,
    brandId: state.brandId,
    version: state.version,
    
    // Actions
    saveNow,
    saveNewVersion,
    resetSaveState,
    
    // Computed
    hasUnsavedChanges: lastSaveDataRef.current !== JSON.stringify({ data: brandData, step: currentStep }),
    saveStatus: state.isSaving ? 'saving' : state.saveError ? 'error' : state.lastSaved ? 'saved' : 'idle'
  };
};

/**
 * useRecovery Hook
 * 
 * Loads saved brand creation state on page mount and handles recovery
 * from corrupted or invalid states with rollback logic.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrandData } from '@/types/brandData';
import { BrandCreationStep } from '@/types/aiResponse';
import { 
  loadBrandData, 
  PersistedBrandData,
  getBrandMetadata,
  BrandMetadata 
} from '@/utils/persistence';

export interface RecoveryState {
  isLoading: boolean;
  hasRecoveredData: boolean;
  recoveredData: PersistedBrandData | null;
  recoveryError: string | null;
  rollbackStep: BrandCreationStep | null;
  metadata: BrandMetadata | null;
}

export interface RecoveryCallbacks {
  onRecoveryStart?: () => void;
  onRecoverySuccess?: (data: PersistedBrandData) => void;
  onRecoveryError?: (error: string) => void;
  onRollback?: (step: BrandCreationStep) => void;
}

export const useRecovery = (callbacks?: RecoveryCallbacks) => {
  const [state, setState] = useState<RecoveryState>({
    isLoading: true,
    hasRecoveredData: false,
    recoveredData: null,
    recoveryError: null,
    rollbackStep: null,
    metadata: null
  });

  // Load saved data on mount
  useEffect(() => {
    const performRecovery = async () => {
      setState(prev => ({ ...prev, isLoading: true, recoveryError: null }));
      callbacks?.onRecoveryStart?.();

      try {
        // Load brand data
        const savedData = loadBrandData();
        const metadata = getBrandMetadata();

        if (!savedData) {
          // No saved data found - this is normal for new sessions
          setState(prev => ({
            ...prev,
            isLoading: false,
            hasRecoveredData: false,
            metadata
          }));
          return;
        }

        // Check if data is valid
        if (!savedData.isValid) {
          // Data is corrupted, try to rollback to previous step
          const rollbackStep = findRollbackStep(savedData, metadata);
          
          setState(prev => ({
            ...prev,
            isLoading: false,
            hasRecoveredData: true,
            recoveredData: savedData,
            rollbackStep,
            metadata
          }));

          if (rollbackStep) {
            callbacks?.onRollback?.(rollbackStep);
          }
          
          callbacks?.onRecoveryError?.('Data validation failed - rolling back to previous step');
          return;
        }

        // Data is valid - recovery successful
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasRecoveredData: true,
          recoveredData: savedData,
          metadata
        }));

        callbacks?.onRecoverySuccess?.(savedData);
        
        console.log('✅ Recovery successful:', {
          brandId: savedData.brandId,
          version: savedData.version,
          step: savedData.currentStep,
          isValid: savedData.isValid
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Recovery failed';
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          recoveryError: errorMessage
        }));

        callbacks?.onRecoveryError?.(errorMessage);
        
        console.error('❌ Recovery failed:', error);
      }
    };

    performRecovery();
  }, [callbacks]);

  // Find the previous valid step for rollback
  const findRollbackStep = useCallback((
    currentData: PersistedBrandData,
    metadata: BrandMetadata | null
  ): BrandCreationStep | null => {
    if (!metadata) {
      return null;
    }

    // Get all valid versions, sorted by version number
    const validVersions = metadata.versions
      .filter(v => v.isValid && v.version < currentData.version)
      .sort((a, b) => b.version - a.version);

    if (validVersions.length === 0) {
      return null;
    }

    // Return the most recent valid step
    return validVersions[0].step;
  }, []);

  // Accept recovery and restore state
  const acceptRecovery = useCallback(() => {
    if (!state.recoveredData) {
      return null;
    }

    return {
      brandData: state.recoveredData.brandData,
      currentStep: state.recoveredData.currentStep,
      brandId: state.recoveredData.brandId,
      version: state.recoveredData.version
    };
  }, [state.recoveredData]);

  // Accept rollback to previous step
  const acceptRollback = useCallback(() => {
    if (!state.rollbackStep) {
      return null;
    }

    return {
      currentStep: state.rollbackStep,
      brandId: state.recoveredData?.brandId || null,
      version: state.recoveredData?.version || 1
    };
  }, [state.rollbackStep, state.recoveredData]);

  // Reject recovery and start fresh
  const rejectRecovery = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasRecoveredData: false,
      recoveredData: null,
      rollbackStep: null
    }));
  }, []);

  // Clear recovery error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, recoveryError: null }));
  }, []);

  // Get recovery summary for UI
  const getRecoverySummary = useCallback(() => {
    if (!state.recoveredData) {
      return null;
    }

    const { brandId, version, currentStep, timestamp, isValid } = state.recoveredData;
    const timeAgo = getTimeAgo(timestamp);

    return {
      brandId,
      version,
      step: currentStep,
      timeAgo,
      isValid,
      hasRollback: !!state.rollbackStep,
      rollbackStep: state.rollbackStep
    };
  }, [state.recoveredData, state.rollbackStep]);

  return {
    // State
    isLoading: state.isLoading,
    hasRecoveredData: state.hasRecoveredData,
    recoveredData: state.recoveredData,
    recoveryError: state.recoveryError,
    rollbackStep: state.rollbackStep,
    metadata: state.metadata,
    
    // Actions
    acceptRecovery,
    acceptRollback,
    rejectRecovery,
    clearError,
    
    // Computed
    recoverySummary: getRecoverySummary(),
    canRollback: !!state.rollbackStep,
    recoveryStatus: state.isLoading ? 'loading' : 
                   state.recoveryError ? 'error' : 
                   state.hasRecoveredData ? 'success' : 'none'
  };
};

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

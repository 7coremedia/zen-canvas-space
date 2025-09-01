/**
 * useErrorHandling Hook
 * 
 * Main error handling orchestrator that manages JSON validation,
 * auto-repair, step validation, and network error handling.
 * Provides a unified interface for error recovery and user feedback.
 */

import React, { useState, useCallback, useRef } from 'react';
import { AIResponse, BrandCreationStep } from '@/types/aiResponse';
import { validateAIResponse, ValidationResult } from '@/utils/errorHandling/validateAIResponse';
import { attemptAutoRepair, createFallbackResponse, RepairAttempt } from '@/utils/errorHandling/autoRepair';
import { validateStep, StepValidationResult } from '@/utils/errorHandling/stepValidator';
import { makeNetworkRequest, NetworkResponse, getNetworkStats } from '@/utils/errorHandling/networkHandler';

export interface ErrorHandlingState {
  hasError: boolean;
  errorType: 'validation' | 'step' | 'network' | 'repair' | null;
  errorMessage: string;
  canRetry: boolean;
  retryCount: number;
  maxRetries: number;
  isRetrying: boolean;
  repairAttempts: number;
  maxRepairAttempts: number;
  lastError: any;
  suggestions: string[];
}

export interface ErrorHandlingCallbacks {
  onError?: (error: any, type: string) => void;
  onRetry?: () => void;
  onRepair?: (repairedResponse: AIResponse) => void;
  onFallback?: (fallbackResponse: AIResponse) => void;
  onRecovery?: () => void;
}

export interface ErrorHandlingOptions {
  maxRetries?: number;
  maxRepairAttempts?: number;
  enableAutoRepair?: boolean;
  enableFallbacks?: boolean;
  strictMode?: boolean;
}

const DEFAULT_OPTIONS: Required<ErrorHandlingOptions> = {
  maxRetries: 3,
  maxRepairAttempts: 2,
  enableAutoRepair: true,
  enableFallbacks: true,
  strictMode: false
};

export const useErrorHandling = (
  options: ErrorHandlingOptions = {},
  callbacks: ErrorHandlingCallbacks = {}
) => {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  const [state, setState] = useState<ErrorHandlingState>({
    hasError: false,
    errorType: null,
    errorMessage: '',
    canRetry: true,
    retryCount: 0,
    maxRetries: config.maxRetries,
    isRetrying: false,
    repairAttempts: 0,
    maxRepairAttempts: config.maxRepairAttempts,
    lastError: null,
    suggestions: []
  });

  const currentStepRef = useRef<BrandCreationStep>(BrandCreationStep.IDEA_GATHERING);
  const brandDataRef = useRef<any>({});

  /**
   * Validate and handle AI response
   */
  const handleAIResponse = useCallback((
    response: any,
    expectedStep?: BrandCreationStep
  ): { isValid: boolean; processedResponse?: AIResponse; error?: string } => {
    try {
      // Update current step reference
      if (expectedStep) {
        currentStepRef.current = expectedStep;
      }

      console.log('🔍 Validating AI response:', response);

      // 1. JSON Structure Validation
      const validationResult = validateAIResponse(response, expectedStep);
      
      if (!validationResult.isValid) {
        console.warn('❌ JSON validation failed:', validationResult.errors);
        
        // Try auto-repair if enabled
        if (config.enableAutoRepair && state.repairAttempts < config.maxRepairAttempts) {
          const repairResult = attemptAutoRepair(response, validationResult, expectedStep);
          
          if (repairResult.success && repairResult.repairedResponse) {
            console.log('✅ Auto-repair successful');
            setState(prev => ({
              ...prev,
              repairAttempts: prev.repairAttempts + 1,
              hasError: false,
              errorType: null,
              errorMessage: '',
              suggestions: repairResult.warnings
            }));
            
            callbacks.onRepair?.(repairResult.repairedResponse);
            return { isValid: true, processedResponse: repairResult.repairedResponse };
          } else {
            console.warn('❌ Auto-repair failed');
            setError('validation', 'JSON validation failed and auto-repair unsuccessful', validationResult.suggestions);
            return { isValid: false, error: 'JSON validation failed' };
          }
        } else {
          setError('validation', 'JSON validation failed', validationResult.suggestions);
          return { isValid: false, error: 'JSON validation failed' };
        }
      }

      // 2. Step Validation
      if (expectedStep) {
        const stepValidation = validateStep(response, expectedStep);
        
        if (!stepValidation.isValid) {
          console.warn('❌ Step validation failed:', stepValidation);
          setError('step', 'Step mismatch detected', stepValidation.suggestions);
          return { isValid: false, error: 'Step mismatch' };
        }
      }

      // 3. Content Validation
      if (!response.content || response.content.trim().length === 0) {
        console.warn('❌ Empty content detected');
        
        if (config.enableFallbacks && expectedStep) {
          const fallbackResponse = createFallbackResponse(expectedStep);
          console.log('✅ Using fallback response');
          
          setState(prev => ({
            ...prev,
            hasError: false,
            errorType: null,
            errorMessage: '',
            suggestions: ['Used fallback response due to empty content']
          }));
          
          callbacks.onFallback?.(fallbackResponse);
          return { isValid: true, processedResponse: fallbackResponse };
        } else {
          setError('validation', 'Empty content detected', ['Provide meaningful content for the response']);
          return { isValid: false, error: 'Empty content' };
        }
      }

      // All validations passed
      console.log('✅ AI response validation successful');
      setState(prev => ({
        ...prev,
        hasError: false,
        errorType: null,
        errorMessage: '',
        suggestions: []
      }));

      return { isValid: true, processedResponse: response as AIResponse };

    } catch (error) {
      console.error('❌ Error during AI response handling:', error);
      setError('validation', 'Unexpected error during validation', ['Check console for details']);
      return { isValid: false, error: 'Unexpected validation error' };
    }
  }, [config, state.repairAttempts, callbacks]);

  /**
   * Handle network requests with error handling
   */
  const handleNetworkRequest = useCallback(async (
    url: string,
    method: string = 'POST',
    data: any = {},
    retryConfig?: any
  ): Promise<NetworkResponse> => {
    setState(prev => ({ ...prev, isRetrying: true }));

    try {
      const response = await makeNetworkRequest(url, method, data, retryConfig);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          hasError: false,
          errorType: null,
          errorMessage: '',
          isRetrying: false,
          retryCount: 0
        }));
      } else {
        setError('network', response.error || 'Network request failed', [
          'Check your internet connection',
          'Try again in a moment',
          'Contact support if the problem persists'
        ]);
      }

      return response;
    } catch (error) {
      console.error('❌ Network request error:', error);
      setError('network', 'Network request failed', [
        'Check your internet connection',
        'Try again in a moment'
      ]);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown network error',
        retryCount: 0,
        duration: 0
      };
    }
  }, []);

  /**
   * Retry the last failed operation
   */
  const retry = useCallback(() => {
    if (!state.canRetry || state.retryCount >= state.maxRetries) {
      console.warn('Cannot retry: max retries reached or retry not allowed');
      return;
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1
    }));

    callbacks.onRetry?.();
  }, [state.canRetry, state.retryCount, state.maxRetries, callbacks]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      errorType: null,
      errorMessage: '',
      canRetry: true,
      retryCount: 0,
      isRetrying: false,
      repairAttempts: 0,
      lastError: null,
      suggestions: []
    }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((
    type: 'validation' | 'step' | 'network' | 'repair',
    message: string,
    suggestions: string[] = []
  ) => {
    setState(prev => ({
      ...prev,
      hasError: true,
      errorType: type,
      errorMessage: message,
      canRetry: type !== 'validation' || prev.retryCount < config.maxRetries,
      lastError: { type, message, timestamp: Date.now() },
      suggestions
    }));

    callbacks.onError?.({ type, message, suggestions }, type);
  }, [config.maxRetries, callbacks]);

  /**
   * Get error handling statistics
   */
  const getStats = useCallback(() => {
    const networkStats = getNetworkStats();
    
    return {
      errorHandling: {
        totalErrors: state.hasError ? 1 : 0,
        retryCount: state.retryCount,
        repairAttempts: state.repairAttempts,
        currentErrorType: state.errorType
      },
      network: networkStats,
      currentStep: currentStepRef.current
    };
  }, [state]);

  /**
   * Update brand data reference
   */
  const updateBrandData = useCallback((brandData: any) => {
    brandDataRef.current = brandData;
  }, []);

  /**
   * Get current step
   */
  const getCurrentStep = useCallback(() => {
    return currentStepRef.current;
  }, []);

  /**
   * Check if error can be recovered from
   */
  const canRecover = useCallback(() => {
    if (!state.hasError) return false;
    
    switch (state.errorType) {
      case 'validation':
        return state.repairAttempts < config.maxRepairAttempts;
      case 'step':
        return true; // Can always retry with correct step
      case 'network':
        return state.retryCount < config.maxRetries;
      case 'repair':
        return state.repairAttempts < config.maxRepairAttempts;
      default:
        return false;
    }
  }, [state, config]);

  /**
   * Get recovery action
   */
  const getRecoveryAction = useCallback(() => {
    if (!state.hasError) return null;
    
    switch (state.errorType) {
      case 'validation':
        return state.repairAttempts < config.maxRepairAttempts ? 'repair' : 'fallback';
      case 'step':
        return 'retry';
      case 'network':
        return state.retryCount < config.maxRetries ? 'retry' : 'manual';
      case 'repair':
        return state.repairAttempts < config.maxRepairAttempts ? 'repair' : 'fallback';
      default:
        return 'manual';
    }
  }, [state, config]);

  return {
    // State
    errorState: state,
    
    // Actions
    handleAIResponse,
    handleNetworkRequest,
    retry,
    resetError,
    setError,
    
    // Utilities
    getStats,
    updateBrandData,
    getCurrentStep,
    canRecover,
    getRecoveryAction,
    
    // Configuration
    config
  };
};

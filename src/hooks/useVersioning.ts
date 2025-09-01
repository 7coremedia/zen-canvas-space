/**
 * useVersioning Hook
 * 
 * Manages brandId + version tracking and supports branching for A/B testing.
 * Handles version history, branching, and version switching.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BrandData } from '@/types/brandData';
import { BrandCreationStep } from '@/types/aiResponse';
import { 
  getBrandMetadata,
  createBrandVersion,
  BrandMetadata 
} from '@/utils/persistence';

export interface VersionInfo {
  version: number;
  step: BrandCreationStep;
  timestamp: Date;
  isValid: boolean;
  isActive: boolean;
}

export interface VersioningState {
  brandId: string | null;
  currentVersion: number;
  versions: VersionInfo[];
  isCreatingBranch: boolean;
  branchError: string | null;
  metadata: BrandMetadata | null;
}

export interface VersioningCallbacks {
  onVersionCreated?: (version: number) => void;
  onVersionSwitched?: (version: number) => void;
  onBranchCreated?: (version: number) => void;
  onError?: (error: string) => void;
}

export const useVersioning = (
  currentStep: BrandCreationStep,
  brandData: Partial<BrandData>,
  callbacks?: VersioningCallbacks
) => {
  const [state, setState] = useState<VersioningState>({
    brandId: null,
    currentVersion: 1,
    versions: [],
    isCreatingBranch: false,
    branchError: null,
    metadata: null
  });

  // Load version metadata on mount
  useEffect(() => {
    const loadMetadata = () => {
      try {
        const metadata = getBrandMetadata();
        
        if (metadata) {
          const versions: VersionInfo[] = metadata.versions.map(v => ({
            version: v.version,
            step: v.step,
            timestamp: new Date(v.timestamp),
            isValid: v.isValid,
            isActive: v.version === metadata.lastActiveVersion
          }));

          setState(prev => ({
            ...prev,
            brandId: metadata.brandId,
            currentVersion: metadata.lastActiveVersion,
            versions,
            metadata
          }));
        }
      } catch (error) {
        console.error('❌ Failed to load version metadata:', error);
      }
    };

    loadMetadata();
  }, []);

  // Create a new version (branch) from current state
  const createBranch = useCallback(async () => {
    setState(prev => ({ ...prev, isCreatingBranch: true, branchError: null }));
    callbacks?.onVersionCreated?.(state.currentVersion);

    try {
      const { brandId, version } = createBrandVersion(brandData, currentStep);
      
      // Update local state
      const newVersion: VersionInfo = {
        version,
        step: currentStep,
        timestamp: new Date(),
        isValid: true,
        isActive: true
      };

      setState(prev => ({
        ...prev,
        brandId,
        currentVersion: version,
        versions: [...prev.versions.map(v => ({ ...v, isActive: false })), newVersion],
        isCreatingBranch: false
      }));

      callbacks?.onBranchCreated?.(version);
      
      console.log('🔄 Branch created:', { brandId, version, step: currentStep });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create branch';
      
      setState(prev => ({
        ...prev,
        isCreatingBranch: false,
        branchError: errorMessage
      }));

      callbacks?.onError?.(errorMessage);
      
      console.error('❌ Branch creation failed:', error);
    }
  }, [brandData, currentStep, state.currentVersion, callbacks]);

  // Switch to a different version
  const switchVersion = useCallback((version: number) => {
    const targetVersion = state.versions.find(v => v.version === version);
    
    if (!targetVersion) {
      const errorMessage = `Version ${version} not found`;
      callbacks?.onError?.(errorMessage);
      return;
    }

    setState(prev => ({
      ...prev,
      currentVersion: version,
      versions: prev.versions.map(v => ({
        ...v,
        isActive: v.version === version
      }))
    }));

    callbacks?.onVersionSwitched?.(version);
    
    console.log('🔄 Switched to version:', version);
  }, [state.versions, callbacks]);

  // Get version history for UI
  const getVersionHistory = useCallback(() => {
    return state.versions
      .sort((a, b) => b.version - a.version) // Most recent first
      .map(version => ({
        ...version,
        canSwitch: version.isValid,
        isCurrent: version.version === state.currentVersion
      }));
  }, [state.versions, state.currentVersion]);

  // Get current version info
  const getCurrentVersion = useCallback(() => {
    return state.versions.find(v => v.version === state.currentVersion) || null;
  }, [state.versions, state.currentVersion]);

  // Check if current version is the latest
  const isLatestVersion = useCallback(() => {
    if (state.versions.length === 0) return true;
    const latestVersion = Math.max(...state.versions.map(v => v.version));
    return state.currentVersion === latestVersion;
  }, [state.versions, state.currentVersion]);

  // Get version comparison data
  const getVersionComparison = useCallback(() => {
    const current = getCurrentVersion();
    const latest = state.versions.length > 0 
      ? state.versions.reduce((latest, v) => v.version > latest.version ? v : latest)
      : null;

    return {
      current,
      latest,
      isLatest: isLatestVersion(),
      totalVersions: state.versions.length,
      validVersions: state.versions.filter(v => v.isValid).length
    };
  }, [state.versions, getCurrentVersion, isLatestVersion]);

  // Clear branch error
  const clearBranchError = useCallback(() => {
    setState(prev => ({ ...prev, branchError: null }));
  }, []);

  // Get version summary for UI
  const getVersionSummary = useCallback(() => {
    const comparison = getVersionComparison();
    
    return {
      brandId: state.brandId,
      currentVersion: state.currentVersion,
      totalVersions: comparison.totalVersions,
      validVersions: comparison.validVersions,
      isLatest: comparison.isLatest,
      currentStep: comparison.current?.step || currentStep,
      lastUpdated: comparison.current?.timestamp || new Date()
    };
  }, [state.brandId, state.currentVersion, currentStep, getVersionComparison]);

  return {
    // State
    brandId: state.brandId,
    currentVersion: state.currentVersion,
    versions: state.versions,
    isCreatingBranch: state.isCreatingBranch,
    branchError: state.branchError,
    metadata: state.metadata,
    
    // Actions
    createBranch,
    switchVersion,
    clearBranchError,
    
    // Computed
    versionHistory: getVersionHistory(),
    currentVersionInfo: getCurrentVersion(),
    versionComparison: getVersionComparison(),
    versionSummary: getVersionSummary(),
    
    // Helpers
    isLatestVersion: isLatestVersion(),
    canCreateBranch: !state.isCreatingBranch,
    hasMultipleVersions: state.versions.length > 1
  };
};

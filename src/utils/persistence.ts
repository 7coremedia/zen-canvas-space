/**
 * Persistence Utilities for Brand Creation Wizard
 * 
 * Handles saving, loading, and validating brand creation data using localStorage.
 * Supports versioning, recovery, and data integrity checks.
 */

import { BrandData } from '@/types/brandData';
import { BrandCreationStep } from '@/types/aiResponse';

// Storage keys
const BRAND_DATA_KEY = 'brand_creation_data';
const BRAND_METADATA_KEY = 'brand_creation_metadata';
const SESSION_ID_KEY = 'brand_session_id';

// Data structure for persisted brand data
export interface PersistedBrandData {
  brandId: string;
  version: number;
  currentStep: BrandCreationStep;
  brandData: Partial<BrandData>;
  timestamp: Date;
  sessionId: string;
  isValid: boolean;
}

// Metadata for tracking all versions
export interface BrandMetadata {
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

/**
 * Generate a unique brand ID
 */
export const generateBrandId = (): string => {
  return `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get or create session ID
 */
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Validate brand data integrity
 */
export const validateBrandData = (data: Partial<BrandData>, step: BrandCreationStep): boolean => {
  try {
    // Basic structure validation
    if (typeof data !== 'object' || data === null) {
      return false;
    }

    // Step-specific validation
    switch (step) {
      case BrandCreationStep.IDEA_GATHERING:
        return !!(data.idea && data.idea.length >= 10 && data.idea.length <= 240);
      
      case BrandCreationStep.PRODUCT_SERVICE_DETAILS:
        return !!(data.product && data.product.features && data.product.features.length > 0);
      
      case BrandCreationStep.TARGET_AUDIENCE_DETAILS:
        return !!(data.audience && data.audience.segments && data.audience.segments.length > 0);
      
      case BrandCreationStep.USP_DEFINITION:
        return !!(data.usp && data.usp.pillars && data.usp.pillars.length >= 2);
      
      case BrandCreationStep.BRAND_PERSONALITY:
        return !!(data.personality && data.personality.archetypes && data.personality.archetypes.length > 0);
      
      case BrandCreationStep.KEYWORDS_COLLECTION:
        return !!(data.keywords && data.keywords.length >= 6 && data.keywords.length <= 10);
      
      case BrandCreationStep.NAME_PREFERENCES:
        return !!(data.naming && data.naming.stylePrefs && data.naming.stylePrefs.length > 0);
      
      case BrandCreationStep.NAME_GENERATION:
        return !!(data.naming && data.naming.candidates && data.naming.candidates.length >= 3);
      
      case BrandCreationStep.NAME_SELECTION:
        return !!(data.naming && data.naming.chosen);
      
      case BrandCreationStep.COLOR_PALETTE:
        return !!(data.colors && data.colors.palette && data.colors.palette.length > 0);
      
      case BrandCreationStep.LOGO_CONCEPT:
        return !!(data.logo && data.logo.directions && data.logo.directions.length > 0);
      
      case BrandCreationStep.TYPOGRAPHY:
        return !!(data.type && (data.type.headings || data.type.body));
      
      case BrandCreationStep.POSITIONING_STATEMENT:
        return !!(data.positioning && data.positioning.statement && data.positioning.statement.length > 0);
      
      case BrandCreationStep.BRAND_VOICE:
        return !!(data.voice && data.voice.principles && data.voice.principles.length > 0);
      
      case BrandCreationStep.MARKETING_STRATEGY:
        return !!(data.strategy && data.strategy.channels && data.strategy.channels.length > 0);
      
      case BrandCreationStep.BRAND_SUMMARY:
      case BrandCreationStep.NEXT_STEPS:
        // These steps don't require additional data validation
        return true;
      
      default:
        return true;
    }
  } catch (error) {
    console.error('Brand data validation error:', error);
    return false;
  }
};

/**
 * Save brand data to localStorage
 */
export const saveBrandData = (
  brandId: string,
  currentStep: BrandCreationStep,
  brandData: Partial<BrandData>,
  version: number = 1
): PersistedBrandData => {
  const sessionId = getSessionId();
  const timestamp = new Date();
  const isValid = validateBrandData(brandData, currentStep);

  const persistedData: PersistedBrandData = {
    brandId,
    version,
    currentStep,
    brandData,
    timestamp,
    sessionId,
    isValid
  };

  try {
    localStorage.setItem(BRAND_DATA_KEY, JSON.stringify(persistedData));
    
    // Update metadata
    updateBrandMetadata(brandId, version, currentStep, timestamp, isValid);
    
    console.log('✅ Brand data saved:', { brandId, version, step: currentStep, isValid });
    return persistedData;
  } catch (error) {
    console.error('❌ Failed to save brand data:', error);
    throw new Error('Failed to save brand data');
  }
};

/**
 * Load brand data from localStorage
 */
export const loadBrandData = (): PersistedBrandData | null => {
  try {
    const saved = localStorage.getItem(BRAND_DATA_KEY);
    if (!saved) {
      return null;
    }

    const data: PersistedBrandData = JSON.parse(saved);
    
    // Validate loaded data
    if (!data.brandId || !data.currentStep || !data.timestamp) {
      console.warn('⚠️ Invalid brand data structure');
      return null;
    }

    // Re-validate data integrity
    const isValid = validateBrandData(data.brandData, data.currentStep);
    if (!isValid && data.isValid) {
      console.warn('⚠️ Brand data validation failed on load');
      data.isValid = false;
    }

    console.log('📂 Brand data loaded:', { 
      brandId: data.brandId, 
      version: data.version, 
      step: data.currentStep, 
      isValid: data.isValid 
    });
    
    return data;
  } catch (error) {
    console.error('❌ Failed to load brand data:', error);
    return null;
  }
};

/**
 * Update brand metadata
 */
export const updateBrandMetadata = (
  brandId: string,
  version: number,
  step: BrandCreationStep,
  timestamp: Date,
  isValid: boolean
): void => {
  try {
    const existing = localStorage.getItem(BRAND_METADATA_KEY);
    let metadata: BrandMetadata;

    if (existing) {
      metadata = JSON.parse(existing);
      if (metadata.brandId !== brandId) {
        // New brand, create new metadata
        metadata = {
          brandId,
          versions: [],
          lastActiveVersion: version,
          createdAt: timestamp,
          updatedAt: timestamp
        };
      }
    } else {
      metadata = {
        brandId,
        versions: [],
        lastActiveVersion: version,
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }

    // Add or update version
    const versionIndex = metadata.versions.findIndex(v => v.version === version);
    const versionData = { version, step, timestamp, isValid };
    
    if (versionIndex >= 0) {
      metadata.versions[versionIndex] = versionData;
    } else {
      metadata.versions.push(versionData);
    }

    metadata.lastActiveVersion = version;
    metadata.updatedAt = timestamp;

    localStorage.setItem(BRAND_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('❌ Failed to update brand metadata:', error);
  }
};

/**
 * Get brand metadata
 */
export const getBrandMetadata = (): BrandMetadata | null => {
  try {
    const saved = localStorage.getItem(BRAND_METADATA_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('❌ Failed to load brand metadata:', error);
    return null;
  }
};

/**
 * Create a new version (branch) from current state
 */
export const createBrandVersion = (
  currentBrandData: Partial<BrandData>,
  currentStep: BrandCreationStep
): { brandId: string; version: number } => {
  const metadata = getBrandMetadata();
  const brandId = metadata?.brandId || generateBrandId();
  const version = metadata ? Math.max(...metadata.versions.map(v => v.version)) + 1 : 1;

  saveBrandData(brandId, currentStep, currentBrandData, version);
  
  console.log('🔄 Created new brand version:', { brandId, version });
  return { brandId, version };
};

/**
 * Clear all brand data (for testing/reset)
 */
export const clearBrandData = (): void => {
  try {
    localStorage.removeItem(BRAND_DATA_KEY);
    localStorage.removeItem(BRAND_METADATA_KEY);
    console.log('🗑️ Brand data cleared');
  } catch (error) {
    console.error('❌ Failed to clear brand data:', error);
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = (): { used: number; available: number; percentage: number } => {
  try {
    const dataSize = localStorage.getItem(BRAND_DATA_KEY)?.length || 0;
    const metadataSize = localStorage.getItem(BRAND_METADATA_KEY)?.length || 0;
    const totalUsed = dataSize + metadataSize;
    
    // Estimate available space (localStorage is typically 5-10MB)
    const estimatedAvailable = 5 * 1024 * 1024; // 5MB estimate
    const percentage = (totalUsed / estimatedAvailable) * 100;
    
    return {
      used: totalUsed,
      available: estimatedAvailable,
      percentage: Math.round(percentage * 100) / 100
    };
  } catch (error) {
    console.error('❌ Failed to get storage info:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
};

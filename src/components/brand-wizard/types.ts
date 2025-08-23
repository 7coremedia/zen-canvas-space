// Base types for brand data
export interface BrandData {
  id?: string;
  name?: string;
  description?: string;
  tagline?: string;
  industry?: string;
  targetAudience?: string;
  
  // Brand identity
  logo?: {
    type: 'upload' | 'generated';
    url: string;
    style?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  
  // Colors
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
    [key: string]: string; // For custom color roles
  };
  
  // Typography
  typography?: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
    scale: number;
    lineHeight: number;
    letterSpacing: number;
  };
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  isPublic?: boolean;
  
  // AI generation metadata
  aiGenerated?: boolean;
  generationPrompt?: string;
  generationDate?: string;
}

// Wizard step component props
export interface WizardStepProps {
  data: BrandData;
  onDataChange: (data: Partial<BrandData>) => void;
  brandId?: string;
}

// Wizard step definition
export interface BrandWizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<WizardStepProps>;
  hideInNav?: boolean;
}

// AI Generation types
export type BrandAspect = 'name' | 'logo' | 'colors' | 'typography';

export interface AIGenerationOptions {
  businessIdea?: string;
  industry?: string;
  targetAudience?: string;
  stylePreferences?: string[];
  colorPreferences?: string[];
  fontPreferences?: string[];
  existingBrandData?: Partial<BrandData>;
}

export interface HumanAssistanceRequest {
  brandId?: string;
  currentStep: string;
  userMessage: string;
  contactEmail: string;
  contactName?: string;
  brandData?: Partial<BrandData>;
  additionalInfo?: Record<string, any>;
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form field validation
export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: any) => boolean | string;
}

export interface FormField<T = any> {
  name: string;
  label: string;
  description?: string;
  type: 'text' | 'textarea' | 'select' | 'color' | 'font' | 'image' | 'file' | 'toggle' | 'range' | 'number';
  placeholder?: string;
  defaultValue?: T;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  validation?: ValidationRule;
  hidden?: boolean | ((values: Record<string, any>) => boolean);
  disabled?: boolean | ((values: Record<string, any>) => boolean);
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  required?: boolean;
  group?: string;
  groupClassName?: string;
  groupDescription?: string;
  groupCollapsible?: boolean;
  groupCollapsedByDefault?: boolean;
}

// Color palette types
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  [key: string]: string;
}

// Typography types
export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  baseSize: string;
  scale: number;
  lineHeight: number;
  letterSpacing: number;
}

// Logo types
export interface LogoData {
  type: 'upload' | 'generated';
  url: string;
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  brandName?: string;
  description?: string;
}

// Human assistance types
export interface HumanAssistanceRequestParams {
  brandId?: string;
  currentStep: string;
  userMessage: string;
  contactEmail: string;
  brandData?: any;
}

// AI service response types
export interface AIGenerationResponse {
  success: boolean;
  data: any;
  message?: string;
  error?: string;
}

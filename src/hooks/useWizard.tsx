import React, { createContext, useContext, useState, useEffect } from 'react';

interface WizardState {
  idea: string;
  industry: string;
  targetAudience: string;
  ageRange: string;
  location: string;
  formality: number;
  toneKeywords: string;
  brandMessage: string;
}

interface WizardContextType {
  wizardState: WizardState;
  updateField: (field: keyof WizardState, value: any) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const WIZARD_DRAFT_KEY = 'brandDraft_v1';

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    try {
      const savedDraft = localStorage.getItem(WIZARD_DRAFT_KEY);
      return savedDraft ? JSON.parse(savedDraft) : {
        idea: '',
        industry: '',
        targetAudience: '',
        ageRange: '',
        location: '',
        formality: 50,
        toneKeywords: '',
        brandMessage: ''
      };
    } catch (error) {
      console.error('Failed to parse wizard draft from localStorage', error);
      return {
        idea: '',
        industry: '',
        targetAudience: '',
        ageRange: '',
        location: '',
        formality: 50,
        toneKeywords: '',
        brandMessage: ''
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(wizardState));
    } catch (error) {
      console.error('Failed to save wizard draft to localStorage', error);
    }
  }, [wizardState]);

  const updateField = (field: keyof WizardState, value: any) => {
    setWizardState((prevState) => ({ ...prevState, [field]: value }));
  };

  const resetWizard = () => {
    setWizardState({
      idea: '',
      industry: '',
      targetAudience: '',
      ageRange: '',
      location: '',
      formality: 50,
      toneKeywords: '',
      brandMessage: ''
    });
  };

  return (
    <WizardContext.Provider value={{ wizardState, updateField, resetWizard }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

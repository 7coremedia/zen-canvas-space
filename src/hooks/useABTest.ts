import { useState, useEffect } from 'react';

export const useABTest = <T>(variants: T[], testKey: string): T => {
  const [selectedVariant, setSelectedVariant] = useState<T>(variants[0]);

  useEffect(() => {
    // Check if we already have a selection for this test
    const stored = localStorage.getItem(`ab-test-${testKey}`);
    
    if (stored) {
      const index = parseInt(stored);
      if (index >= 0 && index < variants.length) {
        setSelectedVariant(variants[index]);
        return;
      }
    }

    // Randomly select a variant and store it
    const randomIndex = Math.floor(Math.random() * variants.length);
    localStorage.setItem(`ab-test-${testKey}`, randomIndex.toString());
    setSelectedVariant(variants[randomIndex]);
  }, [variants, testKey]);

  return selectedVariant;
};

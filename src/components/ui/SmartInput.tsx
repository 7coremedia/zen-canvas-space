import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UIControls } from '@/types/aiResponse';
import { Check, Star } from 'lucide-react';

interface SmartInputProps {
  /** UI control specifications from AIResponse metadata */
  controls: UIControls | null;
  /** Callback when user submits input */
  onSubmit: (value: any) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * SmartInput Component
 * 
 * Renders different UI components based on controls.component:
 * - multilineText: Multiline text input
 * - multipleChoice: Radio/checkbox group
 * - ratingInput: 1-5 star selector
 * - selectionInput: Dropdown or tile grid
 * - confirmationInput: Yes/no buttons
 * 
 * Applies validation rules and disables Continue until valid.
 * 
 * Props:
 * - controls: UI control specifications
 * - onSubmit: Callback for user input
 * - className: Optional styling classes
 */
export const SmartInput: React.FC<SmartInputProps> = ({ 
  controls, 
  onSubmit, 
  className 
}) => {
  const [inputValue, setInputValue] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation logic
  const validateInput = (value: any): { isValid: boolean; errors: string[] } => {
    if (!controls?.validation) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];

    controls.validation.forEach(rule => {
      if (rule === 'required' && (!value || (Array.isArray(value) && value.length === 0))) {
        errors.push('This field is required');
      }

      if (rule.startsWith('minLength:')) {
        const minLength = parseInt(rule.split(':')[1]);
        if (typeof value === 'string' && value.length < minLength) {
          errors.push(`Minimum ${minLength} characters required`);
        }
      }

      if (rule.startsWith('maxLength:')) {
        const maxLength = parseInt(rule.split(':')[1]);
        if (typeof value === 'string' && value.length > maxLength) {
          errors.push(`Maximum ${maxLength} characters allowed`);
        }
      }

      if (rule.startsWith('minSelections:')) {
        const minSelections = parseInt(rule.split(':')[1]);
        if (Array.isArray(value) && value.length < minSelections) {
          errors.push(`Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`);
        }
      }

      if (rule.startsWith('maxSelections:')) {
        const maxSelections = parseInt(rule.split(':')[1]);
        if (Array.isArray(value) && value.length > maxSelections) {
          errors.push(`Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}`);
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  // Update validation when input changes
  useEffect(() => {
    const { isValid: valid, errors } = validateInput(inputValue);
    setIsValid(valid);
    setValidationErrors(errors);
  }, [inputValue, controls?.validation]);

  const handleSubmit = () => {
    if (isValid && inputValue !== null) {
      onSubmit(inputValue);
    }
  };

  // Render multiline text input
  const renderMultilineText = () => (
    <div className="space-y-3">
      <Textarea
        placeholder={controls?.config?.placeholder || "Enter your response..."}
        rows={controls?.config?.rows || 3}
        value={inputValue || ''}
        onChange={(e) => setInputValue(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      {validationErrors.length > 0 && (
        <div className="text-sm text-destructive">
          {validationErrors[0]}
        </div>
      )}
    </div>
  );

  // Render multiple choice (radio/checkbox)
  const renderMultipleChoice = () => {
    const options = controls?.config?.options || [];
    const isMultiSelect = controls?.config?.multiSelect || false;

    if (isMultiSelect) {
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            {options.map((option: any) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={Array.isArray(inputValue) && inputValue.includes(option.id)}
                  onCheckedChange={(checked) => {
                    const current = Array.isArray(inputValue) ? inputValue : [];
                    if (checked) {
                      setInputValue([...current, option.id]);
                    } else {
                      setInputValue(current.filter((id: string) => id !== option.id));
                    }
                  }}
                />
                <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-muted-foreground text-xs">{option.description}</div>
                  )}
                </Label>
              </div>
            ))}
          </div>
          {validationErrors.length > 0 && (
            <div className="text-sm text-destructive">
              {validationErrors[0]}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <RadioGroup
          value={inputValue || ''}
          onValueChange={setInputValue}
          className="space-y-2"
        >
          {options.map((option: any) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-muted-foreground text-xs">{option.description}</div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {validationErrors.length > 0 && (
          <div className="text-sm text-destructive">
            {validationErrors[0]}
          </div>
        )}
      </div>
    );
  };

  // Render rating input (1-5 stars)
  const renderRatingInput = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setInputValue(rating)}
            className={cn(
              "p-1 transition-colors",
              inputValue >= rating ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-300"
            )}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
      {inputValue && (
        <p className="text-sm text-muted-foreground">
          Rating: {inputValue} out of 5
        </p>
      )}
    </div>
  );

  // Render selection input (grid or dropdown)
  const renderSelectionInput = () => {
    const options = controls?.config?.options || [];
    const layout = controls?.config?.layout || 'grid';

    if (layout === 'grid') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {options.map((option: any) => (
              <Card
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  inputValue === option.id && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => setInputValue(option.id)}
              >
                <CardContent className="p-3 text-center">
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {validationErrors.length > 0 && (
            <div className="text-sm text-destructive">
              {validationErrors[0]}
            </div>
          )}
        </div>
      );
    }

    // Dropdown layout
    return (
      <div className="space-y-3">
        <select
          value={inputValue || ''}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select an option...</option>
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
        {validationErrors.length > 0 && (
          <div className="text-sm text-destructive">
            {validationErrors[0]}
          </div>
        )}
      </div>
    );
  };

  // Render confirmation input (yes/no buttons)
  const renderConfirmationInput = () => (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Button
          variant={inputValue === true ? "default" : "outline"}
          onClick={() => setInputValue(true)}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-2" />
          Yes
        </Button>
        <Button
          variant={inputValue === false ? "default" : "outline"}
          onClick={() => setInputValue(false)}
          className="flex-1"
        >
          No
        </Button>
      </div>
    </div>
  );

  // Render the appropriate component based on controls.component
  const renderInputComponent = () => {
    if (!controls) return null;

    switch (controls.component) {
      case 'multilineText':
        return renderMultilineText();
      case 'multipleChoice':
        return renderMultipleChoice();
      case 'ratingInput':
        return renderRatingInput();
      case 'selectionInput':
        return renderSelectionInput();
      case 'confirmationInput':
        return renderConfirmationInput();
      default:
        return <div className="text-muted-foreground">Unknown input type</div>;
    }
  };

  if (!controls) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {renderInputComponent()}
      
      <Button
        onClick={handleSubmit}
        disabled={!isValid || inputValue === null}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};


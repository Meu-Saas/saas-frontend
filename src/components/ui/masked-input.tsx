import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { applyMask, validate, getErrorMessage, MaskType } from '@/utils/masks';

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  maskType: MaskType;
  value: string;
  onChange: (maskedValue: string, isValid: boolean) => void;
  showError?: boolean;
  errorMessage?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, maskType, value, onChange, showError = true, errorMessage, ...props }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const [isValid, setIsValid] = React.useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const maskedValue = applyMask(rawValue, maskType);
      const valid = maskedValue ? validate(maskedValue, maskType) : true;
      setIsValid(valid);
      onChange(maskedValue, valid);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const showErrorState = showError && touched && !isValid && value;
    const displayErrorMessage = errorMessage || getErrorMessage(maskType);

    return (
      <div className="w-full">
        <Input
          ref={ref}
          className={cn(
            showErrorState && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {showErrorState && (
          <p className="text-sm text-red-500 mt-1">{displayErrorMessage}</p>
        )}
      </div>
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };

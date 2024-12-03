// File: Input.tsx
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onSubmit?: () => void; // New prop for handling Enter key
}

export const Input: React.FC<InputProps> = ({
  className,
  onSubmit,
  onKeyDown,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !props.disabled) {
      e.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    }

    // If there's an existing onKeyDown prop, call it
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <input
      className={`border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
      onKeyDown={handleKeyDown} // Attach the custom keyDown handler
    />
  );
};

export default Input;

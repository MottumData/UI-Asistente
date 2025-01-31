import React from 'react';
import classNames from 'classnames';
import { forwardRef } from 'react';

{/* Componente de tarjeta. */}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  onClick,
  hoverable = false,
}, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(
        'rounded-lg shadow-md bg-white transition-transform transform',
        {
          'hover:shadow-lg hover:scale-105 cursor-pointer': hoverable,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
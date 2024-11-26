import React from 'react';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={classNames(
        'rounded-lg p-4 shadow-md bg-white transition-transform transform',
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
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
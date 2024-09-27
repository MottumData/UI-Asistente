import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick}) => {
  return <div className={`border rounded-lg p-4 shadow-lg bg-white ${className}`} onClick={onClick}> {children}</div>;
};

export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
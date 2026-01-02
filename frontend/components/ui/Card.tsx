
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  noPadding?: boolean;
  glowing?: boolean;
  highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = false,
  noPadding = false,
  glowing = false,
  highlight = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        glass-panel rounded-lg overflow-hidden relative transition-all duration-300
        ${hoverEffect ? 'cursor-pointer hover:-translate-y-1 glass-panel-hover' : ''}
        ${glowing ? 'shadow-[0_0_30px_-10px_rgba(76,201,240,0.15)] border-primary/20' : ''}
        ${highlight ? 'border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(46,199,255,0.1)]' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;

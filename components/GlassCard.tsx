import React from 'react';
import { playSound } from '../utils/sound';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'filled' | 'outlined' | 'elevated' | 'flat';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = false,
  variant = 'filled' 
}) => {
  const handleMouseEnter = () => {
    if (hoverEffect) {
      playSound('hover');
    }
  };

  const handleClick = () => {
    if (onClick) {
      playSound('click');
      onClick();
    }
  };

  const baseStyles = "relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
  
  let variantStyles = "";
  switch (variant) {
    case 'elevated':
        variantStyles = "bg-white shadow-float border border-lobus-border";
        break;
    case 'outlined':
        variantStyles = "bg-transparent border-2 border-lobus-border";
        break;
    case 'flat':
        variantStyles = "bg-lobus-bg border border-transparent";
        break;
    case 'filled':
    default:
        variantStyles = "bg-white border border-lobus-border shadow-sm";
        break;
  }

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={`
        ${baseStyles}
        ${variantStyles}
        rounded-[32px]
        ${hoverEffect || onClick ? 'cursor-pointer active:scale-98 hover:shadow-glass-hover hover:border-lobus-secondary' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
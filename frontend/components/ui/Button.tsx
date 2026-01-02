
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none tracking-wide interactive touch-manipulation whitespace-nowrap";
  
  const variants = {
    primary: "bg-primary text-[#0E0E0F] hover:bg-white hover:shadow-[0_0_20px_rgba(76,201,240,0.5)] border border-transparent",
    secondary: "bg-secondary text-white hover:bg-secondary/90 hover:shadow-[0_0_15px_rgba(123,47,247,0.5)]",
    ghost: "bg-transparent text-text-muted hover:text-white hover:bg-white/5",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(46,199,255,0.2)]",
    outline: "bg-transparent border border-white/20 text-text-main hover:border-white/50 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs uppercase tracking-wider",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base font-semibold"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      ) : children}
    </button>
  );
};

export default Button;

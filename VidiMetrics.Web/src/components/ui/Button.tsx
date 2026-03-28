import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'light' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  wrapperClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref
  ) => {
    // Base styles that handle alignment, animation, and typography
    const baseStyles = 'inline-flex items-center justify-center gap-3 font-label font-bold uppercase tracking-widest transition-all duration-300 active:scale-95';

    // Variant-specific styles including colors, shadows, and hover effects
    const variants = {
      primary: 'bg-gradient-to-r from-[#7818c6] to-[#ddb7ff] text-white hover:brightness-110 shadow-lg rounded-md',
      secondary: 'glass-panel border border-white/10 text-white hover:bg-white/5 rounded-md',
      accent: 'bg-[#3da9fc] text-[#0b1326] shadow-[0_0_20px_rgba(61,169,252,0.2)] hover:shadow-[0_0_40px_rgba(61,169,252,0.4)] hover:brightness-110 rounded-xl', // Launch Engine style
      light: 'bg-[#f0f0f0] text-[#0b1326] shadow-xl hover:brightness-110 rounded-md',
      outline: 'border-2 border-[#7818c6]/50 text-white hover:border-[#7818c6] hover:bg-[#7818c6]/10 rounded-md'
    };

    // Size-specific dimensions and text sizing
    const sizes = {
      sm: 'px-6 py-2 text-[10px]',
      md: 'px-8 py-2.5 text-xs',
      lg: 'px-12 py-4 text-sm'
    };

    const classes = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </>
    );

    // Some buttons need an outer glow effect (like in TopNavBar)
    if (wrapperClassName) {
      return (
        <div className={`relative group inline-block ${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${variant === 'primary' ? 'from-[#7818c6] to-[#ddb7ff]' : 'from-primary to-secondary'} blur-md opacity-50 group-hover:opacity-100 transition-opacity rounded-md`}></div>
            <button ref={ref} className={`relative ${classes}`} {...props}>
              {buttonContent}
            </button>
        </div>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

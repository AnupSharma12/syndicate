'use client';

import { ReactNode } from 'react';

/* Shimmer Loading Component */
export const ShimmerButton = ({ 
  children, 
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" />
      {children}
    </button>
  );
};

/* Glow Card Component */
export const GlowCard = ({ 
  children, 
  className = '',
  delay = '0s'
}: { 
  children: ReactNode; 
  className?: string;
  delay?: string;
}) => {
  return (
    <div
      className={`glow rounded-lg border border-red-500/30 bg-gradient-to-br from-red-500/10 to-blue-500/10 p-6 backdrop-blur-sm ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};

/* Fade In Blur Component */
export const FadeInBlur = ({ 
  children, 
  className = '',
  duration = '0.6s'
}: { 
  children: ReactNode; 
  className?: string;
  duration?: string;
}) => {
  return (
    <div
      className={`fade-in-blur ${className}`}
      style={{ animationDuration: duration }}
    >
      {children}
    </div>
  );
};

/* Animated Label Component */
export const AnimatedLabel = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <label className={`underline-animate ${className}`}>
      {children}
    </label>
  );
};

/* Text Gradient Component */
export const TextGradient = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <span className={`text-gradient-animate ${className}`}>
      {children}
    </span>
  );
};

/* Pop In Component */
export const PopIn = ({ 
  children, 
  className = '',
  delay = '0s'
}: { 
  children: ReactNode; 
  className?: string;
  delay?: string;
}) => {
  return (
    <div
      className={`pop-in ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};

/* Gradient Border Component */
export const GradientBorderBox = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`gradient-border ${className}`}>
      {children}
    </div>
  );
};

/* Float Component */
export const Float = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`float ${className}`}>
      {children}
    </div>
  );
};

/* Spotlight Background Component */
export const SpotlightBg = ({ 
  children, 
  className = ''
}: { 
  children: ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`spotlight ${className}`}>
      {children}
    </div>
  );
};

/* Animated Input with Underline */
export const AnimatedInput = ({ 
  className = '',
  ...props 
}: { 
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div className="relative">
      <input
        className={`relative z-10 w-full bg-transparent border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-600 transition-colors ${className}`}
        {...props}
      />
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-red-600 to-blue-600 scale-x-0 transition-transform duration-300 origin-left" />
    </div>
  );
};

/* Animated Badge Component */
export const AnimatedBadge = ({ 
  children, 
  variant = 'blue',
  className = ''
}: { 
  children: ReactNode; 
  variant?: 'blue' | 'green' | 'red' | 'purple';
  className?: string;
}) => {
  const variantClasses = {
    blue: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
    green: 'bg-green-500/20 text-green-600 border-green-500/30',
    red: 'bg-red-500/20 text-red-600 border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  };

  return (
    <div className={`pop-in inline-block px-3 py-1 rounded-full border backdrop-blur-sm ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

/* Pulse Dot Component */
export const PulseDot = ({ 
  className = ''
}: { 
  className?: string;
}) => {
  return (
    <div className={`pulse inline-block h-2 w-2 rounded-full bg-red-500 ${className}`} />
  );
};

import classNames from 'classnames';
import React, { memo } from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: variant;
}

type variant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'lead' 
  | 'paragraph' 
  | 'small';

export const Typography: React.FC<TypographyProps> = memo(({ children, className, variant = 'paragraph' }) => {
  
  const labelCls = classNames('block antialiased font-sans leading-relaxed ', {
    [`${className}`]: !!className,
    'text-base font-extrabold': variant === 'lead',
    'text-sm font-medium': variant === 'paragraph',
    'text-xs': variant === 'small',
  });

  return(
    <div className={labelCls}>
      {children}
    </div>
  );
});

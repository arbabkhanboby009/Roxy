import React from 'react';
import { useStore } from '../hooks/useStore';

interface LogoProps {
  logoSrc?: string | null;
  className?: string;
  placeholderClassName?: string;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ logoSrc, className = 'w-14 h-14', placeholderClassName = 'bg-brand-blue-light', textClassName = 'text-xl text-brand-silver' }) => {
  const { shopDetails } = useStore();
  
  const logoToDisplay = logoSrc !== undefined ? logoSrc : shopDetails.logo;

  const initials = (shopDetails?.name || '')
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {logoToDisplay ? (
        <img src={logoToDisplay} alt={`${shopDetails.name} Logo`} className={`${className} object-contain`} />
      ) : (
        <div className={`${className} ${placeholderClassName} flex items-center justify-center font-serif font-bold`}>
          <span className={textClassName}>{initials}</span>
        </div>
      )}
    </>
  );
};

export default Logo;
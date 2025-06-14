import React from 'react';
import logo from '../../assets/favicon.svg';
import styles from './Logo.module.css';

interface LogoProps {
  height?: number | string;
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  height = 20, 
  className = '', 
  alt = 'Nemesis Logo' 
}: LogoProps) => {
  return (
    <img 
      src={logo} 
      alt={alt}
      className={`${styles.logo} ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
}

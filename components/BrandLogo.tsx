import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number | string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", size = "100%" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MyLobus Logo"
    >
      {/* Fondo: Rectángulo redondeado Amarillo Lobus */}
      <rect width="512" height="512" rx="128" fill="#FFD300" />
      
      {/* Silueta: Lobo/Escudo Abstracto en Azul Obsidian */}
      <path 
        d="M256 80L112 400L256 320L400 400L256 80Z" 
        fill="#003882" 
      />
      
      {/* Ojo/Detalle Central */}
      <circle cx="256" cy="200" r="24" fill="#FFD300" />
    </svg>
  );
};

export default BrandLogo;
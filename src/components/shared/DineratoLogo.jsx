import React from 'react';
import logoSrc from '../../assets/dinerato-logo.png';

export default function DineratoLogo({ className = "h-7", color = "black", alt = "DINE ERP" }) {
  // Determine mask background color
  let bgColorClass = "bg-[#141412]";
  if (color === "white" || color === "light") {
    bgColorClass = "bg-[#FAF9F5]";
  } else if (color === "orange" || color === "accent") {
    bgColorClass = "bg-[#C25E00]";
  } else if (color === "blue") {
    bgColorClass = "bg-[#2563EB]";
  } else if (color.startsWith("bg-") || color.startsWith("#")) {
    bgColorClass = color.startsWith("bg-") ? color : "";
  }

  const customStyle = color.startsWith("#") ? { backgroundColor: color } : {};

  return (
    <div 
      className={`inline-flex items-center ${className} select-none`}
      role="img"
      aria-label={alt}
    >
      <div 
        className={`h-full aspect-[800/188] ${bgColorClass}`}
        style={{
          ...customStyle,
          maskImage: `url(${logoSrc})`,
          WebkitMaskImage: `url(${logoSrc})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'left center',
          WebkitMaskPosition: 'left center',
        }}
      />
    </div>
  );
}

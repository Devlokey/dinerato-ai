import React from 'react'
import logoSrc from '../assets/dinerato-logo.png'

export default function DineratoLogo({ className = "h-7 sm:h-8", color = "black", alt = "Dinerato" }) {
  if (color === "black") {
    return (
      <div 
        className={`inline-flex items-center ${className} select-none`}
        role="img"
        aria-label={alt}
      >
        {/* CSS Mask rendering for solid black with crisp transparency */}
        <div 
          className="h-full aspect-[800/188] bg-[#141412]"
          style={{
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
    )
  }

  // White / Off-white color for dark backgrounds
  return (
    <div 
      className={`inline-flex items-center ${className} select-none`}
      role="img"
      aria-label={alt}
    >
      <div 
        className="h-full aspect-[800/188] bg-[#FAF9F5]"
        style={{
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
  )
}

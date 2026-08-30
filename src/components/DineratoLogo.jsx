import React from 'react'

export default function DineratoLogo({ className = "h-7 sm:h-8", color = "black", alt = "Dinerato" }) {
  // If color is black:
  // The original image has light/cream text on black background.
  // Using mask or CSS filter:
  // For black color: filter: invert(1) + mix-blend-mode: multiply (or CSS mask)
  
  if (color === "black") {
    return (
      <div 
        className={`inline-block ${className} aspect-[800/188] select-none`}
        role="img"
        aria-label={alt}
      >
        <div 
          className="w-full h-full bg-[#141412] transition-colors"
          style={{
            maskImage: `url('/dinerato-logo-original.png')`,
            WebkitMaskImage: `url('/dinerato-logo-original.png')`,
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
      className={`inline-block ${className} aspect-[800/188] select-none`}
      role="img"
      aria-label={alt}
    >
      <div 
        className="w-full h-full bg-[#FAF9F5] transition-colors"
        style={{
          maskImage: `url('/dinerato-logo-original.png')`,
          WebkitMaskImage: `url('/dinerato-logo-original.png')`,
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

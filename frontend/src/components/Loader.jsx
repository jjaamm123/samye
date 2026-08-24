import React from 'react';

/**
 * Luxury brand loader — elegant double-ring spinner with serif status text.
 * Drop-in replacement for any inline "Loading..." paragraph.
 *
 * @param {string} message - Optional override for the status label.
 * @param {string} className - Optional extra classes for the wrapper.
 */
const Loader = ({ message = 'Loading journeys...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-24 min-h-[300px] w-full ${className}`}>
      {/* Elegant double-ring spinner */}
      <div className="relative w-12 h-12 mb-5">
        {/* Static outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#e2d9cc]" />
        {/* Animated inner arc */}
        <div className="absolute inset-0 rounded-full border-2 border-[#9c826b] border-t-transparent animate-spin" />
      </div>

      {/* Clean typographic status label */}
      <p className="text-[#8c7867] font-serif text-sm tracking-widest uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;

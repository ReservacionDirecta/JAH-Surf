import React from 'react';

export const BrandName = ({ className = "", showSurf = true, surfColor = "text-sky-300" }: { className?: string, showSurf?: boolean, surfColor?: string }) => {
  return (
    <span className={`font-display font-black uppercase tracking-tighter drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] ${className}`}>
      <span className="text-red-500">J</span>
      <span className="text-amber-300">A</span>
      <span className="text-emerald-400">H</span>
      {showSurf && (
        <>
          {' '}
          <span className={surfColor}>SURF</span>
        </>
      )}
    </span>
  );
};

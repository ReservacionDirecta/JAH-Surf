import React from 'react';

export const BrandName = ({ className = "", showSurf = true, surfColor = "text-gree-600" }: { className?: string, showSurf?: boolean, surfColor?: string }) => {
  return (
    <span className={`font-display font-black uppercase tracking-tighter ${className}`}>
      <span className="text-red-600">J</span>
      <span className="text-yellow-500">A</span>
      <span className="text-green-600">H</span>
      {showSurf && (
        <>
          {' '}
          <span className={surfColor}>SURF</span>
        </>
      )}
    </span>
  );
};

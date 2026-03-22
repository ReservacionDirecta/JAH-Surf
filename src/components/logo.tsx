import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  shape = 'circle',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-[10px]',
    md: 'w-16 h-16 text-[14px]',
    lg: 'w-32 h-32 text-[28px]',
    xl: 'w-64 h-64 text-[56px]',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-[20%]',
  };

  return (
    <div className={`flex items-center justify-center bg-[#1a1c23] shadow-2xl overflow-hidden border border-white/5 ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}>
      <div className="flex flex-col items-center justify-center leading-[0.9] font-display font-black uppercase tracking-tighter">
        <div className="flex">
          <span className="text-[#ff3b3b]">J</span>
          <span className="text-[#ffcc00]">A</span>
          <span className="text-[#00df81]">H</span>
        </div>
        <div className="text-[#40c4ff]">SURF</div>
      </div>
    </div>
  );
};

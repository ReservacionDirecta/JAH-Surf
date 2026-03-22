import React from 'react';
import { Logo } from './logo';

export const BrandName = ({ className = "", showSurf = true, surfColor = "text-sky-300" }: { className?: string, showSurf?: boolean, surfColor?: string }) => {
  void showSurf;
  void surfColor;

  return <Logo size="sm" shape="circle" className={className} />;
};

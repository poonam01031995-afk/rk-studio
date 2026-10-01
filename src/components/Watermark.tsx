import React from 'react';

interface WatermarkProps {
  show: boolean;
  text?: string;
  logoUrl?: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ 
  show, 
  text = 'RK INSTITUTE', 
  logoUrl = '/rk-assets/rk-logo.png' 
}) => {
  if (!show) return null;

  return (
    <div 
      className="watermark-container absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center opacity-[0.032] transform -rotate-12">
        <img 
          src={logoUrl} 
          alt="" 
          className="w-80 h-80 object-contain grayscale"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="text-4xl font-black tracking-widest text-slate-900 mt-2 font-heading">
          {text}
        </div>
      </div>
    </div>
  );
};

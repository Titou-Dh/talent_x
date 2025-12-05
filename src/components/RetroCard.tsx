import React from 'react';

export const RetroCard = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`relative border-2 border-gray-700 bg-black p-6 overflow-hidden group hover:border-white transition-all duration-300 ${className}`}>
    {/* Corner accents */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
    
    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-3 h-3 bg-white animate-pulse" />
    </div>
    {children}
  </div>
);

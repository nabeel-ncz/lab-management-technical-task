import React from 'react';

interface DropIndicatorProps {
  isVisible: boolean;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex-shrink-0 w-2 mx-2 relative">
      <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-blue-500 rounded-full opacity-75 animate-pulse" />
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-75" />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-75" />
    </div>
  );
}; 
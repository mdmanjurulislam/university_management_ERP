import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingProps {
  className?: string;
  size?: number;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  className, 
  size = 40, 
  fullScreen = false 
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <Loader2 size={size} className="animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

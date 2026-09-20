import React from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] bg-[#30312f] text-[#f2f0ee] px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-2 border border-white/10">
      <span className="material-symbols-outlined text-[18px] text-[#fedeb2]">
        check_circle
      </span>
      <span className="font-sans text-[13px] font-medium tracking-wide">
        {message}
      </span>
    </div>
  );
};

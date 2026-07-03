import React from 'react';

export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-[#30363D]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent
                        border-t-[#00D9B8] animate-spin" />
      </div>
      <p className="text-sm text-[#8B949E]">{message}</p>
    </div>
  );
}
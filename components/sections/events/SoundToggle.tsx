'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getSoundEnabled, setSoundEnabled } from '@/lib/audio/scanSound';

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getSoundEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={enabled ? 'Mute event scan audio' : 'Unmute event scan audio'}
      title={enabled ? 'Audio effects ON' : 'Audio effects MUTED'}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
    >
      {enabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#3FA85B]" />
          <span className="text-[11px] font-bold">FX ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-400">MUTED</span>
        </>
      )}
    </button>
  );
};

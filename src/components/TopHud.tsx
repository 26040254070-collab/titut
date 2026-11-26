import React from 'react';
import { Award, BookOpen, HelpCircle, Volume2, VolumeX } from 'lucide-react';

interface TopHudProps {
  solvedCount: number;
  totalCases: number;
  score: number;
  muted: boolean;
  hoveredLabel: string | null;
  onToggleMute: () => void;
  onOpenArchive: () => void;
  onOpenReport: () => void;
  onOpenPause: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  solvedCount,
  totalCases,
  score,
  muted,
  hoveredLabel,
  onToggleMute,
  onOpenArchive,
  onOpenReport,
  onOpenPause,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 p-4 md:px-6 pointer-events-none flex items-start justify-between gap-4">
      {/* Left: Brand & Progress */}
      <div className="pointer-events-auto flex items-center gap-4 px-4 py-2.5 rounded-xl bg-[#0e1521]/92 border border-slate-700/50">
        <div>
          <div className="font-display text-sm font-bold text-slate-100 whitespace-nowrap">
            Detektif Jejak Digital
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
            <span>
              Kasus:{' '}
              <strong className="font-mono-num text-emerald-400">
                {solvedCount}/{totalCases}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Skor Integritas:{' '}
              <strong className="font-mono-num text-amber-400">{score}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Dynamic 3D Hover Tooltip (only appears when hovering an artifact) */}
      {hoveredLabel && (
        <div className="hidden md:flex items-center px-4 py-2 rounded-lg bg-[#0e1521]/95 border border-amber-400/50 text-xs font-medium text-amber-200 whitespace-nowrap">
          {hoveredLabel} — Klik untuk periksa bukti
        </div>
      )}

      {/* Right: Functional Utility Actions */}
      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-[#0e1521]/92 border border-slate-700/50 hover:border-amber-400/60 hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          title="Buka Ensiklopedia Materi (a-g) & Sumber"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Materi & Sumber</span>
        </button>

        <button
          type="button"
          onClick={onOpenReport}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-[#0e1521]/92 border border-slate-700/50 hover:border-emerald-400/60 hover:text-emerald-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          title="Lihat Rapor Detektif"
        >
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Rapor</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Aktifkan suara' : 'Bisukan suara'}
          className="p-2 rounded-lg text-slate-300 bg-[#0e1521]/92 border border-slate-700/50 hover:border-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onOpenPause}
          aria-label="Panduan & Jeda"
          className="p-2 rounded-lg text-slate-300 bg-[#0e1521]/92 border border-slate-700/50 hover:border-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

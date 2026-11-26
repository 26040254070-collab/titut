import React from 'react';
import { Check, ChevronDown, ChevronUp, Compass, Eye } from 'lucide-react';
import { InvestigationCase } from '../data/casesData';
import { CameraPreset } from '../scene/DetectiveSceneManager';

interface BottomDockProps {
  cases: InvestigationCase[];
  solvedIds: string[];
  activeCaseId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectCase: (caseId: string) => void;
  onCameraPreset: (preset: CameraPreset) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  cases,
  solvedIds,
  activeCaseId,
  collapsed,
  onToggleCollapse,
  onSelectCase,
  onCameraPreset,
}) => {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center max-w-[94vw] transition-transform duration-200 ${
        collapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Handle */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-medium text-slate-300 bg-[#0e1521]/95 border border-b-0 border-slate-700/60 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
      >
        {collapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Tampilkan Kontrol (H)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Sembunyikan Kontrol (H)</span>
          </>
        )}
      </button>

      {/* Main Dock Container (solid/rgba surface, no backdrop-filter) */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0e1521]/94 border border-slate-700/60 shadow-2xl">
        {/* 7 Case Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {cases.map((c) => {
            const isSolved = solvedIds.includes(c.id);
            const isActive = activeCaseId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCase(c.id)}
                title={`Kasus ${c.caseNumber} (${c.topicCode}): ${c.topicTitle}`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                    : isSolved
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:border-emerald-400'
                      : 'bg-slate-900/90 text-slate-200 border-slate-700/70 hover:border-amber-400/60 hover:text-amber-200'
                }`}
              >
                <span className="font-mono-num">
                  {c.caseNumber}.{c.topicCode}
                </span>
                <span className="hidden lg:inline max-w-[115px] truncate">
                  {c.topicTitle}
                </span>
                {isSolved && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block w-px h-6 bg-slate-700/70 mx-1" aria-hidden="true" />

        {/* Camera Presets */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onCameraPreset('desk')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-900/90 border border-slate-700/70 hover:border-slate-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Meja Utama</span>
          </button>
          <button
            type="button"
            onClick={() => onCameraPreset('board')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-900/90 border border-slate-700/70 hover:border-slate-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Papan Bukti</span>
          </button>
        </div>
      </div>
    </div>
  );
};

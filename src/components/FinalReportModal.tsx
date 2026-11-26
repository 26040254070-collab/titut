import React from 'react';
import { Award, CheckCircle2, RotateCcw, Shield, X } from 'lucide-react';
import { InvestigationCase } from '../data/casesData';

interface FinalReportModalProps {
  cases: InvestigationCase[];
  solvedIds: string[];
  score: number;
  onClose: () => void;
  onResetGame: () => void;
  onSelectCase: (caseId: string) => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  cases,
  solvedIds,
  score,
  onClose,
  onResetGame,
  onSelectCase,
}) => {
  const allSolved = solvedIds.length === cases.length;
  const rank =
    solvedIds.length === 7
      ? 'Inspektur Utama Smart Citizen'
      : solvedIds.length >= 4
        ? 'Detektif Madya Literasi Digital'
        : 'Penyelidik Muda Ruang Siber';

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 md:p-6 bg-[#06090f]/82"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-[#111824] border border-slate-700/70 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d131d]">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2
              id="report-modal-title"
              className="font-display text-lg font-bold text-slate-50"
            >
              Rapor Detektif Smart Citizen
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup rapor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-6 flex flex-col gap-5">
          {/* Summary Banner */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-amber-400 font-medium mb-1">
                {allSolved ? 'Seluruh Misi Selesai' : 'Progres Investigasi Berjalan'}
              </div>
              <div className="font-display text-2xl font-bold text-slate-50">
                {rank}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-slate-400">Kasus Tuntas</div>
                <div className="font-mono-num text-2xl font-bold text-emerald-400">
                  {solvedIds.length}/{cases.length}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Skor Integritas</div>
                <div className="font-mono-num text-2xl font-bold text-amber-400">
                  {score}
                </div>
              </div>
            </div>
          </div>

          {/* 7 Badges & Topics Checklist */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-3">
              Pencapaian Materi & Lencana (a–g)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cases.map((c) => {
                const solved = solvedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectCase(c.id);
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                      solved
                        ? 'bg-emerald-950/35 border-emerald-700/60 hover:border-emerald-400'
                        : 'bg-slate-900/70 border-slate-800 hover:border-amber-400/50'
                    }`}
                  >
                    {solved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-mono-num text-slate-400">
                        Materi ({c.topicCode}) · Kasus 0{c.caseNumber}
                      </div>
                      <div className="text-xs font-semibold text-slate-100 leading-snug mt-0.5">
                        {c.topicTitle}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          solved ? 'text-emerald-300' : 'text-slate-500'
                        }`}
                      >
                        {solved ? `Lencana: ${c.badgeEarned}` : 'Belum diselesaikan'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-[#0d131d]">
          <button
            type="button"
            onClick={onResetGame}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-red-300 bg-red-950/40 border border-red-800/50 hover:bg-red-900/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Misi dari Awal</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
          >
            Lanjutkan Eksplorasi 3D
          </button>
        </div>
      </div>
    </div>
  );
};

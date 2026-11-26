import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, X } from 'lucide-react';
import { InvestigationCase } from '../data/casesData';

interface KnowledgeArchiveModalProps {
  cases: InvestigationCase[];
  solvedIds: string[];
  onClose: () => void;
  onJumpToCase: (caseId: string) => void;
}

export const KnowledgeArchiveModal: React.FC<KnowledgeArchiveModalProps> = ({
  cases,
  solvedIds,
  onClose,
  onJumpToCase,
}) => {
  const [selectedId, setSelectedId] = useState<string>(cases[0].id);
  const current = cases.find((c) => c.id === selectedId) || cases[0];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 md:p-6 bg-[#06090f]/82"
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-modal-title"
    >
      <div className="w-full max-w-5xl max-h-[88vh] flex flex-col rounded-2xl bg-[#111824] border border-slate-700/70 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-[#0d131d]">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h2
                id="archive-modal-title"
                className="font-display text-lg font-bold text-slate-50"
              >
                Ensiklopedia Materi Smart Citizen & Sumber Akurat
              </h2>
              <p className="text-xs text-slate-400">
                Cakupan materi wajib (a–g) beserta rujukan resmi & kanal cek fakta
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup arsip materi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Topic List */}
          <nav className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-800 bg-[#0e141f] overflow-y-auto custom-scroll p-3 flex flex-col gap-1.5">
            {cases.map((c) => {
              const active = c.id === current.id;
              const solved = solvedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`text-left px-3.5 py-2.5 rounded-lg border transition-colors cursor-pointer flex items-start justify-between gap-2 ${
                    active
                      ? 'bg-amber-500/15 border-amber-400/60 text-amber-200'
                      : 'bg-transparent border-transparent text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-mono-num text-amber-400 mb-0.5">
                      Bagian {c.topicCode.toUpperCase()} · Kasus 0{c.caseNumber}
                    </div>
                    <div className="text-xs font-medium leading-snug">
                      {c.topicTitle}
                    </div>
                  </div>
                  {solved && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Detail Reading Pane */}
          <div className="md:col-span-8 overflow-y-auto custom-scroll p-6 flex flex-col gap-5">
            <div>
              <div className="text-xs text-amber-400 font-medium mb-1">
                Cakupan Materi ({current.topicCode}) · {current.artifactName}
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-50 mb-2">
                {current.topicTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {current.briefing}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {current.materialPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800"
                >
                  <h4 className="text-sm font-semibold text-slate-100 mb-1.5">
                    {pt.heading}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pt.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Examples from Evidence Clues */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-xs font-semibold text-amber-400 mb-2.5">
                Contoh Kasus & Analisis Forensik
              </div>
              <div className="flex flex-col gap-2.5">
                {current.evidenceClues.map((clue) => (
                  <div
                    key={clue.id}
                    className="text-xs text-slate-300 pb-2.5 border-b border-slate-800/80 last:border-b-0 last:pb-0"
                  >
                    <div className="font-semibold text-slate-100 mb-0.5">
                      {clue.label}
                    </div>
                    <div className="italic text-slate-400 mb-1">{clue.excerpt}</div>
                    <div>{clue.analysis}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-800/40">
              <div className="text-xs font-semibold text-emerald-400 mb-2">
                Daftar Sumber Akurat & Lembaga Resmi
              </div>
              <ul className="flex flex-col gap-2.5">
                {current.sources.map((src, i) => (
                  <li key={i} className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-100">{src.title}</span>
                    <div className="text-slate-400">
                      {src.institution} · {src.yearOrNote}
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 underline mt-0.5"
                      >
                        <span>{src.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => onJumpToCase(current.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Periksa Kasus 0{current.caseNumber} di Meja 3D
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

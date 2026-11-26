import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onOpenArchive: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenArchive }) => {
  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10 pointer-events-none bg-gradient-to-t from-[#080c13]/90 via-[#080c13]/35 to-[#080c13]/75">
      {/* Top quiet header */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="text-xs tracking-wide text-slate-400">
          Pembelajaran Berbasis Game · Pendidikan Kewarganegaraan Digital
        </div>
        <button
          type="button"
          onClick={onOpenArchive}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 bg-[#121926]/90 border border-slate-700/60 hover:border-amber-400/60 hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Arsip Materi & Sumber</span>
        </button>
      </div>

      {/* Center-left hero lockup leaving 3D desk visible */}
      <div className="max-w-xl my-auto pointer-events-auto">
        {/* Bespoke inline SVG Detective Emblem & Title Lockup */}
        <div className="mb-5">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="mb-4"
          >
            <path
              d="M32 5L55 14V31C55 45.2 45.1 55.9 32 60C18.9 55.9 9 45.2 9 31V14L32 5Z"
              fill="#111927"
              stroke="#E5A93C"
              strokeWidth="2.2"
            />
            <circle cx="30" cy="30" r="10.5" stroke="#38BDF8" strokeWidth="2.2" />
            <path
              d="M37.5 37.5L45 45"
              stroke="#E5A93C"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M26 30L29 33L35 26.5"
              stroke="#10B981"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-sm font-medium text-amber-400 mb-2">
            Misi Investigasi Smart Citizen
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-50 leading-[1.12]">
            Detektif Jejak Digital
          </h1>
        </div>

        <p className="text-slate-300 text-base leading-relaxed max-w-lg mb-7">
          Menjadi warga negara yang cerdas, kritis, dan beretika di era digital.
          Selidiki 7 berkas forensik pada meja investigasi 3D untuk membedah karakter
          warga cerdas, dimensi kecerdasan, metode SIFT, etika ruang siber, hingga
          penanganan hoaks beserta sumber resminya.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-lg"
          >
            <span>Mulai Investigasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Single flat control hint line */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Enter / Spasi Mulai · Klik Objek 3D · Seret Putar Kamera · Angka 1–7 Pilih Kasus · H Sembunyikan Kontrol
        </span>
      </div>
    </div>
  );
};

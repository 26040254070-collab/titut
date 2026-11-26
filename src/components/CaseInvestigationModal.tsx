import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { InvestigationCase } from '../data/casesData';
import { soundFX } from '../audio/soundEffects';

interface CaseInvestigationModalProps {
  caseData: InvestigationCase;
  alreadySolved: boolean;
  onClose: () => void;
  onSolveCase: (caseId: string, pointsEarned: number) => void;
}

export const CaseInvestigationModal: React.FC<CaseInvestigationModalProps> = ({
  caseData,
  alreadySolved,
  onClose,
  onSolveCase,
}) => {
  const [stage, setStage] = useState<'evidence' | 'questions' | 'completed'>(
    alreadySolved ? 'completed' : 'evidence'
  );
  const [inspectedClues, setInspectedClues] = useState<Record<string, 'flag' | 'valid'>>({});
  const [clueFeedback, setClueFeedback] = useState<{
    clueId: string;
    correct: boolean;
    message: string;
  } | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wrongAttemptsOnCurrent, setWrongAttemptsOnCurrent] = useState(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);

  // Reset internal state when switching case
  useEffect(() => {
    setStage(alreadySolved ? 'completed' : 'evidence');
    setInspectedClues({});
    setClueFeedback(null);
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setWrongAttemptsOnCurrent(0);
    setAccumulatedPoints(0);
  }, [caseData.id, alreadySolved]);

  const foundRedFlagsCount = caseData.evidenceClues.filter(
    (c) => c.isRedFlag && inspectedClues[c.id] === 'flag'
  ).length;

  const allCluesChecked = caseData.evidenceClues.every((c) => {
    if (c.isRedFlag) return inspectedClues[c.id] === 'flag';
    return inspectedClues[c.id] === 'valid';
  });

  const canProceedToQuestions = foundRedFlagsCount >= caseData.requiredRedFlags;

  const handleClassifyClue = (clueId: string, choice: 'flag' | 'valid') => {
    const clue = caseData.evidenceClues.find((c) => c.id === clueId);
    if (!clue) return;

    const isMatch =
      (choice === 'flag' && clue.isRedFlag) || (choice === 'valid' && !clue.isRedFlag);

    if (isMatch) {
      soundFX.playClueFound();
      setInspectedClues((prev) => ({ ...prev, [clueId]: choice }));
      setClueFeedback({
        clueId,
        correct: true,
        message: clue.analysis,
      });
    } else {
      soundFX.playWrong();
      setClueFeedback({
        clueId,
        correct: false,
        message: clue.isRedFlag
          ? 'Perhatikan kembali: pernyataan ini mengandung kekeliruan konsep, bias, atau indikator bahaya digital!'
          : 'Tinjau ulang: pernyataan ini justru selaras dengan prinsip Smart Citizen yang valid.',
      });
    }
  };

  const currentQuestion = caseData.questions[questionIndex];

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    const option = currentQuestion.options.find((o) => o.id === optionId);
    if (!option) return;

    setSelectedOptionId(optionId);
    if (option.isCorrect) {
      soundFX.playCorrect();
      const qPoints = wrongAttemptsOnCurrent === 0 ? 150 : 75;
      setAccumulatedPoints((p) => p + qPoints);
    } else {
      soundFX.playWrong();
      setWrongAttemptsOnCurrent((w) => w + 1);
    }
  };

  const selectedOption = currentQuestion?.options.find((o) => o.id === selectedOptionId);

  const handleNextQuestion = () => {
    if (questionIndex + 1 < caseData.questions.length) {
      setQuestionIndex((i) => i + 1);
      setSelectedOptionId(null);
      setWrongAttemptsOnCurrent(0);
    } else {
      const totalEarned = accumulatedPoints + foundRedFlagsCount * 40 + 100;
      soundFX.playCaseSolved();
      setStage('completed');
      if (!alreadySolved) {
        onSolveCase(caseData.id, totalEarned);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 md:p-6 bg-[#06090f]/82"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
    >
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#111824] border border-slate-700/70 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-[#0d131d]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>Kasus 0{caseData.caseNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Materi ({caseData.topicCode})</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 truncate">{caseData.artifactName}</span>
            </div>
            <h2
              id="case-modal-title"
              className="font-display text-lg md:text-xl font-bold text-slate-50 truncate"
            >
              {caseData.topicTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup jendela investigasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Tabs */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#0f1520] border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStage('evidence')}
              className={`font-medium transition-colors cursor-pointer ${
                stage === 'evidence'
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Bedah Bukti & Materi
            </button>
            <span className="text-slate-600" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              disabled={!canProceedToQuestions && !alreadySolved}
              onClick={() => {
                if (canProceedToQuestions || alreadySolved) setStage('questions');
              }}
              className={`font-medium transition-colors ${
                stage === 'questions'
                  ? 'text-amber-400'
                  : canProceedToQuestions || alreadySolved
                    ? 'text-slate-400 hover:text-slate-200 cursor-pointer'
                    : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              2. Putusan Detektif
            </button>
            <span className="text-slate-600" aria-hidden="true">
              /
            </span>
            <span
              className={`font-medium ${
                stage === 'completed' ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              3. Kesimpulan & Lencana
            </span>
          </div>

          <div className="font-mono-num text-slate-400 hidden sm:block">
            Indikator ditemukan: {foundRedFlagsCount}/{caseData.requiredRedFlags}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scroll p-6">
          {stage === 'evidence' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Forensic Evidence Sheet */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Pengarahan Misi</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {caseData.briefing}
                  </p>
                </div>

                {/* Simulated Artifact Document */}
                <div className="rounded-xl bg-[#f7f3ea] text-slate-900 border border-amber-900/20 p-5 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-300 text-xs text-slate-600">
                    <div className="font-semibold text-slate-900">
                      {caseData.evidenceTitle}
                    </div>
                    <div className="font-mono-num">
                      {caseData.evidenceSender} · {caseData.evidenceTimestamp}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    Periksa setiap temuan di bawah ini: tandai mana yang merupakan{' '}
                    <strong>Indikator Masalah / Kekeliruan</strong> dan mana yang{' '}
                    <strong>Pernyataan / Praktik Valid</strong>.
                  </p>

                  <div className="flex flex-col gap-3">
                    {caseData.evidenceClues.map((clue) => {
                      const resolved = inspectedClues[clue.id];
                      const isThisFeedback = clueFeedback?.clueId === clue.id;

                      return (
                        <div
                          key={clue.id}
                          className={`p-3.5 rounded-lg border transition-colors ${
                            resolved === 'flag'
                              ? 'bg-red-50 border-red-300'
                              : resolved === 'valid'
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-white border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-600 mb-1">
                            {clue.label}
                          </div>
                          <p className="text-sm text-slate-900 font-medium leading-relaxed mb-3">
                            {clue.excerpt}
                          </p>

                          {!resolved ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleClassifyClue(clue.id, 'flag')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Tandai Indikator Masalah</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleClassifyClue(clue.id, 'valid')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Verifikasi Valid</span>
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`flex items-start gap-2 text-xs leading-relaxed ${
                                resolved === 'flag' ? 'text-red-800' : 'text-emerald-800'
                              }`}
                            >
                              {resolved === 'flag' ? (
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                              )}
                              <div>
                                <span className="font-semibold">
                                  {resolved === 'flag'
                                    ? 'Indikator Masalah Teridentifikasi: '
                                    : 'Terverifikasi Valid: '}
                                </span>
                                {clue.analysis}
                              </div>
                            </div>
                          )}

                          {!resolved && isThisFeedback && !clueFeedback.correct && (
                            <div className="mt-2.5 p-2 rounded bg-amber-100 border border-amber-300 text-xs text-amber-900">
                              {clueFeedback.message}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Core Material & Accurate Sources */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>Ringkasan Materi Inti</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {caseData.materialPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="pb-3 border-b border-slate-800 last:border-b-0 last:pb-0"
                      >
                        <h3 className="text-sm font-semibold text-slate-100 mb-1">
                          {pt.heading}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {pt.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 mb-2.5">
                    Sumber Referensi Akurat
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {caseData.sources.map((src, i) => (
                      <li key={i} className="text-xs text-slate-300 leading-snug">
                        <div className="font-medium text-slate-100">{src.title}</div>
                        <div className="text-slate-400 mt-0.5">
                          {src.institution} · {src.yearOrNote}
                        </div>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 mt-0.5 underline"
                          >
                            <span>{src.url}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {stage === 'questions' && currentQuestion && (
            <div className="max-w-2xl mx-auto py-4">
              <div className="text-xs text-slate-400 mb-2 font-mono-num">
                Pertanyaan Analisis {questionIndex + 1} dari {caseData.questions.length}
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-slate-50 leading-snug mb-6">
                {currentQuestion.prompt}
              </h3>

              <div className="flex flex-col gap-3 mb-6">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let styleClass =
                    'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-amber-400/60';
                  if (isSelected) {
                    styleClass = opt.isCorrect
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                      : 'bg-red-950/80 border-red-500 text-red-100';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={selectedOption?.isCorrect}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer disabled:cursor-default ${styleClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono-num text-xs font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 mt-0.5">
                          {opt.id}
                        </span>
                        <span className="text-sm leading-relaxed">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedOption && (
                <div
                  className={`p-4 rounded-xl border text-sm leading-relaxed mb-6 ${
                    selectedOption.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-700/70 text-amber-200'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    {selectedOption.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Analisis Tepat!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Perlu Ditinjau Ulang</span>
                      </>
                    )}
                  </div>
                  <p>{selectedOption.feedback}</p>
                </div>
              )}

              {selectedOption?.isCorrect && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <span>
                      {questionIndex + 1 < caseData.questions.length
                        ? 'Pertanyaan Berikutnya'
                        : 'Selesaikan Kasus'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {stage === 'completed' && (
            <div className="max-w-2xl mx-auto py-6 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-600/60 text-emerald-400 mb-4">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-50 mb-2">
                Kasus 0{caseData.caseNumber} Terpecahkan
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Anda berhasil menguasai materi{' '}
                <strong className="text-amber-300">{caseData.topicTitle}</strong> dan
                memperoleh lencana{' '}
                <strong className="text-emerald-300">{caseData.badgeEarned}</strong>.
              </p>

              <div className="text-left p-5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
                <div className="text-xs font-semibold text-sky-400 mb-3">
                  Poin Kunci yang Telah Diverifikasi
                </div>
                <ul className="flex flex-col gap-2.5">
                  {caseData.materialPoints.map((m, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-slate-100">{m.heading}:</strong> {m.summary}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStage('evidence');
                    setQuestionIndex(0);
                    setSelectedOptionId(null);
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                >
                  Tinjau Ulang Bukti
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
                >
                  Kembali ke Meja 3D
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar during Evidence Stage */}
        {stage === 'evidence' && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-800 bg-[#0d131d]">
            <div className="text-xs text-slate-400">
              {allCluesChecked
                ? 'Semua bukti telah diperiksa. Lanjutkan ke tahap Putusan Detektif.'
                : canProceedToQuestions
                  ? 'Indikator masalah minimal sudah ditemukan. Anda siap lanjut ke Putusan Detektif.'
                  : `Temukan minimal ${caseData.requiredRedFlags} indikator masalah pada bukti untuk membuka Putusan Detektif.`}
            </div>
            <button
              type="button"
              disabled={!canProceedToQuestions && !alreadySolved}
              onClick={() => {
                soundFX.playSelect();
                setStage('questions');
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                canProceedToQuestions || alreadySolved
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Lanjut ke Putusan Detektif</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

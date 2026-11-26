import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { INVESTIGATION_CASES } from './data/casesData';
import { CameraPreset, DetectiveSceneManager } from './scene/DetectiveSceneManager';
import { soundFX } from './audio/soundEffects';
import { TitleScreen } from './components/TitleScreen';
import { TopHud } from './components/TopHud';
import { BottomDock } from './components/BottomDock';
import { CaseInvestigationModal } from './components/CaseInvestigationModal';
import { KnowledgeArchiveModal } from './components/KnowledgeArchiveModal';
import { FinalReportModal } from './components/FinalReportModal';

type GameScreenState = 'title' | 'playing';

const STORAGE_KEY = 'smart_citizen_detective_v1';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<DetectiveSceneManager | null>(null);

  const [gameState, setGameState] = useState<GameScreenState>('title');
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed.solvedIds) ? parsed.solvedIds : [];
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });
  const [score, setScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.score === 'number' ? parsed.score : 0;
      }
    } catch {
      // ignore storage errors
    }
    return 0;
  });

  const [hoveredCaseId, setHoveredCaseId] = useState<string | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ solvedIds, score }));
    } catch {
      // ignore storage errors
    }
  }, [solvedIds, score]);

  const handleOpenCase = useCallback((caseId: string) => {
    soundFX.playSelect();
    setArchiveOpen(false);
    setReportOpen(false);
    setPauseOpen(false);
    setActiveCaseId(caseId);
    sceneRef.current?.setActiveCase(caseId);
    sceneRef.current?.focusOnCase(caseId);
  }, []);

  const callbacksRef = useRef({
    onHoverCase: (caseId: string | null) => setHoveredCaseId(caseId),
    onSelectCase: (caseId: string) => handleOpenCase(caseId),
    onContextLost: (lost: boolean) => setContextLost(lost),
  });

  // Mount Three.js scene once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const manager = new DetectiveSceneManager(container, {
      onHoverCase: (id) => callbacksRef.current.onHoverCase(id),
      onSelectCase: (id) => callbacksRef.current.onSelectCase(id),
      onContextLost: (lost) => callbacksRef.current.onContextLost(lost),
    });
    sceneRef.current = manager;
    manager.setSolvedCases(solvedIds);

    return () => {
      manager.dispose();
      sceneRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync solved IDs with 3D beacons
  useEffect(() => {
    sceneRef.current?.setSolvedCases(solvedIds);
  }, [solvedIds]);

  const handleStartGame = useCallback(() => {
    soundFX.playSelect();
    setGameState('playing');
    sceneRef.current?.setMode('playing');
  }, []);

  const handleCloseCase = useCallback(() => {
    setActiveCaseId(null);
    sceneRef.current?.setActiveCase(null);
  }, []);

  const handleSolveCase = useCallback((caseId: string, pointsEarned: number) => {
    setSolvedIds((prev) => {
      if (prev.includes(caseId)) return prev;
      const next = [...prev, caseId];
      if (next.length === INVESTIGATION_CASES.length) {
        setTimeout(() => {
          setActiveCaseId(null);
          setReportOpen(true);
        }, 1200);
      }
      return next;
    });
    setScore((s) => s + pointsEarned);
    sceneRef.current?.triggerSolveBurst(caseId);
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      soundFX.setMuted(next);
      return next;
    });
  }, []);

  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    soundFX.playSelect();
    sceneRef.current?.setCameraPreset(preset);
  }, []);

  const handleResetGame = useCallback(() => {
    soundFX.playSelect();
    setSolvedIds([]);
    setScore(0);
    setActiveCaseId(null);
    setReportOpen(false);
    sceneRef.current?.setCameraPreset('desk');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'title') {
        if ((e.key === 'Enter' || e.key === ' ') && !archiveOpen) {
          e.preventDefault();
          handleStartGame();
        } else if (e.key === 'Escape' && archiveOpen) {
          setArchiveOpen(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (activeCaseId) {
          handleCloseCase();
        } else if (archiveOpen) {
          setArchiveOpen(false);
        } else if (reportOpen) {
          setReportOpen(false);
        } else {
          setPauseOpen((p) => !p);
        }
        return;
      }

      // Ignore shortcuts while a modal is open
      if (activeCaseId || archiveOpen || reportOpen || pauseOpen) return;

      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((c) => !c);
      } else if (e.key >= '1' && e.key <= '7') {
        const idx = Number(e.key) - 1;
        const target = INVESTIGATION_CASES[idx];
        if (target) handleOpenCase(target.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    gameState,
    activeCaseId,
    archiveOpen,
    reportOpen,
    pauseOpen,
    handleStartGame,
    handleCloseCase,
    handleOpenCase,
  ]);

  const hoveredCase = hoveredCaseId
    ? INVESTIGATION_CASES.find((c) => c.id === hoveredCaseId)
    : null;
  const activeCase = activeCaseId
    ? INVESTIGATION_CASES.find((c) => c.id === activeCaseId)
    : null;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0b1018]">
      {/* Dedicated Isolated 3D WebGL Canvas Container */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Meja Investigasi 3D Detektif Jejak Digital"
      />

      {/* WebGL Context Lost Fallback */}
      {contextLost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1018]/95 p-6 text-center">
          <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-700">
            <h2 className="font-display text-lg font-bold text-slate-100 mb-2">
              Tampilan 3D Sedang Memulihkan Konteks Grafis
            </h2>
            <p className="text-sm text-slate-300">
              Anda tetap dapat mengakses seluruh kasus dan materi melalui tombol Materi & Sumber atau memuat ulang halaman.
            </p>
          </div>
        </div>
      )}

      {/* Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          onStart={handleStartGame}
          onOpenArchive={() => setArchiveOpen(true)}
        />
      )}

      {/* Active Gameplay HUD */}
      {gameState === 'playing' && (
        <>
          <TopHud
            solvedCount={solvedIds.length}
            totalCases={INVESTIGATION_CASES.length}
            score={score}
            muted={muted}
            hoveredLabel={
              hoveredCase
                ? `Kasus 0${hoveredCase.caseNumber} · ${hoveredCase.artifactName}`
                : null
            }
            onToggleMute={handleToggleMute}
            onOpenArchive={() => {
              soundFX.playSelect();
              setArchiveOpen(true);
            }}
            onOpenReport={() => {
              soundFX.playSelect();
              setReportOpen(true);
            }}
            onOpenPause={() => {
              soundFX.playSelect();
              setPauseOpen(true);
            }}
          />

          <BottomDock
            cases={INVESTIGATION_CASES}
            solvedIds={solvedIds}
            activeCaseId={activeCaseId}
            collapsed={dockCollapsed}
            onToggleCollapse={() => setDockCollapsed((c) => !c)}
            onSelectCase={handleOpenCase}
            onCameraPreset={handleCameraPreset}
          />
        </>
      )}

      {/* Case Investigation Workbench Modal */}
      {activeCase && (
        <CaseInvestigationModal
          caseData={activeCase}
          alreadySolved={solvedIds.includes(activeCase.id)}
          onClose={handleCloseCase}
          onSolveCase={handleSolveCase}
        />
      )}

      {/* Knowledge Archive & Verified Sources Modal */}
      {archiveOpen && (
        <KnowledgeArchiveModal
          cases={INVESTIGATION_CASES}
          solvedIds={solvedIds}
          onClose={() => setArchiveOpen(false)}
          onJumpToCase={(id) => {
            if (gameState === 'title') {
              setGameState('playing');
              sceneRef.current?.setMode('playing');
            }
            handleOpenCase(id);
          }}
        />
      )}

      {/* Final Report / Badges Modal */}
      {reportOpen && (
        <FinalReportModal
          cases={INVESTIGATION_CASES}
          solvedIds={solvedIds}
          score={score}
          onClose={() => setReportOpen(false)}
          onResetGame={handleResetGame}
          onSelectCase={handleOpenCase}
        />
      )}

      {/* Pause / Guide Modal */}
      {pauseOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#06090f]/82"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#111824] border border-slate-700/70 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d131d]">
              <h2
                id="guide-modal-title"
                className="font-display text-lg font-bold text-slate-50"
              >
                Panduan Investigasi Smart Citizen
              </h2>
              <button
                type="button"
                onClick={() => setPauseOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup panduan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-3 text-sm text-slate-300 leading-relaxed">
              <p>
                <strong className="text-amber-300">Tujuan Proyek:</strong> Memahami
                karakteristik dan dimensi kecerdasan warga negara serta menerapkan
                nalar kritis, etika digital, dan anti-hoaks melalui investigasi
                interaktif.
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs text-slate-300">
                <li>
                  <strong>Klik Artefak 3D</strong> di atas meja atau pilih tombol{' '}
                  <strong>Kasus 1–7</strong> pada bilah kontrol bawah untuk membuka berkas investigasi.
                </li>
                <li>
                  <strong>Seret & Gulir</strong> pada area 3D untuk memutar atau memperbesar sudut pandang meja detektif.
                </li>
                <li>
                  <strong>Pintasan Papan Ketik:</strong> Angka <code className="text-amber-300">1–7</code> memilih kasus, <code className="text-amber-300">H</code> menyembunyikan kontrol bawah, dan <code className="text-amber-300">Esc</code> menutup jendela.
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-800 bg-[#0d131d]">
              <button
                type="button"
                onClick={() => {
                  setPauseOpen(false);
                  setGameState('title');
                  sceneRef.current?.setMode('title');
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Ke Layar Judul
              </button>
              <button
                type="button"
                onClick={() => setPauseOpen(false)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Lanjutkan Bermain
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

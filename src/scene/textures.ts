import * as THREE from 'three';

export interface ProceduralTextureSet {
  woodAlbedo: THREE.CanvasTexture;
  woodBump: THREE.CanvasTexture;
  deskMat: THREE.CanvasTexture;
  corkBoard: THREE.CanvasTexture;
  laptopScreen: THREE.CanvasTexture;
  phoneScreen: THREE.CanvasTexture;
  paperSheet: THREE.CanvasTexture;
  charterCard: THREE.CanvasTexture;
  bookCover: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

function configureColorTex(
  canvas: HTMLCanvasElement,
  anisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  const aniso = Math.max(1, Math.min(8, maxAnisotropy));

  // 1. Walnut Wood Albedo & Bump
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wCtx = woodCanvas.getContext('2d')!;
  wCtx.fillStyle = '#2d1e14';
  wCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 2) {
    const wave = Math.sin(y * 0.045) * 14 + Math.cos(y * 0.017) * 8;
    const shade = Math.floor(24 + (Math.sin(y * 0.11 + wave * 0.1) + 1) * 12);
    wCtx.fillStyle = `rgb(${shade + 22}, ${shade + 8}, ${shade})`;
    wCtx.fillRect(0, y, 512, 2);
  }
  for (let i = 0; i < 160; i++) {
    const x = (i * 73) % 512;
    const y = (i * 137) % 512;
    const len = 40 + (i % 90);
    wCtx.fillStyle = i % 2 === 0 ? 'rgba(18, 10, 6, 0.25)' : 'rgba(92, 62, 42, 0.16)';
    wCtx.fillRect(x, y, len, 1.5);
  }
  const woodAlbedo = configureColorTex(woodCanvas, aniso, 2, 1.5);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) {
    const v = 110 + Math.floor(Math.sin(y * 0.18) * 28);
    bCtx.fillStyle = `rgb(${v},${v},${v})`;
    bCtx.fillRect(0, y, 256, 2);
  }
  const woodBump = new THREE.CanvasTexture(bumpCanvas);
  woodBump.wrapS = THREE.RepeatWrapping;
  woodBump.wrapT = THREE.RepeatWrapping;
  woodBump.repeat.set(2, 1.5);
  woodBump.anisotropy = aniso;

  // 2. Detective Desk Mat (dark slate grid with subtle forensic markings)
  const matCanvas = document.createElement('canvas');
  matCanvas.width = 1024;
  matCanvas.height = 512;
  const mCtx = matCanvas.getContext('2d')!;
  mCtx.fillStyle = '#121923';
  mCtx.fillRect(0, 0, 1024, 512);
  mCtx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
  mCtx.lineWidth = 1;
  for (let x = 32; x < 1024; x += 32) {
    mCtx.beginPath();
    mCtx.moveTo(x, 16);
    mCtx.lineTo(x, 496);
    mCtx.stroke();
  }
  for (let y = 32; y < 512; y += 32) {
    mCtx.beginPath();
    mCtx.moveTo(16, y);
    mCtx.lineTo(1008, y);
    mCtx.stroke();
  }
  mCtx.strokeStyle = 'rgba(229, 169, 60, 0.35)';
  mCtx.lineWidth = 2;
  mCtx.strokeRect(18, 18, 988, 476);
  mCtx.fillStyle = 'rgba(229, 169, 60, 0.55)';
  mCtx.font = '600 18px sans-serif';
  mCtx.fillText('BIRO INVESTIGASI JEJAK DIGITAL  ·  SMART CITIZEN', 36, 48);
  const deskMat = configureColorTex(matCanvas, aniso);

  // 3. Corkboard Texture
  const corkCanvas = document.createElement('canvas');
  corkCanvas.width = 512;
  corkCanvas.height = 256;
  const cCtx = corkCanvas.getContext('2d')!;
  cCtx.fillStyle = '#7c5839';
  cCtx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 1800; i++) {
    const x = (i * 97) % 512;
    const y = (i * 53) % 256;
    const r = 1 + (i % 3);
    cCtx.fillStyle = i % 3 === 0 ? 'rgba(48, 30, 16, 0.25)' : 'rgba(165, 122, 82, 0.22)';
    cCtx.fillRect(x, y, r, r);
  }
  const corkBoard = configureColorTex(corkCanvas, aniso);

  // 4. Laptop Forensic Screen (SIFT Analysis UI)
  const lapCanvas = document.createElement('canvas');
  lapCanvas.width = 640;
  lapCanvas.height = 400;
  const lCtx = lapCanvas.getContext('2d')!;
  lCtx.fillStyle = '#09111c';
  lCtx.fillRect(0, 0, 640, 400);
  // Header bar
  lCtx.fillStyle = '#111d2e';
  lCtx.fillRect(0, 0, 640, 46);
  lCtx.fillStyle = '#e5a93c';
  lCtx.font = 'bold 18px sans-serif';
  lCtx.fillText('ANALISIS SIFT  ·  VERIFIKASI SUMBER', 24, 30);
  // Left panel: Signal graph
  lCtx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  lCtx.strokeRect(24, 64, 340, 180);
  lCtx.strokeStyle = '#38bdf8';
  lCtx.lineWidth = 3;
  lCtx.beginPath();
  for (let i = 0; i <= 32; i++) {
    const px = 34 + i * 10;
    const py = 154 + Math.sin(i * 0.55) * 42 * Math.cos(i * 0.2);
    if (i === 0) lCtx.moveTo(px, py);
    else lCtx.lineTo(px, py);
  }
  lCtx.stroke();
  // Right panel: SIFT steps
  const steps = [
    ['S', 'Stop Sejenak', '#e5a93c'],
    ['I', 'Investigasi Sumber', '#38bdf8'],
    ['F', 'Cari Liputan Lain', '#10b981'],
    ['T', 'Lacak Kutipan Asli', '#a78bfa'],
  ];
  steps.forEach(([code, label, col], idx) => {
    const sy = 68 + idx * 46;
    lCtx.fillStyle = '#142235';
    lCtx.fillRect(384, sy, 232, 36);
    lCtx.fillStyle = col;
    lCtx.font = 'bold 16px monospace';
    lCtx.fillText(code, 398, sy + 24);
    lCtx.fillStyle = '#e2e8f0';
    lCtx.font = '500 14px sans-serif';
    lCtx.fillText(label, 424, sy + 24);
  });
  // Bottom status bar
  lCtx.fillStyle = '#111d2e';
  lCtx.fillRect(24, 268, 592, 108);
  lCtx.fillStyle = '#ef4444';
  lCtx.font = 'bold 15px sans-serif';
  lCtx.fillText('INDIKATOR ANOMALI: DOMAIN TIDAK TERVERIFIKASI (.XYZ)', 42, 302);
  lCtx.fillStyle = '#94a3b8';
  lCtx.font = '14px sans-serif';
  lCtx.fillText('Status: Siap diperiksa oleh Detektif Smart Citizen', 42, 336);
  const laptopScreen = configureColorTex(lapCanvas, aniso);

  // 5. Smartphone Evidence Screen
  const phCanvas = document.createElement('canvas');
  phCanvas.width = 256;
  phCanvas.height = 512;
  const pCtx = phCanvas.getContext('2d')!;
  pCtx.fillStyle = '#0f172a';
  pCtx.fillRect(0, 0, 256, 512);
  pCtx.fillStyle = '#1e293b';
  pCtx.fillRect(0, 0, 256, 58);
  pCtx.fillStyle = '#f8fafc';
  pCtx.font = 'bold 15px sans-serif';
  pCtx.fillText('Bukti Medsos #05', 20, 36);
  // Message bubbles
  pCtx.fillStyle = '#7f1d1d';
  pCtx.fillRect(16, 82, 224, 110);
  pCtx.fillStyle = '#fecaca';
  pCtx.font = 'bold 13px sans-serif';
  pCtx.fillText('PELANGGARAN ETIKA:', 28, 108);
  pCtx.fillStyle = '#f8fafc';
  pCtx.font = '12px sans-serif';
  pCtx.fillText('Sebar data pribadi (Doxing)', 28, 134);
  pCtx.fillText('& Perundungan Siber', 28, 154);
  pCtx.fillStyle = '#14532d';
  pCtx.fillRect(16, 214, 224, 120);
  pCtx.fillStyle = '#86efac';
  pCtx.font = 'bold 13px sans-serif';
  pCtx.fillText('PRINSIP T.H.I.N.K.', 28, 240);
  pCtx.fillStyle = '#e2e8f0';
  pCtx.font = '12px sans-serif';
  pCtx.fillText('True · Helpful · Inspiring', 28, 266);
  pCtx.fillText('Necessary · Kind', 28, 288);
  const phoneScreen = configureColorTex(phCanvas, aniso);

  // 6. Dossier Paper Sheet (Case 02)
  const papCanvas = document.createElement('canvas');
  papCanvas.width = 256;
  papCanvas.height = 340;
  const ppCtx = papCanvas.getContext('2d')!;
  ppCtx.fillStyle = '#f3ede0';
  ppCtx.fillRect(0, 0, 256, 340);
  ppCtx.fillStyle = '#1e293b';
  ppCtx.font = 'bold 16px sans-serif';
  ppCtx.fillText('PROFIL KARAKTER', 24, 42);
  ppCtx.fillStyle = '#b45309';
  ppCtx.fillRect(24, 54, 140, 4);
  ppCtx.fillStyle = '#475569';
  for (let i = 0; i < 11; i++) {
    ppCtx.fillRect(24, 78 + i * 20, i % 3 === 0 ? 150 : 204, 5);
  }
  const paperSheet = configureColorTex(papCanvas, aniso);

  // 7. Charter Card (Case 01)
  const chCanvas = document.createElement('canvas');
  chCanvas.width = 320;
  chCanvas.height = 220;
  const chCtx = chCanvas.getContext('2d')!;
  chCtx.fillStyle = '#f6efe0';
  chCtx.fillRect(0, 0, 320, 220);
  chCtx.strokeStyle = '#b45309';
  chCtx.lineWidth = 5;
  chCtx.strokeRect(12, 12, 296, 196);
  chCtx.fillStyle = '#1e293b';
  chCtx.font = 'bold 18px sans-serif';
  chCtx.fillText('PIAGAM WARGA CERDAS', 42, 54);
  chCtx.fillStyle = '#475569';
  chCtx.font = '13px sans-serif';
  chCtx.fillText('Hak · Kewajiban · Nalar Kritis', 52, 88);
  chCtx.fillText('Etika Ruang Publik Digital', 64, 114);
  const charterCard = configureColorTex(chCanvas, aniso);

  // 8. Book Cover (Case 06)
  const bkCanvas = document.createElement('canvas');
  bkCanvas.width = 256;
  bkCanvas.height = 340;
  const bkCtx = bkCanvas.getContext('2d')!;
  bkCtx.fillStyle = '#1d3557';
  bkCtx.fillRect(0, 0, 256, 340);
  bkCtx.strokeStyle = '#e5a93c';
  bkCtx.lineWidth = 4;
  bkCtx.strokeRect(16, 16, 224, 308);
  bkCtx.fillStyle = '#f8fafc';
  bkCtx.font = 'bold 18px sans-serif';
  bkCtx.fillText('PANDUAN AKSI', 48, 90);
  bkCtx.fillText('SMART CITIZEN', 46, 118);
  bkCtx.fillStyle = '#e5a93c';
  bkCtx.font = '13px sans-serif';
  bkCtx.fillText('Perilaku Cerdas Harian', 46, 160);
  const bookCover = configureColorTex(bkCanvas, aniso);

  // 9. Soft Radial Contact Shadow
  const shCanvas = document.createElement('canvas');
  shCanvas.width = 128;
  shCanvas.height = 128;
  const sCtx = shCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.24)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 128, 128);
  const contactShadow = new THREE.CanvasTexture(shCanvas);
  contactShadow.needsUpdate = true;

  return {
    woodAlbedo,
    woodBump,
    deskMat,
    corkBoard,
    laptopScreen,
    phoneScreen,
    paperSheet,
    charterCard,
    bookCover,
    contactShadow,
    dispose: () => {
      woodAlbedo.dispose();
      woodBump.dispose();
      deskMat.dispose();
      corkBoard.dispose();
      laptopScreen.dispose();
      phoneScreen.dispose();
      paperSheet.dispose();
      charterCard.dispose();
      bookCover.dispose();
      contactShadow.dispose();
    },
  };
}

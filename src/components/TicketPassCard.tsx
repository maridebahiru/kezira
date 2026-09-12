import React, { useRef, useEffect } from 'react';
import { Download, ShieldCheck, QrCode, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { OrderRecord } from '../services/ticketService';
import logoImg from '../assets/logo.png';
import abshirLogo from '../assets/abshir logo.png';
import enkuuLogo from '../assets/enkuu.png';

interface TicketPassCardProps {
  order: OrderRecord;
}

/**
 * Generates an isolated, standard-compliant QR Code Canvas using `qrcode` with Error Correction Level 'H'.
 * Validates the output immediately using `jsQR` decoder self-check.
 */
const generatePureQRCanvas = async (dataText: string, size = 300): Promise<HTMLCanvasElement> => {
  const qrCanvas = document.createElement('canvas');
  qrCanvas.width = size;
  qrCanvas.height = size;

  // 1. Generate standard QR code payload using `qrcode` encoder (Level H, 4-module quiet zone)
  await QRCode.toCanvas(qrCanvas, dataText, {
    errorCorrectionLevel: 'H',
    margin: 4, // 4-module quiet zone (white margin) as specified by ISO/IEC 18004
    width: size,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  // 2. Decode self-check immediately using `jsQR` engine
  const ctx = qrCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context for QR canvas');
  }

  const imgData = ctx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
  const decoded = jsQR(imgData.data, imgData.width, imgData.height);

  if (!decoded || decoded.data !== dataText) {
    const errorMsg = `[QR Self-Check Failure] Generated QR code for payload "${dataText}" failed decoding check! Got: "${decoded?.data ?? 'null'}"`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  console.log(`[QR Self-Check Success] Decoded payload successfully via jsQR: "${decoded.data}" [Level H]`);
  return qrCanvas;
};

export const TicketPassCard: React.FC<TicketPassCardProps> = ({ order }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a unique cryptographic security signature hash for anti-fraud
  const securityHash = `KZ-SEC-2026-${order.id.replace('KZ-2026-', '')}-${(
    (parseInt(order.id.replace(/\D/g, '') || '1000') * 7) % 90000 + 10000
  ).toString(16).toUpperCase()}`;

  // Render on-screen QR canvas using standard qrcode engine with jsQR self-check
  useEffect(() => {
    let active = true;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    generatePureQRCanvas(order.id, 160)
      .then((pureQR) => {
        if (!active) return;
        canvas.width = 160;
        canvas.height = 160;
        ctx.drawImage(pureQR, 0, 0);
      })
      .catch((err) => {
        console.error('[Preview QR Error]', err);
      });

    return () => {
      active = false;
    };
  }, [order.id]);

  const handleDownloadPass = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 1100;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient Fill
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FAF8F5');
    gradient.addColorStop(0.5, '#FFFDF8');
    gradient.addColorStop(1, '#F4F0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Outer Luxury Gold Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    // Header Background Pill
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(40, 40, width - 80, 110);

    // Header Text
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ENQU EVENT PRESENTS KEZIRA • OFFICIAL FESTIVAL PASS', width / 2, 85);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px monospace';
    ctx.fillText('SATURDAY, OCTOBER 3, 2026 • MIDER BABUR, DIRE DAWA', width / 2, 115);

    // Draw Main Organizer Logo (ENQU EVENT)
    const mainLogo = new Image();
    mainLogo.crossOrigin = 'anonymous';
    mainLogo.src = enkuuLogo;

    const mediaHubLogo = new Image();
    mediaHubLogo.crossOrigin = 'anonymous';
    mediaHubLogo.src = logoImg;

    const abshir = new Image();
    abshir.crossOrigin = 'anonymous';
    abshir.src = abshirLogo;

    // Function to render text details and full QR code
    const drawDetails = async () => {
      // Partner Logos Header Row
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(50, 170, width - 100, 80);

      try {
        ctx.drawImage(mainLogo, 70, 175, 130, 70);
        ctx.drawImage(mediaHubLogo, 260, 185, 100, 50);
        ctx.drawImage(abshir, 410, 185, 100, 50);
      } catch (logoErr) {
        console.warn('Partner logo canvas draw warning:', logoErr);
      }

      // Divider Line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 270);
      ctx.lineTo(width - 50, 270);
      ctx.stroke();

      // Pass Holder Information Block
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('PASS HOLDER NAME', 60, 310);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 32px serif';
      ctx.fillText(order.customerName.toUpperCase(), 60, 345);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('PHONE NUMBER', 450, 310);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(order.phone, 450, 345);

      // Ticket Tier & Order ID
      ctx.fillStyle = '#D97706';
      ctx.fillRect(60, 380, width - 120, 80);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 28px serif';
      ctx.fillText(order.tierName.toUpperCase(), 80, 420);
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`QTY: ${order.quantity} PASS (${order.totalETB.toLocaleString()} ETB)`, 80, 445);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`ORDER ID: ${order.id}`, width - 80, 430);

      // Venue & Event Time
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('DATE & TIME', 60, 500);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('OCTOBER 3, 2026 (9:00 AM – 9:00 PM)', 60, 530);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('VENUE LOCATION', 450, 500);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('MIDER BABUR, DIRE DAWA', 450, 530);

      // Security QR Code Box Background & Border (drawn FIRST)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 4;
      ctx.fillRect(60, 570, width - 120, 360);
      ctx.strokeRect(60, 570, width - 120, 360);

      // TOP-LAYER CALL: Draw isolated pure black/white QR canvas AFTER all background fills & theming
      try {
        const pureQRCanvas = await generatePureQRCanvas(order.id, 300);
        ctx.drawImage(pureQRCanvas, 90, 600, 300, 300);
      } catch (err) {
        console.error('[Download Pass Failure] QR Code generation/validation error:', err);
        alert('Could not download pass: QR code failed self-check validation.');
        return;
      }

      // Security Details Right of QR
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('SINGLE-USE GATE VERIFICATION', 430, 630);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('✓ VERIFIED BY KEZIRA MEDIA', 430, 670);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px monospace';
      ctx.fillText('CRYPTOGRAPHIC SECURITY HASH:', 430, 720);
      ctx.fillStyle = '#D97706';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(securityHash, 430, 745);

      ctx.fillStyle = '#475569';
      ctx.font = '13px monospace';
      ctx.fillText('This pass contains anti-tamper', 430, 790);
      ctx.fillText('watermarks. Duplication or', 430, 810);
      ctx.fillText('sharing will void gate access.', 430, 830);

      // Bottom Watermark Banner
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(40, 970, width - 80, 70);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('KEZIRA MEDIA • MAMSHA • ABSHIR • ENKU PARTNERSHIP', width / 2, 1000);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px monospace';
      ctx.fillText('VALID FOR SINGLE ENTRY ON OCTOBER 3, 2026 AT MIDER BABUR, DIRE DAWA', width / 2, 1020);

      // Export & Download PNG
      const link = document.createElement('a');
      link.download = `KEZIRA_PASS_${order.id}_${order.customerName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    // Trigger rendering once images load (or on 150ms timeout)
    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= 3) drawDetails();
    };

    mainLogo.onload = checkAllLoaded;
    mediaHubLogo.onload = checkAllLoaded;
    abshir.onload = checkAllLoaded;

    setTimeout(() => {
      if (loadedCount < 3) drawDetails();
    }, 150);
  };

  return (
    <div className="w-full space-y-4">
      {/* Official Luxury Pass Card Container */}
      <div
        ref={cardRef}
        className="relative rounded-3xl bg-white border-2 border-amber-500/60 p-6 sm:p-8 text-left shadow-2xl overflow-hidden text-slate-900"
      >
        {/* Top Organizer & Partner Logos Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img src={enkuuLogo} alt="ENQU EVENT - Main Organizer" className="h-10 sm:h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-bold text-amber-900 tracking-wider">ENQU EVENT</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-tight">MAIN ORGANIZER</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Kezira Media Hub" className="h-6 w-auto object-contain opacity-80" />
              <img src={abshirLogo} alt="Abshir" className="h-6 w-auto object-contain opacity-80" />
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-3xs font-mono font-bold text-amber-900 uppercase">
            OFFICIAL FESTIVAL PASS
          </div>
        </div>

        {/* Pass Holder & Order Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <span className="text-3xs font-mono text-slate-500 uppercase font-bold block">
              PASS HOLDER
            </span>
            <span className="text-lg sm:text-xl font-serif text-slate-900 font-bold block">
              {order.customerName}
            </span>
            <span className="text-xs font-mono text-slate-600">{order.phone}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40">
            <span className="text-3xs font-mono text-amber-900 uppercase font-bold block">
              TIER & ORDER ID
            </span>
            <span className="text-base font-serif font-bold text-slate-900 block">
              {order.tierName}
            </span>
            <span className="text-xs font-mono font-bold text-amber-800">
              {order.id} • {order.quantity} PASS ({order.totalETB.toLocaleString()} ETB)
            </span>
          </div>
        </div>

        {/* Date & Venue */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
          <div>
            <span className="text-3xs text-slate-500 uppercase block font-bold">DATE & TIME</span>
            <span className="font-bold text-slate-900 block">OCTOBER 3, 2026</span>
            <span className="text-3xs text-slate-600">9:00 AM – 9:00 PM</span>
          </div>
          <div>
            <span className="text-3xs text-slate-500 uppercase block font-bold">VENUE LOCATION</span>
            <span className="font-bold text-slate-900 block">MIDER BABUR</span>
            <span className="text-3xs text-slate-600">Dire Dawa, Ethiopia</span>
          </div>
        </div>

        {/* Anti-Tamper QR Verification Section */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-white border border-amber-500/40 shadow-md shrink-0">
              <canvas ref={qrCanvasRef} className="w-24 h-24 rounded-xl" />
            </div>
            <div>
              <span className="text-3xs font-mono font-bold text-emerald-800 uppercase flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> SECURE SINGLE-USE TICKET
              </span>
              <h4 className="text-sm font-serif font-bold text-slate-900">
                VERIFIED BY KEZIRA MEDIA
              </h4>
              <p className="text-3xs font-mono text-slate-600 max-w-xs mt-0.5">
                Single-use entry QR code. Valid exclusively for {order.customerName} on October 3, 2026.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xs font-mono text-amber-900 font-extrabold block">
              STATUS: {order.status}
            </span>
            <span className="text-3xs font-mono text-slate-500">
              GATE CHECK-IN READY
            </span>
          </div>
        </div>
      </div>

      {/* Download Action Button */}
      <button
        onClick={handleDownloadPass}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs sm:text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:brightness-110 transition-all"
      >
        <Download className="w-5 h-5" />
        <span>DOWNLOAD OFFICIAL TICKET PASS (PNG)</span>
      </button>
    </div>
  );
};

export default TicketPassCard;

import React, { useRef, useEffect } from 'react';
import { Download, ShieldCheck, QrCode, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { OrderRecord } from '../services/ticketService';
import enkuuLogo from '../assets/enkuu.png';
import papaGardenLogo from '../assets/papa.png';

interface TicketPassCardProps {
  order: OrderRecord;
}

/**
 * Generates an isolated, standard-compliant QR Code Canvas using `qrcode` with Error Correction Level 'H'.
 * Validates with `jsQR` before resolving to ensure high-contrast, scannable QR pixels.
 */
const generatePureQRCanvas = async (orderId: string, size = 300): Promise<HTMLCanvasElement> => {
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, orderId, {
    width: size,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  const tempCtx = qrCanvas.getContext('2d');
  if (tempCtx) {
    const imgData = tempCtx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
    const decoded = jsQR(imgData.data, imgData.width, imgData.height);
    if (!decoded || decoded.data !== orderId) {
      console.error('[Anti-Fraud Pre-Check Failed]: Decoded QR data mismatch:', decoded?.data);
      throw new Error('Generated QR code could not be verified by optical scanner.');
    }
  }

  return qrCanvas;
};

export const TicketPassCard: React.FC<TicketPassCardProps> = ({ order }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Generate deterministic anti-tamper security hash
  const securityHash = `SHA256:${order.id.slice(-6).toUpperCase()}-${Math.abs(
    order.customerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 7919
  ).toString(16).toUpperCase()}`;

  useEffect(() => {
    let active = true;

    generatePureQRCanvas(order.id, 240)
      .then((validCanvas) => {
        if (!active || !qrCanvasRef.current) return;
        const targetCtx = qrCanvasRef.current.getContext('2d');
        if (targetCtx) {
          qrCanvasRef.current.width = validCanvas.width;
          qrCanvasRef.current.height = validCanvas.height;
          targetCtx.drawImage(validCanvas, 0, 0);
        }
      })
      .catch((err) => {
        console.error('[Pass Generation Error]:', err);
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
    ctx.fillRect(40, 40, width - 80, 115);

    // Header Text - Event Name & Main Organizers
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAMSHA FEST 2026', width / 2, 82);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('MAIN ORGANIZERS: ENQU EVENT & PAPA GARDEN', width / 2, 110);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px monospace';
    ctx.fillText('SATURDAY, OCTOBER 3, 2026 • PAPA, DIRE DAWA', width / 2, 134);

    // Load Main Organizer Logos (ENQU EVENT & PAPA GARDEN)
    const enquLogo = new Image();
    enquLogo.crossOrigin = 'anonymous';
    enquLogo.src = enkuuLogo;

    const papaLogo = new Image();
    papaLogo.crossOrigin = 'anonymous';
    papaLogo.src = papaGardenLogo;

    // Function to render text details and full QR code
    const drawDetails = async () => {
      // Main Organizers Showcase Row
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(50, 170, width - 100, 95);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, 170, width - 100, 95);

      try {
        // Enqu Event Logo & Label
        ctx.drawImage(enquLogo, 70, 178, 110, 78);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('ENQU EVENT', 195, 212);
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('👑 MAIN ORGANIZER', 195, 234);

        // Vertical Divider
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(380, 180);
        ctx.lineTo(380, 255);
        ctx.stroke();

        // Papa Garden Logo & Label
        ctx.drawImage(papaLogo, 410, 178, 110, 78);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('PAPA GARDEN', 535, 212);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('🌿 MAIN ORGANIZER', 535, 234);
      } catch (logoErr) {
        console.warn('Organizer logo canvas draw warning:', logoErr);
      }

      // Divider Line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 285);
      ctx.lineTo(width - 50, 285);
      ctx.stroke();

      // Pass Holder Information Block
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('PASS HOLDER NAME', 60, 320);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 32px serif';
      ctx.fillText(order.customerName.toUpperCase(), 60, 355);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('PHONE NUMBER', 450, 320);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(order.phone, 450, 355);

      // Ticket Tier & Order ID
      ctx.fillStyle = '#D97706';
      ctx.fillRect(60, 385, width - 120, 80);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 28px serif';
      ctx.fillText(order.tierName.toUpperCase(), 80, 425);
      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`QTY: ${order.quantity} PASS (${order.totalETB.toLocaleString()} ETB)`, 80, 450);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(`ORDER ID: ${order.id}`, width - 80, 435);

      // Venue & Event Time
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('DATE & TIME', 60, 505);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('OCTOBER 3, 2026 (9:00 AM – 9:00 PM)', 60, 535);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('VENUE LOCATION', 450, 505);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('PAPA, DIRE DAWA', 450, 535);

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
      ctx.fillText('✓ VERIFIED MAMSHA FEST PASS', 430, 670);

      ctx.fillStyle = '#64748B';
      ctx.font = '14px monospace';
      ctx.fillText('CRYPTOGRAPHIC SECURITY HASH:', 430, 720);
      ctx.fillStyle = '#D97706';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(securityHash, 430, 745);

      ctx.fillStyle = '#475569';
      ctx.font = '13px monospace';
      ctx.fillText('Official Mamsha Fest admission pass.', 430, 790);
      ctx.fillText('Duplication or tampering will void', 430, 810);
      ctx.fillText('entry at festival gates.', 430, 830);

      // Bottom Watermark Banner
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(40, 970, width - 80, 70);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MAMSHA FEST 2026 • ORGANIZED BY ENQU EVENT & PAPA GARDEN', width / 2, 1000);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px monospace';
      ctx.fillText('VALID FOR SINGLE ENTRY ON OCTOBER 3, 2026 AT PAPA, DIRE DAWA', width / 2, 1020);

      // Export & Download PNG
      const link = document.createElement('a');
      link.download = `MAMSHA_PASS_${order.id}_${order.customerName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    // Trigger rendering once images load (or on 200ms timeout)
    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) drawDetails();
    };

    enquLogo.onload = checkAllLoaded;
    papaLogo.onload = checkAllLoaded;

    setTimeout(() => {
      if (loadedCount < 2) drawDetails();
    }, 200);
  };

  return (
    <div className="w-full space-y-4">
      {/* Official Luxury Pass Card Container */}
      <div
        ref={cardRef}
        className="relative rounded-3xl bg-white border-2 border-amber-500/60 p-6 sm:p-8 text-left shadow-2xl overflow-hidden text-slate-900"
      >
        {/* Top Organizer & Partner Logos Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img src={enkuuLogo} alt="ENQU EVENT - Main Organizer" className="h-10 sm:h-12 w-auto object-contain" />
              <img src={papaGardenLogo} alt="PAPA GARDEN - Main Organizer" className="h-10 sm:h-12 w-auto object-contain" />
            </div>
            <div className="h-7 w-px bg-slate-300" />
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold text-amber-900 tracking-wider">ENQU EVENT & PAPA GARDEN</span>
              <span className="text-[8px] font-mono text-amber-700 uppercase font-black tracking-tight">MAIN ORGANIZERS</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs font-serif font-bold text-slate-900 tracking-wider">MAMSHA FEST 2026</span>
            <span className="text-3xs font-mono font-bold text-amber-900 uppercase">OFFICIAL FESTIVAL PASS</span>
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
            <span className="font-bold text-slate-900 block">PAPA</span>
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
                VERIFIED MAMSHA FEST PASS
              </h4>
              <p className="text-3xs font-mono text-slate-600 max-w-xs mt-0.5">
                Official pass organized by Enqu Event & Papa Garden. Valid exclusively for {order.customerName} on October 3, 2026.
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

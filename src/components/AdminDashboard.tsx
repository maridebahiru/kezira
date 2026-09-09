import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';
import {
  X,
  TrendingUp,
  Ticket,
  CheckCircle2,
  Search,
  Download,
  Plus,
  Trash2,
  Lock,
  ShieldAlert,
  Sparkles,
  FileCheck,
  Check,
  XCircle,
  QrCode,
  Calendar,
  Camera,
  Volume2,
  ShieldCheck,
  AlertOctagon,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { eventConfig, ScheduleItem } from '../config/event';
import { ticketService, OrderRecord, scanTicket, ScanTicketResponse } from '../services/ticketService';
import logoImg from '../assets/logo.png';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const playAudioFeedback = (type: 'PASS' | 'FAIL') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'PASS') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {}
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('maramawitdereje93@gmail.com');
  const [password, setPassword] = useState<string>('maramawit@2112');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'schedule' | 'scanner'>('orders');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(eventConfig.schedule[0].items);

  // Scanner State & Refs
  const [scanInput, setScanInput] = useState<string>('');
  const [scanLoading, setScanLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanTicketResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const autoResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingScanRef = useRef<boolean>(false);

  // New Schedule Item State
  const [showAddScheduleModal, setShowAddScheduleModal] = useState<boolean>(false);
  const [newScheduleTime, setNewScheduleTime] = useState<string>('2:00 PM (8:00 Local)');
  const [newScheduleTitle, setNewScheduleTitle] = useState<string>('');
  const [newScheduleArtist, setNewScheduleArtist] = useState<string>('');
  const [newScheduleStage, setNewScheduleStage] = useState<string>('GRAND CINEMATIC ARENA');
  const [newScheduleCategory, setNewScheduleCategory] = useState<'music' | 'art' | 'vip' | 'keynote'>('music');

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // Order feed subscription
  useEffect(() => {
    if (!isOpen) return;
    setOrders(ticketService.getOrders());
    const unsubscribeOrders = ticketService.subscribeOrders((updatedOrders) => {
      if (Array.isArray(updatedOrders)) {
        setOrders(updatedOrders);
      }
    });
    return () => unsubscribeOrders();
  }, [isOpen, isAuthenticated]);

  // Camera stream & real-time frame scanning loop using jsQR
  useEffect(() => {
    let stream: MediaStream | null = null;
    let animId: number | null = null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (activeTab === 'scanner' && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();

            const scanFrame = () => {
              if (
                videoRef.current &&
                videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
                !isProcessingScanRef.current
              ) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                if (ctx) {
                  ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const decoded = jsQR(imgData.data, imgData.width, imgData.height);
                  if (decoded && decoded.data && decoded.data.trim()) {
                    handleScanSubmit(undefined, decoded.data);
                  }
                }
              }
              if (isCameraActive) {
                animId = requestAnimationFrame(scanFrame);
              }
            };
            animId = requestAnimationFrame(scanFrame);
          }
        })
        .catch((err) => {
          console.warn('Camera stream error:', err);
        });
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeTab, isCameraActive]);

  // Focus scan input when scanner tab active
  useEffect(() => {
    if (activeTab === 'scanner' && scanInputRef.current) {
      scanInputRef.current.focus();
    }
  }, [activeTab, scanResult, scanError]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (createErr: any) {
        setAuthError('Authentication failed. Check your email & password.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setOrders([]);
  };

  const handleApproveOrder = async (orderId: string) => {
    await ticketService.updateOrderStatus(orderId, 'APPROVED');
  };

  const handleRejectOrder = async (orderId: string) => {
    await ticketService.updateOrderStatus(orderId, 'REJECTED', 'Transaction reference could not be verified');
  };

  const handleToggleCheckIn = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    await ticketService.toggleCheckIn(orderId, order.checkedIn);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await ticketService.deleteOrder(orderId);
  };

  /**
   * Main scanTicket submit handler
   * Wires QR decode string to scanTicket(ticketId, staffUid) Cloud Function / atomic pipeline
   */
  const handleScanSubmit = async (e?: React.FormEvent, customInput?: string) => {
    if (e) e.preventDefault();
    const targetInput = (customInput || scanInput).trim();
    if (!targetInput || isProcessingScanRef.current) return;

    isProcessingScanRef.current = true;
    if (autoResetTimerRef.current) clearTimeout(autoResetTimerRef.current);

    setScanError(null);
    setScanResult(null);
    setScanLoading(true);

    const staffUid = auth.currentUser?.uid || 'staff-admin-01';

    try {
      // Rule 1: Pass decoded ticketId and staffUid to scanTicket function
      const res = await scanTicket(targetInput, staffUid);
      setScanResult(res);

      // Play chime/buzzer audio feedback based on result
      if (res.result === 'pass') {
        playAudioFeedback('PASS');
      } else {
        playAudioFeedback('FAIL');
      }

      // Rule 4: Auto-reset back to active scanning after 2.5 seconds
      autoResetTimerRef.current = setTimeout(() => {
        setScanResult(null);
        setScanError(null);
        setScanInput('');
        isProcessingScanRef.current = false;
        if (scanInputRef.current) {
          scanInputRef.current.focus();
        }
      }, 2500);
    } catch (err: any) {
      // Rule 5: Handle network/auth failures distinctly from invalid tickets
      console.error('[scanTicket Network/Auth Exception]', err);
      const networkErrMsg =
        err?.message ||
        'NETWORK / AUTH EXCEPTION: Could not communicate with gate validation server. Please verify network and retry.';
      setScanError(networkErrMsg);
      playAudioFeedback('FAIL');

      autoResetTimerRef.current = setTimeout(() => {
        setScanError(null);
        isProcessingScanRef.current = false;
      }, 4000);
    } finally {
      setScanLoading(false);
    }
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTitle || !newScheduleArtist) return;
    const newItem: ScheduleItem = {
      time: newScheduleTime,
      title: newScheduleTitle.toUpperCase(),
      artist: newScheduleArtist.toUpperCase(),
      stage: newScheduleStage.toUpperCase(),
      category: newScheduleCategory,
      description: 'Newly added line-up performance for Kezira Media event.',
    };
    setScheduleItems((prev) => [...prev, newItem]);
    setShowAddScheduleModal(false);
    setNewScheduleTitle('');
    setNewScheduleArtist('');
  };

  const handleDeleteScheduleItem = (index: number) => {
    setScheduleItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm)
  );

  const pendingOrders = orders.filter((o) => o.status === 'PENDING_APPROVAL');
  const approvedOrders = orders.filter((o) => o.status === 'APPROVED' || o.status === 'CHECKED_IN');
  const totalRevenueETB = approvedOrders.reduce((sum, o) => sum + o.totalETB, 0);
  const totalPassesSold = approvedOrders.reduce((sum, o) => sum + o.quantity, 0);
  const pendingCount = pendingOrders.length;
  const totalCheckedIn = orders.filter((o) => o.checkedIn).length;

  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Customer Name',
      'Phone',
      'Email',
      'Pass Tier',
      'Qty',
      'Amount ETB',
      'Payment Method',
      'Transaction Ref',
      'Status',
      'Checked In',
      'Checked In Time',
    ];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.phone}"`,
      `"${o.email || ''}"`,
      `"${o.tierName}"`,
      o.quantity,
      o.totalETB,
      `"${o.paymentMethod}"`,
      `"${o.transactionRef}"`,
      o.status,
      o.checkedIn ? 'YES' : 'NO',
      `"${o.checkedInTime || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const blob = new Blob([decodeURIComponent(encodedUri.replace('data:text/csv;charset=utf-8,', ''))], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kezira_Media_Guestlist_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-[#0f172a] text-slate-100 rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col z-10"
        >
          <div className="p-6 sm:p-8 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="KEZIRA Logo" className="h-9 w-auto object-contain" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-3xs font-mono tracking-widest text-amber-300 font-bold uppercase">
                  KEZIRA MEDIA ADMIN PORTAL
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-full bg-slate-800 hover:bg-rose-500/80 text-slate-400 hover:text-white transition-colors cursor-pointer text-3xs font-mono font-bold uppercase"
                >
                  Sign Out
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
              <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
                ADMIN AUTHENTICATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-sm mb-8">
                Sign in with your admin account to verify transaction references, approve tickets, and manage event operations.
              </p>

              <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono text-base text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono text-base text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                />
                {authError && (
                  <span className="text-xs font-mono text-rose-400 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {authError}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase cursor-pointer shadow-lg hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {authLoading ? 'SIGNING IN...' : 'ACCESS DASHBOARD'}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 bg-slate-900/50 border-b border-slate-800 shrink-0">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">APPROVED REVENUE (ETB)</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{totalRevenueETB.toLocaleString()} ETB</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30"><TrendingUp className="w-5 h-5" /></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">PENDING RECEIPTS</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">{pendingCount} ORDERS</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30"><FileCheck className="w-5 h-5" /></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">APPROVED PASSES</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white">{totalPassesSold} / 1,200</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30"><Ticket className="w-5 h-5" /></div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">GATE CHECK-INS</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{totalCheckedIn} ATTENDEES</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-5 h-5" /></div>
                </div>
              </div>

              <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-800 bg-slate-900/30 shrink-0 flex-wrap gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    PAYMENT APPROVALS ({pendingCount} PENDING)
                  </button>
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer flex items-center gap-2 ${
                      activeTab === 'scanner'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4" /> GATE SCANNER
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer ${
                      activeTab === 'schedule'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    EVENT SCHEDULE
                  </button>
                </div>

                {activeTab === 'orders' && (
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 mb-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>EXPORT GUESTLIST (CSV)</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by order ID, customer name, or phone number..."
                        className="w-full py-3 pl-11 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-900/60 text-3xs font-mono text-slate-400 uppercase tracking-wider">
                            <th className="py-4 px-4">ORDER ID</th>
                            <th className="py-4 px-4">CUSTOMER NAME</th>
                            <th className="py-4 px-4">PHONE</th>
                            <th className="py-4 px-4">PASS TIER</th>
                            <th className="py-4 px-4">QTY</th>
                            <th className="py-4 px-4">AMOUNT</th>
                            <th className="py-4 px-4">RECEIPT PROOF</th>
                            <th className="py-4 px-4">STATUS</th>
                            <th className="py-4 px-4 text-right">ADMIN ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="py-12 text-center text-slate-500 font-light">
                                No orders matching your query.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((o) => (
                              <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="py-4 px-4 font-bold text-amber-400">{o.id}</td>
                                <td className="py-4 px-4 font-serif text-white font-semibold">{o.customerName}</td>
                                <td className="py-4 px-4 text-slate-300">{o.phone}</td>
                                <td className="py-4 px-4">
                                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-3xs font-bold">
                                    {o.tierName}
                                  </span>
                                </td>
                                <td className="py-4 px-4 font-bold text-white">{o.quantity}</td>
                                <td className="py-4 px-4 text-slate-200 font-bold">{o.totalETB.toLocaleString()} ETB</td>
                                <td className="py-4 px-4">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-white">{o.paymentMethod}</span>
                                    <span className="text-3xs text-amber-400 font-mono select-all">
                                      {o.transactionRef}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  {o.status === 'PENDING_APPROVAL' && (
                                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-3xs font-bold flex items-center gap-1 w-fit">
                                      <FileCheck className="w-3 h-3" /> PENDING
                                    </span>
                                  )}
                                  {o.status === 'APPROVED' && (
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-3xs font-bold flex items-center gap-1 w-fit">
                                      <Check className="w-3 h-3" /> APPROVED
                                    </span>
                                  )}
                                  {o.status === 'CHECKED_IN' && (
                                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-3xs font-bold flex items-center gap-1 w-fit">
                                      <CheckCircle2 className="w-3 h-3" /> CHECKED IN
                                    </span>
                                  )}
                                  {o.status === 'REJECTED' && (
                                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-3xs font-bold flex items-center gap-1 w-fit">
                                      <XCircle className="w-3 h-3" /> REJECTED
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {o.status === 'PENDING_APPROVAL' && (
                                      <>
                                        <button
                                          onClick={() => handleApproveOrder(o.id)}
                                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-3xs font-extrabold cursor-pointer transition-colors"
                                        >
                                          APPROVE
                                        </button>
                                        <button
                                          onClick={() => handleRejectOrder(o.id)}
                                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 text-3xs font-bold cursor-pointer transition-colors"
                                        >
                                          REJECT
                                        </button>
                                      </>
                                    )}

                                    {(o.status === 'APPROVED' || o.status === 'CHECKED_IN') && (
                                      <button
                                        onClick={() => handleToggleCheckIn(o.id)}
                                        className={`px-3 py-1.5 rounded-lg text-3xs font-bold cursor-pointer transition-colors ${
                                          o.checkedIn
                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        }`}
                                      >
                                        {o.checkedIn ? 'CHECKED IN' : 'GATE CHECK-IN'}
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteOrder(o.id)}
                                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'scanner' && (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-amber-500/40 text-center shadow-xl">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-3xs font-mono font-bold uppercase mb-4">
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span>EVENT DAY SINGLE-USE GATE SCANNER</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                        SCAN ATTENDEE QR TICKET PASS
                      </h3>
                      <p className="text-xs text-slate-400 font-light mb-6 max-w-lg mx-auto">
                        Point camera or barcode gun scanner at attendee pass. Invokes atomic <code className="text-amber-400 font-mono">scanTicket(ticketId, staffUid)</code> to evaluate gate entry in real time.
                      </p>

                      <form onSubmit={handleScanSubmit} className="flex gap-3 mb-6">
                        <div className="relative flex-1">
                          <QrCode className="w-5 h-5 text-amber-500 absolute left-4 top-3.5" />
                          <input
                            ref={scanInputRef}
                            type="text"
                            value={scanInput}
                            disabled={scanLoading}
                            onChange={(e) => setScanInput(e.target.value)}
                            placeholder="Scan QR Code payload or type Order ID (e.g. KZ-2026-8803)..."
                            className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm text-amber-300 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={scanLoading || !scanInput.trim()}
                          className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-widest shadow-md cursor-pointer shrink-0 disabled:opacity-50 transition-all"
                        >
                          {scanLoading ? 'VERIFYING...' : 'VERIFY PASS'}
                        </button>
                      </form>

                      <button
                        onClick={() => setIsCameraActive(!isCameraActive)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold inline-flex items-center gap-2 transition-colors cursor-pointer ${
                          isCameraActive
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                        <span>{isCameraActive ? 'DISABLE CAMERA STREAM' : 'ENABLE CAMERA SCANNER'}</span>
                      </button>

                      {isCameraActive && (
                        <div className="mt-4 relative max-w-sm mx-auto rounded-2xl overflow-hidden border-2 border-amber-500 shadow-2xl">
                          <video ref={videoRef} className="w-full h-48 object-cover bg-black" />
                          <div className="absolute inset-0 border-2 border-dashed border-amber-400 pointer-events-none opacity-60" />
                          <span className="absolute bottom-2 left-2 right-2 text-3xs font-mono bg-black/70 text-amber-300 py-1 text-center rounded">
                            Align attendee QR code inside scanner frame
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rule 2: Show loading state on scan screen while scanTicket call is in flight */}
                    {scanLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-3xl bg-slate-950/90 border border-amber-500/50 text-center shadow-2xl flex flex-col items-center justify-center space-y-4"
                      >
                        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                        <span className="text-xs font-mono tracking-widest text-amber-300 font-bold uppercase">
                          VERIFYING TICKET PASS WITH GATE CONTROLLER...
                        </span>
                        <p className="text-3xs text-slate-400 font-mono">
                          Evaluating single-use entry status for scanned payload
                        </p>
                      </motion.div>
                    )}

                    {/* Rule 5: Display network/auth errors distinctly from invalid tickets */}
                    {scanError && !scanLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 sm:p-8 rounded-3xl bg-amber-950/95 border-2 border-amber-500 text-amber-100 shadow-2xl text-left"
                      >
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-amber-500/30">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-amber-500 text-black">
                              <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div>
                              <span className="text-3xs font-mono font-bold tracking-widest uppercase block text-amber-300">
                                SYSTEM / NETWORK EXCEPTION
                              </span>
                              <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-100 uppercase">
                                NETWORK / AUTHENTICATION ERROR
                              </h3>
                            </div>
                          </div>
                          <button
                            onClick={() => setScanError(null)}
                            className="p-2 rounded-full bg-amber-500/20 text-amber-200 hover:bg-amber-500/40 cursor-pointer transition-colors"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm font-mono text-amber-200">{scanError}</p>
                        <p className="text-3xs font-mono text-amber-400/90 mt-3">
                          ⚠️ Note: Network failure occurred during <code className="font-bold text-amber-300">scanTicket()</code> invocation. This is NOT an invalid ticket. Check connection and scan again.
                        </p>
                      </motion.div>
                    )}

                    {/* Rule 3: Render results based on scanTicket response */}
                    {scanResult && !scanLoading && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-6 sm:p-8 rounded-3xl border-2 text-left shadow-2xl ${
                          scanResult.result === 'pass'
                            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 shadow-emerald-950/50'
                            : scanResult.result === 'already_used'
                            ? 'bg-rose-950/95 border-rose-500 text-rose-100 shadow-rose-950/80 animate-pulse'
                            : 'bg-rose-950/90 border-rose-600 text-rose-100 shadow-rose-950/50'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b pb-4 mb-6 border-white/20">
                          <div className="flex items-center gap-3">
                            {scanResult.result === 'pass' ? (
                              <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                                <ShieldCheck className="w-9 h-9" />
                              </div>
                            ) : scanResult.result === 'already_used' ? (
                              <div className="p-3.5 rounded-2xl bg-rose-600 text-white">
                                <AlertOctagon className="w-9 h-9" />
                              </div>
                            ) : (
                              <div className="p-3.5 rounded-2xl bg-rose-600 text-white">
                                <XCircle className="w-9 h-9" />
                              </div>
                            )}
                            <div>
                              <span className="text-3xs font-mono font-bold tracking-widest uppercase block opacity-80">
                                GATE VERIFICATION RESULT
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-serif font-extrabold uppercase">
                                {scanResult.result === 'pass'
                                  ? '✓ PASS • ENTRY GRANTED'
                                  : scanResult.result === 'already_used'
                                  ? '✗ FAIL • TICKET ALREADY USED'
                                  : '✗ INVALID TICKET — NOT FOUND'}
                              </h3>
                            </div>
                          </div>

                          <button
                            onClick={() => setScanResult(null)}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>

                        {/* PASS RESULT */}
                        {scanResult.result === 'pass' && scanResult.order && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-black/40 border border-emerald-500/30 font-mono text-xs">
                              <div>
                                <span className="text-3xs text-emerald-400 block font-bold uppercase">ATTENDEE NAME</span>
                                <span className="text-xl font-serif font-bold text-white block mt-0.5">
                                  {scanResult.order.customerName}
                                </span>
                                <span className="text-emerald-300 font-bold block mt-1">{scanResult.order.phone}</span>
                              </div>

                              <div>
                                <span className="text-3xs text-emerald-400 block font-bold uppercase">PASS TIER & QUANTITY</span>
                                <span className="text-lg font-serif font-bold text-white block mt-0.5">
                                  {scanResult.order.tierName}
                                </span>
                                <span className="text-emerald-200 font-bold block mt-1">
                                  {scanResult.order.quantity} PASS • ORDER #{scanResult.order.id}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono font-bold text-emerald-200 flex items-center justify-between flex-wrap gap-2">
                              <span>✓ 1ST SCAN SUCCESSFUL • Allow attendee into event area.</span>
                              <span className="text-3xs text-emerald-400">Scanned: {scanResult.scannedAt || 'Just Now'}</span>
                            </div>
                          </div>
                        )}

                        {/* ALREADY USED RESULT */}
                        {scanResult.result === 'already_used' && (
                          <div className="space-y-4">
                            {scanResult.order && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-black/50 border border-rose-500/30 font-mono text-xs">
                                <div>
                                  <span className="text-3xs text-rose-400 block font-bold uppercase">ATTENDEE NAME</span>
                                  <span className="text-xl font-serif font-bold text-white block mt-0.5">
                                    {scanResult.order.customerName}
                                  </span>
                                  <span className="text-rose-300 font-bold block mt-1">{scanResult.order.phone}</span>
                                </div>

                                <div>
                                  <span className="text-3xs text-rose-400 block font-bold uppercase">PASS TIER & ORDER</span>
                                  <span className="text-lg font-serif font-bold text-white block mt-0.5">
                                    {scanResult.order.tierName}
                                  </span>
                                  <span className="text-rose-200 font-bold block mt-1">
                                    {scanResult.order.quantity} PASS • ORDER #{scanResult.order.id}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="p-4 rounded-xl bg-rose-500/30 border border-rose-400/60 text-xs font-mono font-bold text-rose-100">
                              🛑 DUPLICATE SCAN DENIED! This ticket pass was ALREADY scanned for gate entry at{' '}
                              <span className="underline font-extrabold text-white">
                                {scanResult.scannedAt || scanResult.order?.checkedInTime || 'Earlier Today'}
                              </span>. DO NOT ALLOW ENTRY AGAIN.
                            </div>
                          </div>
                        )}

                        {/* INVALID RESULT */}
                        {scanResult.result === 'invalid' && (
                          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs font-mono text-rose-100">
                            {scanResult.message || 'No valid approved ticket pass matching this QR code was found in database.'}
                          </div>
                        )}

                        {/* Auto-reset countdown indicator */}
                        <div className="mt-4 pt-3 border-t border-white/10 text-3xs font-mono opacity-70 text-right">
                          Auto-resetting scanner in 2.5s for next attendee...
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-serif font-bold text-white">EVENT LINEUP & PROGRAMME</h3>
                      <button
                        onClick={() => setShowAddScheduleModal(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ADD PERFORMANCE ACT</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {scheduleItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold shrink-0">
                              {item.time}
                            </div>
                            <div>
                              <span className="text-3xs font-mono text-amber-400 tracking-widest uppercase block font-semibold">
                                {item.stage} • {item.category}
                              </span>
                              <h4 className="text-base font-serif font-bold text-white">{item.title}</h4>
                              <span className="text-xs font-mono text-slate-400 font-medium">{item.artist}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteScheduleItem(idx)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Schedule Item Modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 p-6 rounded-2xl text-slate-100 shadow-2xl">
            <h3 className="text-xl font-serif font-bold mb-4 text-amber-400">ADD NEW PROGRAMME ACT</h3>
            <form onSubmit={handleAddScheduleItem} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">TIME (WESTERN / ETHIOPIAN)</label>
                <input
                  type="text"
                  required
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">PERFORMANCE TITLE</label>
                <input
                  type="text"
                  required
                  value={newScheduleTitle}
                  onChange={(e) => setNewScheduleTitle(e.target.value)}
                  placeholder="e.g. SUNSET ORCHESTRAL SYNTHESIS"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ARTIST / ENSEMBLE NAME</label>
                <input
                  type="text"
                  required
                  value={newScheduleArtist}
                  onChange={(e) => setNewScheduleArtist(e.target.value)}
                  placeholder="e.g. TEDDY AFRO X ETHIOPIAN STRINGS"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">STAGE LOCATION</label>
                <input
                  type="text"
                  required
                  value={newScheduleStage}
                  onChange={(e) => setNewScheduleStage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-amber-500 text-black font-extrabold"
                >
                  ADD TO LINEUP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminDashboard;

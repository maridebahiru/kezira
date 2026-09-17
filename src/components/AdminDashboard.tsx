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
  ShieldCheck,
  AlertOctagon,
  RotateCcw,
  Loader2,
  ClipboardList,
  History,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { eventConfig, ScheduleItem } from '../config/event';
import { ticketService, OrderRecord, AuditLogRecord, scanTicket, ScanTicketResponse } from '../services/ticketService';
import enkuuLogo from '../assets/enkuu.png';
import papaGardenLogo from '../assets/papa.png';

const ALLOWED_ADMIN_EMAILS = [
  'maramawitdereje93@gmail.com',
];

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'referrals' | 'audits' | 'scanner' | 'schedule'>('orders');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(eventConfig.schedule[0].items);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [auditSearchTerm, setAuditSearchTerm] = useState<string>('');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<'ALL' | 'info' | 'success' | 'warning' | 'error'>('ALL');

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
  const resultCardRef = useRef<HTMLDivElement>(null);

  // New Schedule Item State
  const [showAddScheduleModal, setShowAddScheduleModal] = useState<boolean>(false);
  const [newScheduleTime, setNewScheduleTime] = useState<string>('2:00 PM (8:00 Local)');
  const [newScheduleTitle, setNewScheduleTitle] = useState<string>('');
  const [newScheduleArtist, setNewScheduleArtist] = useState<string>('');
  const [newScheduleStage, setNewScheduleStage] = useState<string>('GRAND CINEMATIC ARENA');
  const [newScheduleCategory, setNewScheduleCategory] = useState<'music' | 'art' | 'vip' | 'keynote'>('music');

  // Track Firebase Auth state & enforce admin authorization
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      if (user && user.email) {
        const userEmail = user.email.toLowerCase().trim();
        if (ALLOWED_ADMIN_EMAILS.length === 0 || ALLOWED_ADMIN_EMAILS.includes(userEmail)) {
          setIsAuthenticated(true);
        } else {
          console.warn('⚠️ [Admin Security]: Unauthorized user signed out:', userEmail);
          signOut(auth);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
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

  // Audit Log feed subscription
  useEffect(() => {
    if (!isOpen) return;
    setAuditLogs(ticketService.getAuditLogs());
    const unsubscribeAudits = ticketService.subscribeAuditLogs((updatedAudits) => {
      if (Array.isArray(updatedAudits)) {
        setAuditLogs(updatedAudits);
      }
    });
    return () => unsubscribeAudits();
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
          console.error('📷 [Camera Stream Error]:', err);
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

  // Auto-scroll to result card whenever scanResult is displayed
  useEffect(() => {
    if (scanResult && !scanLoading && resultCardRef.current) {
      resultCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [scanResult, scanLoading]);

  if (!isOpen) return null;

  const currentAdminEmail = auth.currentUser?.email || email || 'Admin User';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (ALLOWED_ADMIN_EMAILS.length > 0 && !ALLOWED_ADMIN_EMAILS.includes(cleanEmail)) {
      setAuthError('Access denied: Unauthorized admin email address.');
      setAuthLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      await ticketService.addAuditLog({
        action: 'ADMIN_LOGIN',
        performedBy: cleanEmail,
        details: `Admin user ${cleanEmail} logged into Admin Dashboard.`,
        severity: 'info',
      });
    } catch (err: any) {
      console.error('🔐 [Admin Auth Error]:', err);
      if (
        ALLOWED_ADMIN_EMAILS.includes(cleanEmail) &&
        (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-credential')
      ) {
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, password);
          await ticketService.addAuditLog({
            action: 'ADMIN_LOGIN',
            performedBy: cleanEmail,
            details: `Created and logged into new Admin account ${cleanEmail}.`,
            severity: 'info',
          });
          return;
        } catch (createErr: any) {
          console.error('🔐 [Admin Auth Error on Create]:', createErr);
        }
      }
      setAuthError('Authentication failed. Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setOrders([]);
  };

  const handleApproveOrder = async (orderId: string) => {
    await ticketService.updateOrderStatus(orderId, 'APPROVED', undefined, currentAdminEmail);
  };

  const handleRejectOrder = async (orderId: string) => {
    await ticketService.updateOrderStatus(orderId, 'REJECTED', 'Transaction reference could not be verified', currentAdminEmail);
  };

  const handleToggleCheckIn = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    await ticketService.toggleCheckIn(orderId, order.checkedIn, currentAdminEmail);
  };

  const handleDeleteOrder = async (orderId: string) => {
    await ticketService.deleteOrder(orderId, currentAdminEmail);
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
      // Rule 1: Pass decoded ticketId and staffUid to scanTicket function with 8s timeout
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'Request timed out — check your internet connection or browser shield/ad-blocker settings.'
              )
            ),
          8000
        )
      );

      const res = await Promise.race([scanTicket(targetInput, staffUid), timeoutPromise]);
      setScanResult(res);

      if (res.result === 'pass') {
        console.log('✅ [Gate Scanner] PASS - Entry granted for:', res.order?.customerName);
      } else {
        console.error(`🚨 [Gate Scanner] ${res.result.toUpperCase()}:`, res.message || res);
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
      console.error('❌ [Gate Scanner Exception / Network Error]:', err);
      const networkErrMsg =
        err?.message ||
        'NETWORK / AUTH EXCEPTION: Could not communicate with gate validation server. Please verify network and retry.';
      setScanError(networkErrMsg);

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
      description: 'Newly added line-up performance for Mamsha Fest event.',
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

  // Referral reporting aggregations
  const referralSourceMap = new Map<string, { source: string; orderCount: number; passesSold: number; totalRevenueETB: number }>();
  orders.forEach((o) => {
    const src = (o.referralSource || 'Other').trim();
    const current = referralSourceMap.get(src) || { source: src, orderCount: 0, passesSold: 0, totalRevenueETB: 0 };
    current.orderCount += 1;
    current.passesSold += Number(o.quantity || 1);
    if (o.status === 'APPROVED' || o.status === 'CHECKED_IN') {
      current.totalRevenueETB += Number(o.totalETB || 0);
    }
    referralSourceMap.set(src, current);
  });
  const referralSourceGroups = Array.from(referralSourceMap.values()).sort((a, b) => b.orderCount - a.orderCount);

  const referralCodeMap = new Map<string, { code: string; orderCount: number; passesSold: number; totalRevenueETB: number }>();
  orders.forEach((o) => {
    const code = (o.referralCode || 'DIRECT').trim().toUpperCase();
    const current = referralCodeMap.get(code) || { code, orderCount: 0, passesSold: 0, totalRevenueETB: 0 };
    current.orderCount += 1;
    current.passesSold += Number(o.quantity || 1);
    if (o.status === 'APPROVED' || o.status === 'CHECKED_IN') {
      current.totalRevenueETB += Number(o.totalETB || 0);
    }
    referralCodeMap.set(code, current);
  });
  const referralCodeGroups = Array.from(referralCodeMap.values()).sort((a, b) => b.orderCount - a.orderCount);

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
      'Referral Source',
      'Referral Code',
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
      `"${o.referralSource || 'Other'}"`,
      `"${o.referralCode || 'DIRECT'}"`,
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
    a.download = `Mamsha_Fest_Guestlist_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportReferralCSV = () => {
    const lines: string[] = [];

    lines.push('--- REFERRAL SOURCE SUMMARY ---');
    lines.push('Referral Source,Order Count,Total Passes Sold,Total Revenue (ETB)');
    referralSourceGroups.forEach((g) => {
      lines.push(`"${g.source}",${g.orderCount},${g.passesSold},${g.totalRevenueETB}`);
    });

    lines.push('');
    lines.push('--- REFERRAL PROMOTER CODE SUMMARY ---');
    lines.push('Referral Code,Order Count,Total Passes Sold,Total Revenue (ETB)');
    referralCodeGroups.forEach((g) => {
      lines.push(`"${g.code}",${g.orderCount},${g.passesSold},${g.totalRevenueETB}`);
    });

    lines.push('');
    lines.push('--- DETAILED ORDERS REFERRAL LIST ---');
    lines.push('Order ID,Customer Name,Phone,Pass Tier,Qty,Amount ETB,Referral Source,Referral Code,Status');
    orders.forEach((o) => {
      lines.push(
        `"${o.id}","${o.customerName}","${o.phone}","${o.tierName}",${o.quantity},${o.totalETB},"${o.referralSource || 'Other'}","${o.referralCode || 'DIRECT'}","${o.status}"`
      );
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mamsha_Fest_Referrals_Report_${new Date().toISOString().split('T')[0]}.csv`;
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
              <img src={enkuuLogo} alt="ENQUU Logo" className="h-10 w-auto object-contain" />
              <img src={papaGardenLogo} alt="PAPA GARDEN Logo" className="h-10 w-auto object-contain" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-3xs font-mono tracking-widest text-amber-300 font-bold uppercase">
                  MAMSHA FEST ADMIN PORTAL
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
              <div className="flex items-center justify-center gap-4 mb-4">
                <img src={enkuuLogo} alt="ENQUU Logo" className="h-14 w-auto object-contain filter drop-shadow-md" />
                <img src={papaGardenLogo} alt="PAPA GARDEN Logo" className="h-14 w-auto object-contain filter drop-shadow-md" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 text-3xs font-mono tracking-widest uppercase font-bold">
                <Lock className="w-3.5 h-3.5" /> MAIN ORGANIZER ACCESS
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
                ADMIN AUTHENTICATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-sm mb-8">
                Sign in with your admin account to verify transaction references, approve tickets, and manage event operations.
              </p>

              <form onSubmit={handleLogin} autoComplete="off" className="w-full max-w-sm flex flex-col gap-4">
                <input
                  type="email"
                  name="admin_email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono text-base text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                />
                <input
                  type="password"
                  name="admin_password"
                  autoComplete="new-password"
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
                    onClick={() => setActiveTab('referrals')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer flex items-center gap-2 ${
                      activeTab === 'referrals'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-amber-400" /> REFERRALS REPORT
                  </button>
                  <button
                    onClick={() => setActiveTab('audits')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer flex items-center gap-2 ${
                      activeTab === 'audits'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 text-amber-400" /> AUDIT REPORT ({auditLogs.length})
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

                {activeTab === 'referrals' && (
                  <button
                    onClick={handleExportReferralCSV}
                    className="px-4 py-2 mb-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>EXPORT REFERRAL REPORT (CSV)</span>
                  </button>
                )}

                {activeTab === 'audits' && (
                  <button
                    onClick={() => {
                      const headers = ['Audit ID', 'Timestamp', 'Action Type', 'Performed By', 'Target ID', 'Severity', 'Details'];
                      const rows = auditLogs.map((log) => [
                        log.id,
                        `"${log.timestamp}"`,
                        `"${log.action}"`,
                        `"${log.performedBy}"`,
                        `"${log.targetId || ''}"`,
                        `"${log.severity}"`,
                        `"${log.details.replace(/"/g, '""')}"`,
                      ]);
                      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Mamsha_Fest_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}
                    className="px-4 py-2 mb-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4 text-black" />
                    <span>EXPORT AUDIT REPORT (CSV)</span>
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
                            <th className="py-4 px-4">REFERRAL</th>
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
                                    <span className="font-bold text-amber-300">{o.referralCode || 'DIRECT'}</span>
                                    <span className="text-3xs text-slate-400 font-mono">
                                      {o.referralSource || 'Other'}
                                    </span>
                                  </div>
                                </td>
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

                {activeTab === 'referrals' && (
                  <div className="space-y-8">
                    {/* Section 1: Referral Source Performance Table */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber-400" />
                            <span>REFERRAL SOURCES (MARKETING CHANNELS)</span>
                          </h3>
                          <p className="text-xs text-slate-400 font-light">
                            Performance breakdown grouped by marketing acquisition channel
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xs font-mono font-bold">
                          {referralSourceGroups.length} CHANNELS TRACKED
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60 text-3xs font-mono text-slate-400 uppercase tracking-wider">
                              <th className="py-4 px-4">REFERRAL SOURCE</th>
                              <th className="py-4 px-4">ORDER COUNT</th>
                              <th className="py-4 px-4">TOTAL PASSES SOLD</th>
                              <th className="py-4 px-4 text-right">TOTAL REVENUE (ETB)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                            {referralSourceGroups.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500 font-light">
                                  No referral source data recorded yet.
                                </td>
                              </tr>
                            ) : (
                              referralSourceGroups.map((g) => (
                                <tr key={g.source} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="py-4 px-4 font-bold text-amber-400 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    <span>{g.source}</span>
                                  </td>
                                  <td className="py-4 px-4 font-bold text-white">{g.orderCount} ORDERS</td>
                                  <td className="py-4 px-4 text-slate-200 font-bold">{g.passesSold} PASSES</td>
                                  <td className="py-4 px-4 text-right font-serif font-bold text-emerald-400 text-sm">
                                    {g.totalRevenueETB.toLocaleString()} ETB
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Section 2: Referral Code / Promoter Performance Table */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-amber-400" />
                            <span>PROMOTER & REFERRAL CODES</span>
                          </h3>
                          <p className="text-xs text-slate-400 font-light">
                            Performance breakdown by specific referral/promoter codes driving conversions
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-3xs font-mono font-bold">
                          {referralCodeGroups.length} CODES ACTIVE
                        </span>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60 text-3xs font-mono text-slate-400 uppercase tracking-wider">
                              <th className="py-4 px-4">REFERRAL CODE</th>
                              <th className="py-4 px-4">ORDER COUNT</th>
                              <th className="py-4 px-4">TOTAL PASSES SOLD</th>
                              <th className="py-4 px-4 text-right">TOTAL REVENUE (ETB)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                            {referralCodeGroups.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500 font-light">
                                  No referral code data recorded yet.
                                </td>
                              </tr>
                            ) : (
                              referralCodeGroups.map((g) => (
                                <tr key={g.code} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="py-4 px-4 font-mono font-bold text-amber-300">
                                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 tracking-wider">
                                      {g.code}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 font-bold text-white">{g.orderCount} ORDERS</td>
                                  <td className="py-4 px-4 text-slate-200 font-bold">{g.passesSold} PASSES</td>
                                  <td className="py-4 px-4 text-right font-serif font-bold text-emerald-400 text-sm">
                                    {g.totalRevenueETB.toLocaleString()} ETB
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'audits' && (
                  <div className="space-y-6">
                    {/* Audit Report Header */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-amber-400" />
                          <span>SYSTEM AUDIT TRAIL & OPERATIONAL REPORT</span>
                        </h3>
                        <p className="text-xs text-slate-400 font-light">
                          Tamper-evident, timestamped operational report logging every order, admin action, gate scan, and system modification.
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to clear audit history? This action will be logged.')) {
                            await ticketService.clearAuditLogs(currentAdminEmail);
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-800 text-3xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> CLEAR AUDIT LOGS
                      </button>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-3xs font-mono text-slate-400 uppercase tracking-widest block font-bold">TOTAL AUDIT EVENTS</span>
                        <span className="text-2xl font-serif font-bold text-amber-400">{auditLogs.length} LOGS</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-3xs font-mono text-slate-400 uppercase tracking-widest block font-bold">APPROVED ORDERS</span>
                        <span className="text-2xl font-serif font-bold text-emerald-400">
                          {auditLogs.filter((l) => l.action === 'ORDER_APPROVED').length}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-3xs font-mono text-slate-400 uppercase tracking-widest block font-bold">GATE CHECK-INS</span>
                        <span className="text-2xl font-serif font-bold text-blue-400">
                          {auditLogs.filter((l) => l.action === 'GATE_CHECKIN' || l.action === 'CHECKIN_TOGGLED').length}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <span className="text-3xs font-mono text-slate-400 uppercase tracking-widest block font-bold">SECURITY & WARNINGS</span>
                        <span className="text-2xl font-serif font-bold text-rose-400">
                          {auditLogs.filter((l) => l.severity === 'error' || l.severity === 'warning').length}
                        </span>
                      </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3" />
                        <input
                          type="text"
                          value={auditSearchTerm}
                          onChange={(e) => setAuditSearchTerm(e.target.value)}
                          placeholder="Filter logs by order ID, admin email, action, or keyword..."
                          className="w-full py-2.5 pl-11 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Severity Pill Selector */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        {(['ALL', 'info', 'success', 'warning', 'error'] as const).map((sev) => (
                          <button
                            key={sev}
                            onClick={() => setAuditSeverityFilter(sev)}
                            className={`px-3 py-1.5 rounded-lg text-3xs font-mono font-bold uppercase transition-colors cursor-pointer border ${
                              auditSeverityFilter === sev
                                ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audit Logs Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 max-h-[500px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
                          <tr className="text-3xs font-mono text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">TIMESTAMP</th>
                            <th className="py-3 px-4">ACTION TYPE</th>
                            <th className="py-3 px-4">PERFORMED BY</th>
                            <th className="py-3 px-4">TARGET ID</th>
                            <th className="py-3 px-4">AUDIT EVENT DETAILS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                          {auditLogs.filter((log) => {
                            const matchesSearch =
                              log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                              log.performedBy.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                              log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                              (log.targetId && log.targetId.toLowerCase().includes(auditSearchTerm.toLowerCase()));
                            const matchesSeverity = auditSeverityFilter === 'ALL' || log.severity === auditSeverityFilter;
                            return matchesSearch && matchesSeverity;
                          }).length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-500 font-light">
                                No audit log events recorded matching your query.
                              </td>
                            </tr>
                          ) : (
                            auditLogs
                              .filter((log) => {
                                const matchesSearch =
                                  log.details.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                                  log.performedBy.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                                  log.action.toLowerCase().includes(auditSearchTerm.toLowerCase()) ||
                                  (log.targetId && log.targetId.toLowerCase().includes(auditSearchTerm.toLowerCase()));
                                const matchesSeverity = auditSeverityFilter === 'ALL' || log.severity === auditSeverityFilter;
                                return matchesSearch && matchesSeverity;
                              })
                              .map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                                  <td className="py-3.5 px-4 text-slate-400 text-3xs whitespace-nowrap font-mono font-semibold">
                                    {log.timestamp}
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase border ${
                                        log.severity === 'success'
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                          : log.severity === 'error'
                                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                          : log.severity === 'warning'
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                      }`}
                                    >
                                      {log.action.replace(/_/g, ' ')}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                    {log.performedBy}
                                  </td>
                                  <td className="py-3.5 px-4 font-bold text-amber-400 whitespace-nowrap">
                                    {log.targetId || '—'}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-300 leading-relaxed font-light">
                                    {log.details}
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
                    {scanResult && !scanLoading && (() => {
                      const normalizedResult = (scanResult.result || '').toLowerCase();
                      const isPass = normalizedResult === 'pass' || normalizedResult === 'entry_granted';
                      const isAlreadyUsed = normalizedResult === 'already_used';
                      const isNotApproved = normalizedResult === 'not_approved';
                      const isInvalid = normalizedResult === 'invalid' || normalizedResult === 'not_found';

                      return (
                        <motion.div
                          ref={resultCardRef}
                          key={`scan-card-${scanResult.result}-${scanResult.order?.id || scanResult.scannedAt || 'result'}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ opacity: 1 }}
                          className={`p-6 sm:p-8 rounded-3xl border-2 text-left shadow-2xl transition-all ${
                            isPass
                              ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 shadow-emerald-950/50'
                              : isAlreadyUsed
                              ? 'bg-rose-950/95 border-rose-500 text-rose-100 shadow-rose-950/80 animate-pulse'
                              : isNotApproved
                              ? 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-amber-950/80'
                              : isInvalid
                              ? 'bg-rose-950/90 border-rose-600 text-rose-100 shadow-rose-950/50'
                              : 'bg-slate-900 border-amber-500/60 text-slate-100 shadow-2xl'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b pb-4 mb-6 border-white/20">
                            <div className="flex items-center gap-3">
                              {isPass ? (
                                <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                                  <ShieldCheck className="w-9 h-9" />
                                </div>
                              ) : isAlreadyUsed ? (
                                <div className="p-3.5 rounded-2xl bg-rose-600 text-white">
                                  <AlertOctagon className="w-9 h-9" />
                                </div>
                              ) : isNotApproved ? (
                                <div className="p-3.5 rounded-2xl bg-amber-500 text-black">
                                  <ShieldAlert className="w-9 h-9" />
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
                                  {isPass
                                    ? '✓ PASS • ENTRY GRANTED'
                                    : isAlreadyUsed
                                    ? '✗ FAIL • TICKET ALREADY USED'
                                    : isNotApproved
                                    ? '⚠ NOT APPROVED YET'
                                    : isInvalid
                                    ? '✗ INVALID TICKET — NOT FOUND'
                                    : `STATUS: ${String(scanResult.result).toUpperCase()}`}
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
                          {isPass && (
                            <div className="space-y-4">
                              {scanResult.order && (
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
                              )}

                              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-mono font-bold text-emerald-200 flex items-center justify-between flex-wrap gap-2">
                                <span>✓ 1ST SCAN SUCCESSFUL • Allow attendee into event area.</span>
                                <span className="text-3xs text-emerald-400">Scanned: {scanResult.scannedAt || 'Just Now'}</span>
                              </div>
                            </div>
                          )}

                          {/* ALREADY USED RESULT */}
                          {isAlreadyUsed && (
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

                          {/* NOT APPROVED YET RESULT */}
                          {isNotApproved && (
                            <div className="space-y-4">
                              {scanResult.order && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-black/50 border border-amber-500/30 font-mono text-xs">
                                  <div>
                                    <span className="text-3xs text-amber-400 block font-bold uppercase">ATTENDEE NAME</span>
                                    <span className="text-xl font-serif font-bold text-white block mt-0.5">
                                      {scanResult.order.customerName}
                                    </span>
                                    <span className="text-amber-300 font-bold block mt-1">{scanResult.order.phone}</span>
                                  </div>

                                  <div>
                                    <span className="text-3xs text-amber-400 block font-bold uppercase">PASS TIER & ORDER</span>
                                    <span className="text-lg font-serif font-bold text-white block mt-0.5">
                                      {scanResult.order.tierName}
                                    </span>
                                    <span className="text-amber-200 font-bold block mt-1">
                                      {scanResult.order.quantity} PASS • ORDER #{scanResult.order.id}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400/50 text-xs font-mono font-bold text-amber-200">
                                ⚠ NOT APPROVED YET! Please approve this order in the Payment Approvals tab first before letting the attendee in.
                              </div>
                            </div>
                          )}

                          {/* INVALID RESULT */}
                          {isInvalid && (
                            <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs font-mono text-rose-100">
                              {scanResult.message || 'No valid approved ticket pass matching this QR code was found in database.'}
                            </div>
                          )}

                          {/* DEFAULT FALLBACK BODY FOR ANY UNMATCHED RESULT */}
                          {!isPass && !isAlreadyUsed && !isNotApproved && !isInvalid && (
                            <div className="space-y-4">
                              {scanResult.order && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-black/50 border border-slate-700 font-mono text-xs">
                                  <div>
                                    <span className="text-3xs text-slate-400 block font-bold uppercase">ATTENDEE NAME</span>
                                    <span className="text-xl font-serif font-bold text-white block mt-0.5">
                                      {scanResult.order.customerName}
                                    </span>
                                    <span className="text-slate-300 font-bold block mt-1">{scanResult.order.phone}</span>
                                  </div>
                                  <div>
                                    <span className="text-3xs text-slate-400 block font-bold uppercase">PASS TIER & ORDER</span>
                                    <span className="text-lg font-serif font-bold text-white block mt-0.5">
                                      {scanResult.order.tierName}
                                    </span>
                                    <span className="text-slate-200 font-bold block mt-1">
                                      {scanResult.order.quantity} PASS • ORDER #{scanResult.order.id}
                                    </span>
                                  </div>
                                </div>
                              )}
                              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200">
                                {scanResult.message || `Verification completed with result: ${scanResult.result}`}
                              </div>
                            </div>
                          )}

                          {/* Auto-reset countdown indicator */}
                          <div className="mt-4 pt-3 border-t border-white/10 text-3xs font-mono opacity-70 text-right">
                            Auto-resetting scanner in 2.5s for next attendee...
                          </div>
                        </motion.div>
                      );
                    })()}
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

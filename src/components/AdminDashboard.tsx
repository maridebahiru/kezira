import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye,
  Check,
  XCircle,
  QrCode,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { eventConfig, ScheduleItem } from '../config/event';
import { ticketService, OrderRecord } from '../services/ticketService';
import logoImg from '../assets/logo.png';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'schedule'>('orders');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(eventConfig.schedule[0].items);

  // Receipt Modal Inspection State
  const [inspectReceiptOrder, setInspectReceiptOrder] = useState<OrderRecord | null>(null);

  // New Schedule Item State
  const [showAddScheduleModal, setShowAddScheduleModal] = useState<boolean>(false);
  const [newScheduleTime, setNewScheduleTime] = useState<string>('2:00 PM (8:00 Local)');
  const [newScheduleTitle, setNewScheduleTitle] = useState<string>('');
  const [newScheduleArtist, setNewScheduleArtist] = useState<string>('');
  const [newScheduleStage, setNewScheduleStage] = useState<string>('GRAND CINEMATIC ARENA');
  const [newScheduleCategory, setNewScheduleCategory] = useState<'music' | 'art' | 'vip' | 'keynote'>('music');

  useEffect(() => {
    if (isOpen) {
      setOrders(ticketService.getOrders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.toLowerCase() === 'admin' || passcode === '') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleApproveOrder = (orderId: string) => {
    const updated = ticketService.updateOrderStatus(orderId, 'APPROVED');
    setOrders(updated);
  };

  const handleRejectOrder = (orderId: string) => {
    const updated = ticketService.updateOrderStatus(orderId, 'REJECTED', 'Receipt verification failed');
    setOrders(updated);
  };

  const handleToggleCheckIn = (orderId: string) => {
    const updated = ticketService.toggleCheckIn(orderId);
    setOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = ticketService.deleteOrder(orderId);
    setOrders(updated);
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

  const pendingCount = orders.filter((o) => o.status === 'PENDING_APPROVAL').length;
  const approvedCount = orders.filter((o) => o.status === 'APPROVED' || o.status === 'CHECKED_IN').length;
  const totalRevenueETB = orders
    .filter((o) => o.status === 'APPROVED' || o.status === 'CHECKED_IN')
    .reduce((sum, o) => sum + o.totalETB, 0);
  const totalPassesSold = orders
    .filter((o) => o.status === 'APPROVED' || o.status === 'CHECKED_IN')
    .reduce((sum, o) => sum + o.quantity, 0);
  const totalCheckedIn = orders.filter((o) => o.checkedIn).reduce((sum, o) => sum + o.quantity, 0);

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer Name,Phone,Tier,Quantity,Total ETB,Payment Method,Date,Status\n';
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.customerName}","${o.phone}","${o.tierName}",${o.quantity},${o.totalETB},"${o.paymentMethod}","${o.purchaseDate}","${o.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kezira_Media_Guestlist_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-[#0f172a] text-slate-100 rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
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
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isAuthenticated ? (
            /* Login Form */
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
              <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
                ADMIN AUTHENTICATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-sm mb-8">
                Enter your PIN code to inspect payment receipts, approve tickets, and manage event operations.
              </p>

              <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234 or leave blank)..."
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-center font-mono text-base text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
                />
                {authError && (
                  <span className="text-xs font-mono text-rose-400 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Incorrect PIN code. Try '1234'.
                  </span>
                )}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase cursor-pointer shadow-lg hover:brightness-110 transition-all"
                >
                  ACCESS DASHBOARD
                </button>
              </form>
            </div>
          ) : (
            /* Main Dashboard View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Analytics KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 bg-slate-900/50 border-b border-slate-800 shrink-0">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">
                      APPROVED REVENUE (ETB)
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                      {totalRevenueETB.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">
                      PENDING RECEIPTS
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                      {pendingCount} ORDERS
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">
                      APPROVED PASSES
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      {totalPassesSold} / 1,200
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-3xs font-mono text-slate-400 tracking-widest block uppercase">
                      GATE CHECK-INS
                    </span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                      {totalCheckedIn} ATTENDEES
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-800 bg-slate-900/30 shrink-0">
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
                    onClick={() => setActiveTab('schedule')}
                    className={`px-5 py-3 rounded-t-xl text-xs font-mono tracking-widest uppercase transition-all border-t border-x cursor-pointer ${
                      activeTab === 'schedule'
                        ? 'bg-slate-900 text-amber-400 border-slate-700 font-bold'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                    }`}
                  >
                    LINEUP & PROGRAMME ({scheduleItems.length})
                  </button>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 border border-slate-700 cursor-pointer shadow-sm transition-colors mb-2"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXPORT CSV</span>
                </button>
              </div>

              {/* Tab Content Container */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-900/40">
                {activeTab === 'orders' ? (
                  <div>
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by customer name, phone number, or Order ID (#KZ-2026)..."
                        className="w-full py-3 pl-11 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 shadow-inner"
                      />
                    </div>

                    {/* Orders Table */}
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-slate-900 text-slate-400 uppercase tracking-widest border-b border-slate-800">
                            <tr>
                              <th className="p-4">ORDER ID</th>
                              <th className="p-4">CUSTOMER NAME</th>
                              <th className="p-4">PHONE</th>
                              <th className="p-4">PASS TIER</th>
                              <th className="p-4">QTY</th>
                              <th className="p-4">AMOUNT</th>
                              <th className="p-4">RECEIPT PROOF</th>
                              <th className="p-4">STATUS</th>
                              <th className="p-4 text-right">ADMIN ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            {filteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="p-4 font-bold text-amber-400">{order.id}</td>
                                <td className="p-4 font-serif text-sm font-semibold text-white">{order.customerName}</td>
                                <td className="p-4 text-slate-400">{order.phone}</td>
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-md text-3xs font-bold uppercase ${
                                      order.tierName.includes('VIP')
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                                    }`}
                                  >
                                    {order.tierName}
                                  </span>
                                </td>
                                <td className="p-4 font-bold">{order.quantity}</td>
                                <td className="p-4 font-bold text-slate-100">{order.totalETB.toLocaleString()} ETB</td>
                                
                                {/* Receipt Inspection Button */}
                                <td className="p-4">
                                  {order.receiptUrl ? (
                                    <button
                                      onClick={() => setInspectReceiptOrder(order)}
                                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-3xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>VIEW PROOF</span>
                                    </button>
                                  ) : (
                                    <span className="text-3xs text-slate-500 italic">No upload</span>
                                  )}
                                </td>

                                {/* Status Badge */}
                                <td className="p-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase ${
                                      order.status === 'APPROVED' || order.status === 'CHECKED_IN'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : order.status === 'REJECTED'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    }`}
                                  >
                                    {order.status === 'PENDING_APPROVAL' ? 'AWAITING APPROVAL' : order.status}
                                  </span>
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right flex items-center justify-end gap-2">
                                  {order.status === 'PENDING_APPROVAL' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveOrder(order.id)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-3xs uppercase flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                                      >
                                        <Check className="w-3.5 h-3.5" /> APPROVE & ISSUE QR
                                      </button>
                                      <button
                                        onClick={() => handleRejectOrder(order.id)}
                                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 font-bold text-3xs uppercase flex items-center gap-1 cursor-pointer transition-colors"
                                      >
                                        <XCircle className="w-3.5 h-3.5" /> REJECT
                                      </button>
                                    </>
                                  )}

                                  {(order.status === 'APPROVED' || order.status === 'CHECKED_IN') && (
                                    <button
                                      onClick={() => handleToggleCheckIn(order.id)}
                                      className={`px-3 py-1.5 rounded-lg text-3xs font-bold uppercase cursor-pointer transition-colors ${
                                        order.checkedIn
                                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                          : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-sm'
                                      }`}
                                    >
                                      {order.checkedIn ? 'CHECKED IN' : 'GATE CHECK-IN'}
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Schedule Manager */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-serif font-bold text-white">OCTOBER 3, 2026 — EVENT PROGRAMME</h3>
                        <p className="text-xs font-mono text-slate-400">Live timetable running 9:00 AM to 9:00 PM (3:00 to 9:00 Ethiopian Local Time)</p>
                      </div>
                      <button
                        onClick={() => setShowAddScheduleModal(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ADD PERFORMANCE ACT</span>
                      </button>
                    </div>

                    {/* Schedule Items */}
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

      {/* INSPECT RECEIPT PROOF MODAL */}
      {inspectReceiptOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="w-full max-w-xl bg-slate-900 border border-amber-500/50 p-6 rounded-3xl text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-3xs font-mono text-amber-400 uppercase font-bold block">
                  PAYMENT RECEIPT INSPECTOR
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  ORDER {inspectReceiptOrder.id} ({inspectReceiptOrder.customerName})
                </h3>
              </div>
              <button
                onClick={() => setInspectReceiptOrder(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono mb-6">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p><strong>Amount:</strong> {inspectReceiptOrder.totalETB.toLocaleString()} ETB</p>
                <p><strong>Pass Tier:</strong> {inspectReceiptOrder.tierName}</p>
                <p><strong>Method:</strong> {inspectReceiptOrder.paymentMethod}</p>
                <p><strong>Phone:</strong> {inspectReceiptOrder.phone}</p>
              </div>

              {/* Receipt Image Box */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 p-2 max-h-[50vh] flex items-center justify-center">
                {inspectReceiptOrder.receiptUrl ? (
                  <img
                    src={inspectReceiptOrder.receiptUrl}
                    alt="Receipt Screenshot"
                    className="max-h-[45vh] w-auto object-contain rounded-xl"
                  />
                ) : (
                  <div className="py-12 text-slate-500 flex flex-col items-center">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span>No receipt preview available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons inside Inspector */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleApproveOrder(inspectReceiptOrder.id);
                  setInspectReceiptOrder(null);
                }}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" /> APPROVE & ISSUE QR
              </button>
              <button
                onClick={() => {
                  handleRejectOrder(inspectReceiptOrder.id);
                  setInspectReceiptOrder(null);
                }}
                className="w-1/2 py-3 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 font-bold text-xs font-mono uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> REJECT PAYMENT
              </button>
            </div>
          </div>
        </div>
      )}

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

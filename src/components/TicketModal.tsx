import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  QrCode,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  FileCheck,
  AlertCircle,
  Phone,
  User,
  Search,
  XCircle,
  Ticket,
  Send,
  Copy,
  Check,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { eventConfig, TicketTier } from '../config/event';
import { PAYMENT_METHODS } from '../config/paymentMethods';
import { ticketService, OrderRecord } from '../services/ticketService';
import enkuuLogo from '../assets/enkuu.png';
import papaGardenLogo from '../assets/papa.png';
import { TicketPassCard } from './TicketPassCard';

interface TelegramReceiptCardProps {
  order: OrderRecord;
}

const TelegramReceiptCard: React.FC<TelegramReceiptCardProps> = ({ order }) => {
  const [copied, setCopied] = useState(false);

  const formattedDetails = `🎟️ MAMSHA FEST 2026 — REGISTRATION RECEIPT VERIFICATION
---------------------------------
Order ID: ${order.id}
Name: ${order.customerName}
Phone: ${order.phone}
${order.email ? `Email: ${order.email}\n` : ''}Pass: ${order.quantity}x ${order.tierName}
Total Amount: ${order.totalETB.toLocaleString()} ETB
Payment Method: ${order.paymentMethod}
Txn Ref: ${order.transactionRef}
Referral: ${order.referralCode || 'DIRECT'} (${order.referralSource || 'Other'})
Submitted: ${order.purchaseDate}
---------------------------------
Hello Admin! I have submitted my payment receipt PDF / Screenshot for Mamsha Fest ticket verification.`;

  const telegramUsername = 'Enqu_events';
  const telegramAccount = `https://t.me/${telegramUsername}`;
  const encodedText = encodeURIComponent(formattedDetails);
  const telegramDraftUrl = `https://t.me/${telegramUsername}?text=${encodedText}`;

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(formattedDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-white via-slate-50 to-sky-50/50 border-2 border-amber-400/90 text-left shadow-2xl space-y-5 my-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-base sm:text-lg">
          <FileCheck className="w-6 h-6 text-amber-600 shrink-0" />
          <span>PAYMENT RECEIPT VERIFICATION</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-950 border border-amber-400 text-3xs font-mono font-bold uppercase tracking-wider">
          ORDER {order.id}
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed font-light">
        Thank you, <strong className="font-serif text-slate-900">{order.customerName}</strong>! Your registration is registered. To accelerate admin verification, please send your <strong>Payment Receipt Screenshot or PDF</strong> directly to our Telegram admin.
      </p>

      {/* Prominent Telegram Button */}
      <div className="space-y-2">
        <a
          href={telegramDraftUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm font-mono tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Send className="w-5 h-5 animate-pulse shrink-0" />
          <span>SEND RECEIPT PDF / SCREENSHOT ON TELEGRAM</span>
          <ExternalLink className="w-4 h-4 opacity-80 shrink-0" />
        </a>
        <div className="flex items-center justify-between text-3xs font-mono text-slate-600 px-1">
          <span>Official Admin Telegram Account: <strong className="text-sky-700 font-bold">@{telegramUsername}</strong></span>
          <a
            href={telegramAccount}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline font-bold hover:text-sky-800"
          >
            t.me/{telegramUsername}
          </a>
        </div>
      </div>

      {/* Detailed Customer & Order Info Card (Positioned Under Telegram Button) */}
      <div className="p-4 rounded-2xl bg-white border border-amber-300/80 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
          <span className="text-3xs font-mono font-extrabold uppercase text-slate-600 tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600" /> YOUR DETAILED REGISTRATION INFORMATION
          </span>
          <button
            onClick={handleCopyDetails}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-400/40 text-amber-950 border border-amber-400/60 text-3xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">COPIED TO CLIPBOARD!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-800" />
                <span>COPY DETAILS FOR TELEGRAM</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Order ID</span>
            <span className="font-bold text-amber-700 text-sm">{order.id}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Customer Full Name</span>
            <span className="font-bold text-slate-900 text-sm">{order.customerName}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Phone Number</span>
            <span className="font-bold text-slate-900">{order.phone}</span>
          </div>

          {order.email && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-3xs text-slate-500 uppercase block font-bold">Email Address</span>
              <span className="font-bold text-slate-900 truncate block">{order.email}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Pass Tier & Quantity</span>
            <span className="font-bold text-slate-900">{order.quantity}x {order.tierName}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Total Investment</span>
            <span className="font-bold text-emerald-700 text-sm">{order.totalETB.toLocaleString()} ETB</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Payment Method</span>
            <span className="font-bold text-slate-900">{order.paymentMethod}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-3xs text-slate-500 uppercase block font-bold">Transaction Reference</span>
            <span className="font-bold text-amber-800 select-all tracking-wider">{order.transactionRef}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-1 sm:col-span-2 flex items-center justify-between flex-wrap gap-1">
            <div>
              <span className="text-3xs text-slate-500 uppercase block font-bold">Referral Info</span>
              <span className="font-bold text-slate-900">{order.referralCode || 'DIRECT'} ({order.referralSource || 'Other'})</span>
            </div>
            <span className="text-3xs text-slate-400 font-mono">{order.purchaseDate}</span>
          </div>
        </div>
      </div>

      {/* Verification Steps Guide */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 text-2xs font-mono text-slate-700">
        <span className="font-bold text-amber-950 uppercase block mb-1 tracking-wider">
          💡 SIMPLE 3-STEP TELEGRAM UPLOAD INSTRUCTIONS:
        </span>
        <ol className="list-decimal list-inside space-y-1 text-slate-700 font-light">
          <li>Click <strong className="text-amber-900 font-bold">COPY DETAILS FOR TELEGRAM</strong> to copy your registration info.</li>
          <li>Click <strong className="text-sky-700 font-bold">SEND RECEIPT PDF / SCREENSHOT ON TELEGRAM</strong> to open <strong className="text-sky-700">@{telegramUsername}</strong>.</li>
          <li>Paste your details and attach your bank/Telebirr payment receipt image or PDF file!</li>
        </ol>
      </div>
    </div>
  );
};

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: TicketTier | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  initialTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    initialTier || eventConfig.ticketTypes[1]
  );
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<'configure' | 'payment' | 'submitted'>('configure');
  const [activeTab, setActiveTab] = useState<'buy' | 'lookup'>('buy');

  // Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<OrderRecord | null | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  // Customer Form Inputs
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<OrderRecord['paymentMethod']>('Bank of Abyssinia (BOA)');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [referralSource, setReferralSource] = useState<string>('Instagram');
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralError, setReferralError] = useState<string>('');
  const [receiptError, setReceiptError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active Order State
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
      setActiveTab('buy');
    }
  }, [initialTier]);

  // Real-time listener: when admin approves order, automatically unlock QR pass in real-time!
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = ticketService.subscribeOrders((orders) => {
      if (currentOrder) {
        const found = orders.find((o) => o.id === currentOrder.id);
        if (found) setCurrentOrder(found);
      }
      if (searchResult) {
        const found = orders.find((o) => o.id === searchResult.id);
        if (found) setSearchResult(found);
      }
    });
    return () => unsubscribe();
  }, [isOpen, currentOrder?.id, searchResult?.id]);

  if (!isOpen) return null;

  const totalETB = selectedTier.priceETB * quantity;

  // Submit Order
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSource = referralSource.trim();
    const trimmedCode = referralCode.trim();

    if (!customerName || !phone || !transactionRef.trim()) {
      setReceiptError(true);
      return;
    }

    if (!trimmedSource || !trimmedCode) {
      setReferralError('Referral Code is required! Please enter a valid referral code before submitting.');
      return;
    }

    const orderData: Omit<OrderRecord, 'id'> = {
      customerName,
      phone,
      email,
      tierName: selectedTier.name,
      tierId: selectedTier.id,
      quantity,
      totalETB,
      paymentMethod,
      transactionRef: transactionRef.trim(),
      referralSource: trimmedSource,
      referralCode: trimmedCode,
      purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_APPROVAL',
      checkedIn: false,
    };

    try {
      setIsSubmitting(true);
      setReferralError('');
      const newOrderId = await ticketService.addOrder(orderData);
      setCurrentOrder({ ...orderData, id: newOrderId });
      setStep('submitted');
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setReferralError(err?.message || 'Failed to submit order. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = ticketService.findOrder(searchQuery.trim());
    setSearchResult(found || null);
    setHasSearched(true);
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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel-gold p-6 sm:p-8 shadow-2xl border border-amber-500/50 z-10 my-auto overflow-hidden text-slate-900"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/80 hover:bg-amber-400 hover:text-black text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-300/80 pb-4 pr-12">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'buy'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              BUY TICKETS
            </button>
            <button
              onClick={() => setActiveTab('lookup')}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'lookup'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" /> CHECK TICKET STATUS
            </button>
          </div>

          {/* TAB 1: BUY TICKET FLOW */}
          {activeTab === 'buy' && (
            <>
              {/* STEP 1: CONFIGURE TIER & QUANTITY */}
              {step === 'configure' && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <img src={enkuuLogo} alt="ENQUU Logo" className="h-9 w-auto object-contain filter drop-shadow-sm" />
                      <img src={papaGardenLogo} alt="PAPA GARDEN Logo" className="h-9 w-auto object-contain filter drop-shadow-sm" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-3xs font-mono tracking-widest text-amber-900 font-bold uppercase">
                        MAMSHA FEST • RESERVE FESTIVAL PASS
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6">
                    SELECT TIER & QUANTITY
                  </h2>

                  {/* Tier Switcher Pills */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {eventConfig.ticketTypes.map((tier) => {
                      const isSelected = tier.id === selectedTier.id;
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-500 text-black border-amber-600 font-bold shadow-md'
                              : 'bg-white/80 border-slate-200 text-slate-700 hover:border-amber-400'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-serif font-bold">{tier.name}</span>
                          <span className={`text-xs font-mono mt-1 ${isSelected ? 'text-black font-extrabold' : 'text-amber-700 font-bold'}`}>
                            {tier.priceETB.toLocaleString()} ETB
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quantity Counter */}
                  <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 flex items-center justify-between mb-6 shadow-sm">
                    <div>
                      <span className="text-xs font-mono text-slate-800 font-bold uppercase block">
                        NUMBER OF PASSES
                      </span>
                      <span className="text-3xs font-mono text-slate-500">
                        Max 6 passes per order
                      </span>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-amber-400 text-slate-900 hover:text-black flex items-center justify-center font-bold shadow-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-base font-bold text-amber-800 min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(6, quantity + 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-amber-400 text-slate-900 hover:text-black flex items-center justify-center font-bold shadow-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 mb-8 flex items-center justify-between">
                    <div>
                      <span className="text-2xs font-mono tracking-widest text-amber-900 font-bold uppercase block">
                        TOTAL INVESTMENT ({quantity} PASS)
                      </span>
                      <span className="text-2xl font-serif font-bold text-slate-900">
                        {totalETB.toLocaleString()} ETB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xs font-mono text-amber-800 font-bold uppercase tracking-widest block">
                        OCTOBER 3, 2026
                      </span>
                      <span className="text-3xs font-mono text-slate-600">PAPA, DIRE DAWA</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setStep('payment')}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110"
                    >
                      <span>PROCEED TO PAYMENT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: BANK TRANSFER & RECEIPT UPLOAD */}
              {step === 'payment' && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-6 h-6 text-amber-700" />
                    <span className="text-3xs font-mono tracking-widest text-amber-900 font-bold uppercase">
                      STEP 2: PAYMENT & PROOF SUBMISSION
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
                    TRANSFER {totalETB.toLocaleString()} ETB
                  </h2>

                  {/* Bank Accounts Box */}
                  <div className="p-4 rounded-2xl bg-white/90 border border-slate-300 mb-6 space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-3xs font-bold uppercase text-slate-500 block tracking-widest">
                        OFFICIAL PAYMENT ACCOUNTS
                      </span>
                      <span className="text-3xs font-bold uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        Account: Abel Zigyalew
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PAYMENT_METHODS.map((pm) => (
                        <div
                          key={pm.id}
                          className={`p-3 rounded-xl ${pm.bgClass} border ${pm.borderClass}`}
                        >
                          <span className={`font-bold ${pm.textClass} block text-2xs uppercase`}>
                            {pm.name}
                          </span>
                          <span className="text-sm font-bold text-slate-900 block font-mono">
                            {pm.accountNumber}
                          </span>
                          <span className="text-3xs text-slate-600 block">
                            Account: {pm.accountName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Inputs Form */}
                  <form onSubmit={handleSubmitPayment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                          FULL NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Abebe Bikila"
                          className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                          PHONE NUMBER *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251 91 234 5678"
                          className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                        PAYMENT METHOD USED *
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as OrderRecord['paymentMethod'])}
                        className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                      >
                        {PAYMENT_METHODS.map((pm) => (
                          <option key={pm.id} value={pm.name}>
                            {pm.selectOptionText}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Transaction Reference */}
                    <div>
                      <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                        TRANSACTION REFERENCE NUMBER *
                      </label>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-dashed border-amber-400">
                        <FileCheck className="w-6 h-6 text-amber-700 shrink-0" />
                        <input
                          type="text"
                          required
                          value={transactionRef}
                          onChange={(e) => {
                            setTransactionRef(e.target.value);
                            setReceiptError(false);
                          }}
                          placeholder="e.g. TB240912.1830.A12345"
                          className="w-full bg-transparent text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <span className="text-3xs font-mono text-slate-500 block mt-1">
                        Copy this from your Telebirr / bank confirmation SMS or receipt.
                      </span>
                    </div>

                    {/* Referral Source & Referral Code Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                          REFERRAL SOURCE *
                        </label>
                        <select
                          required
                          value={referralSource}
                          onChange={(e) => {
                            setReferralSource(e.target.value);
                            setReferralError('');
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Friend/Word of Mouth">Friend/Word of Mouth</option>
                          <option value="Radio">Radio</option>
                          <option value="Poster/Flyer">Poster/Flyer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                          REFERRAL CODE *
                        </label>
                        <input
                          type="text"
                          required
                          value={referralCode}
                          onChange={(e) => {
                            setReferralCode(e.target.value);
                            setReferralError('');
                          }}
                          placeholder="e.g. PROMO2026 or Promoter Code"
                          className={`w-full py-2.5 px-3 rounded-xl bg-white border ${
                            referralError ? 'border-rose-500' : 'border-slate-300'
                          } text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500`}
                        />
                      </div>
                    </div>

                    {receiptError && (
                      <span className="text-xs font-mono text-rose-700 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-4 h-4" /> Please fill your name, phone, and transaction reference number!
                      </span>
                    )}

                    {referralError && (
                      <span className="text-xs font-mono text-rose-700 flex items-center gap-1 font-bold">
                        <AlertCircle className="w-4 h-4" /> {referralError}
                      </span>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep('configure')}
                        className="w-1/3 py-3.5 rounded-full bg-slate-200 text-slate-900 font-mono text-xs font-bold uppercase cursor-pointer"
                      >
                        BACK
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !referralCode.trim() || !referralSource.trim()}
                        className="w-2/3 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono tracking-widest uppercase cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR ADMIN APPROVAL'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: SUBMITTED CONFIRMATION & QR STUB (WHEN APPROVED) */}
              {step === 'submitted' && currentOrder && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 mb-4">
                    {currentOrder.status === 'APPROVED' || currentOrder.status === 'CHECKED_IN' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-800 animate-spin" />
                    )}
                    <span className="text-3xs font-mono tracking-widest text-amber-900 uppercase font-bold">
                      ORDER {currentOrder.id} • STATUS: {currentOrder.status}
                    </span>
                  </div>

                  {currentOrder.status === 'PENDING_APPROVAL' ? (
                    <TelegramReceiptCard order={currentOrder} />
                  ) : (
                    /* Downloadable Anti-Fraud Pass Card when Approved */
                    <div className="my-4">
                      <TicketPassCard order={currentOrder} />
                    </div>
                  )}

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase shadow-md cursor-pointer mt-2"
                  >
                    CLOSE
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: CHECK TICKET STATUS LOOKUP */}
          {activeTab === 'lookup' && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <img src={enkuuLogo} alt="ENQUU Logo" className="h-9 w-auto object-contain filter drop-shadow-sm" />
                  <img src={papaGardenLogo} alt="PAPA GARDEN Logo" className="h-9 w-auto object-contain filter drop-shadow-sm" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-3xs font-mono tracking-widest text-amber-900 font-bold uppercase">
                    MAMSHA FEST • PASS LOOKUP
                  </span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
                CHECK YOUR ORDER STATUS
              </h2>
              <p className="text-xs text-slate-600 mb-6 font-light">
                Enter your Order ID (e.g. <span className="font-mono font-bold text-slate-900">KZ-2026-8803</span>) or Phone Number to view your live verification status and access your QR ticket pass.
              </p>

              <form onSubmit={handleSearchTicket} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHasSearched(false);
                    }}
                    placeholder="Enter Order ID (e.g. KZ-2026-8803) or Phone Number..."
                    className="w-full py-3 pl-10 pr-4 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider shadow-md cursor-pointer shrink-0"
                >
                  SEARCH
                </button>
              </form>

              {hasSearched && (
                <div>
                  {!searchResult ? (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 text-center">
                      <AlertCircle className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                      <h4 className="font-serif font-bold text-slate-900 text-base mb-1">No Order Found</h4>
                      <p className="text-xs text-slate-600 font-light max-w-md mx-auto">
                        We couldn't find an order matching "<span className="font-mono font-bold">{searchQuery}</span>". Double check your Order ID or phone number, or reserve a new pass.
                      </p>
                    </div>
                  ) : searchResult.status === 'PENDING_APPROVAL' ? (
                    <TelegramReceiptCard order={searchResult} />
                  ) : searchResult.status === 'REJECTED' ? (
                    <div className="p-6 rounded-2xl bg-rose-50 border border-rose-300 text-left mb-4 shadow-lg">
                      <div className="flex items-center gap-2 text-rose-800 font-mono font-bold text-xs uppercase mb-2">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>STATUS: ORDER REJECTED</span>
                      </div>
                      <p className="text-xs text-slate-700 mb-2">
                        Reason: <strong>{searchResult.rejectionReason || 'Transaction reference could not be verified'}</strong>
                      </p>
                      <p className="text-3xs font-mono text-slate-500">
                        Please contact Mamsha Fest support on Telegram with Order ID {searchResult.id}.
                      </p>
                    </div>
                  ) : (
                    <div className="my-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span className="text-3xs font-mono tracking-widest text-emerald-900 uppercase font-bold">
                          TICKET APPROVED • READY FOR FESTIVAL ENTRY
                        </span>
                      </div>
                      <TicketPassCard order={searchResult} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TicketModal;

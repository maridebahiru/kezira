import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  QrCode,
  Shield,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Building2,
  FileCheck,
  Search,
  AlertCircle,
  Phone,
  User,
} from 'lucide-react';
import { eventConfig, TicketTier } from '../config/event';
import { ticketService, OrderRecord } from '../services/ticketService';
import logoImg from '../assets/logo.png';
import { TicketPassCard } from './TicketPassCard';

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
  const [step, setStep] = useState<'configure' | 'payment' | 'submitted' | 'lookup'>('configure');

  // Customer Form Inputs
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<OrderRecord['paymentMethod']>('Telebirr');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreviewUrl, setReceiptPreviewUrl] = useState<string>('');
  const [receiptError, setReceiptError] = useState<boolean>(false);

  // Active Order State
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(null);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<OrderRecord | null | undefined>(undefined);

  useEffect(() => {
    if (initialTier) {
      setSelectedTier(initialTier);
    }
  }, [initialTier]);

  if (!isOpen) return null;

  const totalETB = selectedTier.priceETB * quantity;

  // Handle Receipt Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setReceiptError(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order & Receipt
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !receiptPreviewUrl) {
      setReceiptError(true);
      return;
    }

    const orderId = `KZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      customerName,
      phone,
      email,
      tierName: selectedTier.name,
      tierId: selectedTier.id,
      quantity,
      totalETB,
      paymentMethod,
      receiptUrl: receiptPreviewUrl,
      receiptFileName: receiptFile ? receiptFile.name : 'payment_receipt.png',
      purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'PENDING_APPROVAL',
      checkedIn: false,
    };

    ticketService.addOrder(newOrder);
    setCurrentOrder(newOrder);
    setStep('submitted');
  };

  // Order Lookup
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery) return;
    const found = ticketService.findOrder(lookupQuery);
    setLookupResult(found || null);
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

          {/* STEP 1: CONFIGURE TIER & QUANTITY */}
          {step === 'configure' && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img src={logoImg} alt="KEZIRA Logo" className="h-8 w-auto object-contain filter drop-shadow-sm" />
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span className="text-3xs font-mono tracking-widest text-amber-900 font-bold uppercase">
                    RESERVE FESTIVAL PASS
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
                  <span className="text-3xs font-mono text-slate-600">MIDER BABUR, DIRE DAWA</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110"
                >
                  <span>PROCEED TO PAYMENT & RECEIPT UPLOAD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setStep('lookup')}
                  className="text-2xs font-mono text-amber-900 font-bold underline hover:text-slate-900 text-center uppercase tracking-widest cursor-pointer mt-1"
                >
                  ALREADY SUBMITTED? CHECK TICKET STATUS
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
                <span className="text-3xs font-bold uppercase text-slate-500 block tracking-widest">
                  KEZIRA MEDIA OFFICIAL BANK ACCOUNTS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900 block">TELEBIRR</span>
                    <span className="text-sm font-bold text-slate-900 block">+251 91 100 2026</span>
                    <span className="text-3xs text-slate-600 block">Account: KEZIRA MEDIA</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="font-bold text-blue-900 block">CBE (COMMERCIAL BANK)</span>
                    <span className="text-sm font-bold text-slate-900 block">1000 4892 3012 4</span>
                    <span className="text-3xs text-slate-600 block">Account: KEZIRA MEDIA</span>
                  </div>
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
                    <option value="Telebirr">Telebirr (+251 91 100 2026)</option>
                    <option value="CBE (Commercial Bank)">CBE (1000 4892 3012 4)</option>
                    <option value="Dashen Bank">Dashen Bank</option>
                    <option value="BOA (Bank of Abyssinia)">BOA (Bank of Abyssinia)</option>
                  </select>
                </div>

                {/* File Uploader */}
                <div>
                  <label className="block text-3xs font-mono font-bold text-slate-700 uppercase mb-1">
                    UPLOAD RECEIPT / SCREENSHOT *
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-dashed border-amber-400 hover:border-amber-600 transition-colors cursor-pointer">
                    {receiptPreviewUrl ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={receiptPreviewUrl}
                          alt="Receipt Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-amber-500 shadow-sm shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-xs font-mono font-bold text-slate-900 block truncate">
                            {receiptFile ? receiptFile.name : 'Receipt Screenshot'}
                          </span>
                          <span className="text-3xs font-mono text-emerald-700 font-bold block flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> File ready for submission
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Upload className="w-6 h-6 text-amber-700" />
                        <span className="text-xs font-mono font-bold text-slate-900">
                          Click to upload Telebirr / Bank screenshot
                        </span>
                        <span className="text-3xs font-mono text-slate-500">
                          PNG, JPG, JPEG, or PDF accepted
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {receiptError && (
                  <span className="text-xs font-mono text-rose-700 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-4 h-4" /> Please fill your name, phone, and upload a valid receipt image!
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
                    className="w-2/3 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs font-mono tracking-widest uppercase cursor-pointer shadow-md"
                  >
                    SUBMIT FOR ADMIN APPROVAL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: SUBMITTED CONFIRMATION & QR STUB (WHEN APPROVED) */}
          {step === 'submitted' && currentOrder && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 mb-4">
                {currentOrder.status === 'APPROVED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-800 animate-spin" />
                )}
                <span className="text-3xs font-mono tracking-widest text-amber-900 uppercase font-bold">
                  ORDER {currentOrder.id} • STATUS: {currentOrder.status}
                </span>
              </div>

              {currentOrder.status === 'PENDING_APPROVAL' ? (
                <div className="p-6 rounded-2xl bg-white border border-amber-400 text-left mb-6 shadow-xl">
                  <div className="flex items-center gap-3 text-amber-900 font-serif font-bold text-lg mb-2">
                    <FileCheck className="w-6 h-6 text-amber-700" />
                    <span>RECEIPT SUBMITTED FOR VERIFICATION</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-light mb-4">
                    Thank you, <strong className="font-serif text-slate-900">{currentOrder.customerName}</strong>! Your payment receipt for{' '}
                    <strong>{currentOrder.quantity} {currentOrder.tierName}</strong> ({currentOrder.totalETB.toLocaleString()} ETB) has been received.
                  </p>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-2xs font-mono text-slate-700 space-y-1 mb-4">
                    <p><strong>Order Reference:</strong> {currentOrder.id}</p>
                    <p><strong>Phone:</strong> {currentOrder.phone}</p>
                    <p><strong>Payment Method:</strong> {currentOrder.paymentMethod}</p>
                  </div>
                  <p className="text-3xs font-mono text-slate-500 uppercase tracking-widest">
                    Kezira Media admin will inspect your receipt screenshot. Once approved, your QR ticket code will unlock automatically!
                  </p>
                </div>
              ) : (
                /* Downloadable Anti-Fraud Pass Card when Approved */
                <div className="my-4">
                  <TicketPassCard order={currentOrder} />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('lookup')}
                  className="w-1/2 py-3 rounded-full bg-slate-200 text-slate-900 font-mono text-xs font-bold uppercase"
                >
                  CHECK STATUS
                </button>
                <button
                  onClick={onClose}
                  className="w-1/2 py-3 rounded-full bg-amber-500 text-black font-extrabold text-xs font-mono uppercase shadow-md"
                >
                  CLOSE
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER LOOKUP */}
          {step === 'lookup' && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                CHECK TICKET APPROVAL STATUS
              </h2>
              <p className="text-xs font-mono text-slate-600 mb-6">
                Enter your Order ID (e.g. #KZ-2026-8801) or phone number to check if your receipt has been approved by admin.
              </p>

              <form onSubmit={handleLookup} className="flex gap-2 mb-6">
                <input
                  type="text"
                  required
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Enter Order ID or Phone Number..."
                  className="flex-1 py-3 px-4 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-mono font-bold text-xs uppercase cursor-pointer"
                >
                  SEARCH
                </button>
              </form>

              {lookupResult === null && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono mb-6">
                  No ticket order found matching '{lookupQuery}'. Please double-check your Order ID or phone number.
                </div>
              )}

              {lookupResult && (
                <div className="p-4 rounded-xl bg-white border border-amber-400 mb-6 text-xs font-mono space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-amber-900">{lookupResult.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-3xs font-bold ${
                        lookupResult.status === 'APPROVED' || lookupResult.status === 'CHECKED_IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lookupResult.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lookupResult.status}
                    </span>
                  </div>
                  <p><strong>Customer:</strong> {lookupResult.customerName}</p>
                  <p><strong>Tier:</strong> {lookupResult.tierName} ({lookupResult.quantity} Pass)</p>
                  <p><strong>Total:</strong> {lookupResult.totalETB.toLocaleString()} ETB</p>
                  {lookupResult.status === 'APPROVED' && (
                    <button
                      onClick={() => {
                        setCurrentOrder(lookupResult);
                        setStep('submitted');
                      }}
                      className="w-full mt-2 py-2 rounded-lg bg-amber-500 text-black font-bold text-3xs uppercase"
                    >
                      VIEW APPROVED QR TICKET STUB
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep('configure')}
                className="w-full py-3 rounded-full bg-slate-200 text-slate-900 font-mono text-xs font-bold uppercase"
              >
                BACK TO RESERVATION
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TicketModal;

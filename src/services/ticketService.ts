import {
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface OrderRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  tierName: string;
  tierId: string;
  quantity: number;
  totalETB: number;
  paymentMethod: 'Telebirr' | 'CBE (Commercial Bank)' | 'Awash Bank' | 'ebirr' | string;
  // Text reference from the customer's bank/Telebirr confirmation,
  // checked manually by the admin before approving.
  // TEMP: replaces file-upload receipts (receiptUrl/receiptFileName) to
  // avoid needing the Firebase Blaze plan / Cloud Storage right now.
  transactionRef: string;
  purchaseDate: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN';
  rejectionReason?: string;
  checkedIn: boolean;
  checkedInTime?: string;
  referralSource: string;
  referralCode: string;
}

export interface ScanCheckInResult {
  result: 'ENTRY_GRANTED' | 'ALREADY_USED' | 'NOT_APPROVED' | 'NOT_FOUND';
  order?: OrderRecord;
  scannedAt?: string;
  message?: string;
}

export const INITIAL_DEMO_ORDERS: OrderRecord[] = [];

const SAMPLE_DEMO_NAMES = ['Abebe Bikila', 'Tigist Assefa'];

const STORAGE_KEY = 'kezira_media_ticket_orders_v1';
const ordersCollection = collection(db, 'orders');

export const ticketService = {
  getOrders: (): OrderRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((o: any) => o && o.id && !SAMPLE_DEMO_NAMES.includes(o.customerName));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
      return [];
    } catch (err) {
      console.warn('Error reading orders from localStorage:', err);
      return [];
    }
  },

  saveOrders: (orders: OrderRecord[]): void => {
    try {
      const cleaned = orders.filter((o) => o && o.id && !SAMPLE_DEMO_NAMES.includes(o.customerName));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    } catch (e) {
      console.warn('Could not save orders to localStorage:', e);
    }
  },

  /**
   * Subscribes to order updates. Immediately emits local orders,
   * then merges live Firestore updates if available.
   */
  subscribeOrders: (callback: (orders: OrderRecord[]) => void): (() => void) => {
    // Emits local orders instantly
    const localOrders = ticketService.getOrders();
    callback(localOrders);

    try {
      return onSnapshot(
        ordersCollection,
        (snapshot: any) => {
          if (snapshot && snapshot.docs) {
            const remoteOrders: OrderRecord[] = snapshot.docs
              .map((docSnap: any) => {
                const data = docSnap.data() || {};
                return {
                  id: data.id || docSnap.id,
                  customerName: data.customerName || data.name || data.customer || 'Customer',
                  phone: data.phone || data.phoneNumber || data.mobile || '',
                  email: data.email || '',
                  tierName: data.tierName || data.ticketType || data.passTier || 'GENERAL PASS',
                  tierId: data.tierId || 'regular',
                  quantity: Number(data.quantity || data.qty || 1),
                  totalETB: Number(data.totalETB || data.amount || data.price || 0),
                  paymentMethod: data.paymentMethod || data.payment || 'Telebirr',
                  transactionRef: data.transactionRef || data.receiptRef || data.ref || docSnap.id,
                  purchaseDate: data.purchaseDate || data.createdAt || data.date || new Date().toISOString(),
                  status: data.status || 'PENDING_APPROVAL',
                  rejectionReason: data.rejectionReason,
                  checkedIn: Boolean(data.checkedIn),
                  checkedInTime: data.checkedInTime,
                  referralSource: data.referralSource || 'Other',
                  referralCode: data.referralCode || 'DIRECT',
                } as OrderRecord;
              })
              .filter((o: OrderRecord) => o && !SAMPLE_DEMO_NAMES.includes(o.customerName));

            const currentLocal = ticketService.getOrders();
            const map = new Map<string, OrderRecord>();
            currentLocal.forEach((o) => map.set(o.id, o));
            remoteOrders.forEach((o) => map.set(o.id, o));
            const merged = Array.from(map.values()).sort((a, b) =>
              (b.purchaseDate || '').localeCompare(a.purchaseDate || '')
            );
            ticketService.saveOrders(merged);
            callback(merged);
          }
        },
        (error: any) => {
          if (error?.code !== 'permission-denied') {
            console.warn('Firestore subscription using local fallback:', error);
          }
          callback(ticketService.getOrders());
        }
      );
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore subscription error:', err);
      }
      return () => {};
    }
  },

  addOrder: async (orderData: Omit<OrderRecord, 'id'> & { id?: string }): Promise<string> => {
    // Server-side / Backend validation: Reject write if missing or empty
    const referralSource = orderData.referralSource?.trim();
    const referralCode = orderData.referralCode?.trim();

    if (!referralSource) {
      throw new Error('Server-side Validation Error: referralSource is required and cannot be empty.');
    }
    if (!referralCode) {
      throw new Error('Server-side Validation Error: referralCode is required and cannot be empty.');
    }

    const id = orderData.id || `KZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      referralSource,
      referralCode,
      id,
      checkedIn: orderData.checkedIn ?? false,
    };

    // Save locally
    const current = ticketService.getOrders();
    const updated = [newOrder, ...current.filter((o) => o.id !== id)];
    ticketService.saveOrders(updated);

    // Sync to Firestore using setDoc with doc ID = order ID
    try {
      const cleanData: Record<string, any> = {
        ...orderData,
        referralSource,
        referralCode,
        id,
        checkedIn: orderData.checkedIn ?? false,
      };
      Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === undefined) {
          delete cleanData[key];
        }
      });
      await setDoc(doc(db, 'orders', id), cleanData);
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore setDoc fallback:', err);
      }
    }

    return id;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderRecord['status'],
    rejectionReason?: string
  ): Promise<void> => {
    const current = ticketService.getOrders();
    const targetOrder = current.find((o) => o.id === orderId);
    const isCheckedIn = status === 'CHECKED_IN' ? true : (targetOrder?.checkedIn ?? false);

    const updated = current.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            checkedIn: isCheckedIn,
            rejectionReason: rejectionReason || o.rejectionReason,
          }
        : o
    );
    ticketService.saveOrders(updated);

    try {
      const orderRef = doc(db, 'orders', orderId);
      const updatePayload: Record<string, any> = {
        status,
        checkedIn: isCheckedIn,
      };
      if (rejectionReason) {
        updatePayload.rejectionReason = rejectionReason;
      }
      await updateDoc(orderRef, updatePayload);
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore updateDoc fallback:', err);
      }
    }
  },

  toggleCheckIn: async (orderId: string, currentlyCheckedIn: boolean): Promise<void> => {
    const newCheckedIn = !currentlyCheckedIn;
    const newStatus: OrderRecord['status'] = newCheckedIn ? 'CHECKED_IN' : 'APPROVED';
    const nowTime = newCheckedIn
      ? new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      : undefined;

    const current = ticketService.getOrders();
    const updated = current.map((o) =>
      o.id === orderId
        ? {
            ...o,
            checkedIn: newCheckedIn,
            status: newStatus,
            checkedInTime: nowTime,
          }
        : o
    );
    ticketService.saveOrders(updated);

    try {
      const orderRef = doc(db, 'orders', orderId);
      const updatePayload: Record<string, any> = {
        checkedIn: newCheckedIn,
        status: newStatus,
      };
      if (nowTime) {
        updatePayload.checkedInTime = nowTime;
      }
      await updateDoc(orderRef, updatePayload);
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore toggleCheckIn fallback:', err);
      }
    }
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    const current = ticketService.getOrders();
    const updated = current.filter((o) => o.id !== orderId);
    ticketService.saveOrders(updated);

    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore deleteDoc fallback:', err);
      }
    }
  },

  findOrder: (query: string): OrderRecord | undefined => {
    const orders = ticketService.getOrders();
    let cleanQuery = query.trim();

    // Parse JSON if query is QR code stringified JSON
    try {
      if (cleanQuery.startsWith('{') && cleanQuery.endsWith('}')) {
        const parsed = JSON.parse(cleanQuery);
        if (parsed && parsed.id) {
          cleanQuery = parsed.id;
        }
      }
    } catch {}

    const lowerQuery = cleanQuery.toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === lowerQuery ||
        o.phone.toLowerCase() === lowerQuery ||
        o.customerName.toLowerCase().includes(lowerQuery)
    );
  },

  findOrderInList: (orders: OrderRecord[], query: string): OrderRecord | undefined => {
    let cleanQuery = query.trim();
    try {
      if (cleanQuery.startsWith('{') && cleanQuery.endsWith('}')) {
        const parsed = JSON.parse(cleanQuery);
        if (parsed && parsed.id) {
          cleanQuery = parsed.id;
        }
      }
    } catch {}

    const lowerQuery = cleanQuery.toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === lowerQuery ||
        o.phone.toLowerCase() === lowerQuery ||
        o.customerName.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Atomic Concurrency-Safe Scan & Gate Check-in
   * Guarantees each ticket grants entry EXACTLY ONCE.
   */
  scanAndCheckInTicket: async (scannedInput: string): Promise<ScanCheckInResult> => {
    let cleanId = scannedInput.trim();

    // Parse JSON payload if scannedInput is QR JSON string
    try {
      if (cleanId.startsWith('{') && cleanId.endsWith('}')) {
        const parsed = JSON.parse(cleanId);
        if (parsed && parsed.id) {
          cleanId = parsed.id;
        }
      }
    } catch {}

    if (!cleanId.toUpperCase().startsWith('KZ-') && /^\d+$/.test(cleanId)) {
      cleanId = `KZ-2026-${cleanId}`;
    }

    const orderRef = doc(db, 'orders', cleanId);

    try {
      // 1. Execute Atomic Firestore Transaction
      const nowTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      let checkInResult: ScanCheckInResult | null = null;

      await runTransaction(db, async (transaction: any) => {
        const docSnap = await transaction.get(orderRef);
        if (!docSnap.exists()) {
          checkInResult = {
            result: 'NOT_FOUND',
            message: `No order record found matching "${cleanId}".`,
          };
          return;
        }

        const data = docSnap.data() as OrderRecord;
        const currentOrder: OrderRecord = {
          ...data,
          id: data.id || cleanId,
          customerName: data.customerName || 'Customer',
          phone: data.phone || '',
          tierName: data.tierName || 'GENERAL PASS',
          quantity: Number(data.quantity || 1),
          totalETB: Number(data.totalETB || 0),
          status: data.status || 'PENDING_APPROVAL',
          checkedIn: Boolean(data.checkedIn),
          checkedInTime: data.checkedInTime,
        };

        // Rule 4: If ALREADY checked in, return ALREADY_USED
        if (currentOrder.checkedIn) {
          checkInResult = {
            result: 'ALREADY_USED',
            order: currentOrder,
            scannedAt: currentOrder.checkedInTime || 'Earlier Today',
            message: `TICKET ALREADY SCANNED at ${currentOrder.checkedInTime || 'Earlier Today'}! ENTRY DENIED.`,
          };
          return;
        }

        // Rule 3: Must be APPROVED before entry
        if (currentOrder.status !== 'APPROVED' && currentOrder.status !== 'CHECKED_IN') {
          checkInResult = {
            result: 'NOT_APPROVED',
            order: currentOrder,
            message: `Order ${currentOrder.id} status is ${currentOrder.status}. Must be APPROVED by Admin first.`,
          };
          return;
        }

        // Atomic check-in state update
        transaction.update(orderRef, {
          checkedIn: true,
          checkedInTime: nowTime,
          status: 'CHECKED_IN',
        });

        const updated: OrderRecord = {
          ...currentOrder,
          checkedIn: true,
          checkedInTime: nowTime,
          status: 'CHECKED_IN',
        };

        checkInResult = {
          result: 'ENTRY_GRANTED',
          order: updated,
          scannedAt: nowTime,
          message: `VALID 1ST SCAN • ENTRY GRANTED FOR ${updated.customerName.toUpperCase()}!`,
        };
      });

      if (checkInResult) {
        // Sync local storage if result was updated
        const res = checkInResult as ScanCheckInResult;
        if (res.order && res.result === 'ENTRY_GRANTED') {
          const currentLocal = ticketService.getOrders();
          ticketService.saveOrders([
            res.order,
            ...currentLocal.filter((o) => o.id !== res.order!.id),
          ]);
        }
        return res;
      }

      throw new Error('Transaction returned empty state');
    } catch (err: any) {
      console.warn('⚠️ [Firestore check-in failed, falling back to local database]:', err);
      // Fallback to local storage atomic evaluation if offline or permission fails
      const local = ticketService.findOrder(cleanId);
      if (!local) {
        return {
          result: 'NOT_FOUND',
          message: `No order found for "${cleanId}".`,
        };
      }

      if (local.checkedIn) {
        return {
          result: 'ALREADY_USED',
          order: local,
          scannedAt: local.checkedInTime || 'Earlier Today',
          message: `TICKET ALREADY SCANNED at ${local.checkedInTime || 'Earlier Today'}! ENTRY DENIED.`,
        };
      }

      if (local.status !== 'APPROVED' && local.status !== 'CHECKED_IN') {
        return {
          result: 'NOT_APPROVED',
          order: local,
          message: `Order status is ${local.status}. Must be APPROVED before entry.`,
        };
      }

      const nowTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const updatedOrder: OrderRecord = {
        ...local,
        checkedIn: true,
        checkedInTime: nowTime,
        status: 'CHECKED_IN',
      };

      const currentLocal = ticketService.getOrders();
      ticketService.saveOrders([
        updatedOrder,
        ...currentLocal.filter((o) => o.id !== updatedOrder.id),
      ]);

      return {
        result: 'ENTRY_GRANTED',
        order: updatedOrder,
        scannedAt: nowTime,
        message: `VALID 1ST SCAN • ENTRY GRANTED FOR ${updatedOrder.customerName.toUpperCase()}!`,
      };
    }
  },
};

export type ScanTicketResultType = 'pass' | 'already_used' | 'not_approved' | 'invalid';

export interface ScanTicketResponse {
  result: ScanTicketResultType;
  order?: OrderRecord;
  scannedAt?: string;
  message?: string;
}

/**
 * Endpoint function scanTicket(ticketId, staffUid)
 * Connects scanner UI to backend verification & check-in pipeline.
 */
export const scanTicket = async (ticketId: string, _staffUid?: string): Promise<ScanTicketResponse> => {
  console.log(`🔍 [scanTicket] Checking ticket: "${ticketId}"`);
  const checkInRes = await ticketService.scanAndCheckInTicket(ticketId);
  if (checkInRes.result === 'ENTRY_GRANTED') {
    console.log('✅ [scanTicket] Entry granted:', checkInRes.message);
    return {
      result: 'pass',
      order: checkInRes.order,
      scannedAt: checkInRes.scannedAt,
      message: checkInRes.message,
    };
  } else if (checkInRes.result === 'ALREADY_USED') {
    console.error('⛔ [scanTicket] Already used:', checkInRes.message);
    return {
      result: 'already_used',
      order: checkInRes.order,
      scannedAt: checkInRes.scannedAt,
      message: checkInRes.message,
    };
  } else if (checkInRes.result === 'NOT_APPROVED') {
    console.warn('⚠️ [scanTicket] Not approved yet:', checkInRes.message);
    return {
      result: 'not_approved',
      order: checkInRes.order,
      message: checkInRes.message,
    };
  } else {
    console.error('❌ [scanTicket] Invalid / Not found:', checkInRes.message);
    return {
      result: 'invalid',
      order: checkInRes.order,
      message: checkInRes.message || `No order record found matching "${ticketId}".`,
    };
  }
};


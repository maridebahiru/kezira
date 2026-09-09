import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
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
  paymentMethod: 'Telebirr' | 'CBE (Commercial Bank)' | 'Dashen Bank' | 'BOA (Bank of Abyssinia)';
  // Text reference from the customer's bank/Telebirr confirmation,
  // checked manually by the admin before approving.
  // TEMP: replaces file-upload receipts (receiptUrl/receiptFileName) to
  // avoid needing the Firebase Blaze plan / Cloud Storage right now.
  transactionRef: string;
  purchaseDate: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN';
  rejectionReason?: string;
  checkedIn: boolean;
}

const ordersCollection = collection(db, 'orders');

export const ticketService = {
  /**
   * Subscribes to live order updates. Call the returned function to
   * unsubscribe (e.g. in a useEffect cleanup).
   */
  subscribeOrders: (callback: (orders: OrderRecord[]) => void): (() => void) => {
    const q = query(ordersCollection, orderBy('purchaseDate', 'desc'));
    return onSnapshot(
      q,
      (snapshot: any) => {
        const orders = snapshot.docs.map((docSnap: any) => ({
          ...(docSnap.data() as Omit<OrderRecord, 'id'>),
          id: docSnap.id,
        }));
        callback(orders);
      },
      (error: any) => {
        console.error('Failed to subscribe to orders:', error);
      }
    );
  },

  addOrder: async (order: Omit<OrderRecord, 'id'>): Promise<string> => {
    const docRef = await addDoc(ordersCollection, order);
    return docRef.id;
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderRecord['status'],
    rejectionReason?: string
  ): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      checkedIn: status === 'CHECKED_IN' ? true : undefined,
      ...(rejectionReason ? { rejectionReason } : {}),
    });
  },

  toggleCheckIn: async (orderId: string, currentlyCheckedIn: boolean): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      checkedIn: !currentlyCheckedIn,
      status: !currentlyCheckedIn ? 'CHECKED_IN' : 'APPROVED',
    });
  },

  deleteOrder: async (orderId: string): Promise<void> => {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  },

  /**
   * Looking up a single order by ID/phone/name now requires either being
   * signed in as admin (full read access) or a dedicated lookup path.
   * With the current rules, general order reads are admin-only, so this
   * is left as a helper for the admin dashboard's search box rather than
   * public customer lookup. See our earlier conversation about the
   * order-ID-guessing risk if you want public lookup added later.
   */
  findOrderInList: (orders: OrderRecord[], query: string): OrderRecord | undefined => {
    const cleanQuery = query.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQuery ||
        o.phone.toLowerCase() === cleanQuery ||
        o.customerName.toLowerCase().includes(cleanQuery)
    );
  },
};

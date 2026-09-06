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
  receiptUrl?: string; // base64 or object URL of uploaded screenshot/PDF
  receiptFileName?: string;
  purchaseDate: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CHECKED_IN';
  rejectionReason?: string;
  checkedIn: boolean;
}

const STORAGE_KEY = 'kezira_media_ticket_orders_v1';

const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    id: 'KZ-2026-8801',
    customerName: 'Abebe Bikila',
    phone: '+251 91 123 4567',
    email: 'abebe@example.com',
    tierName: 'VIP SKY EXPERIENCE',
    tierId: 'vip',
    quantity: 2,
    totalETB: 51000,
    paymentMethod: 'Telebirr',
    receiptFileName: 'telebirr_receipt_8801.png',
    purchaseDate: '2026-09-02 14:32',
    status: 'CHECKED_IN',
    checkedIn: true,
  },
  {
    id: 'KZ-2026-8802',
    customerName: 'Tigist Assefa',
    phone: '+251 92 987 6543',
    email: 'tigist@example.com',
    tierName: 'GENERAL PASS',
    tierId: 'regular',
    quantity: 4,
    totalETB: 34000,
    paymentMethod: 'CBE (Commercial Bank)',
    receiptFileName: 'cbe_transfer_8802.jpg',
    purchaseDate: '2026-09-03 09:15',
    status: 'APPROVED',
    checkedIn: false,
  },
  {
    id: 'KZ-2026-8803',
    customerName: 'Haile Gebrselassie',
    phone: '+251 93 456 7890',
    email: 'haile@example.com',
    tierName: 'VIP SKY EXPERIENCE',
    tierId: 'vip',
    quantity: 1,
    totalETB: 25500,
    paymentMethod: 'Telebirr',
    receiptFileName: 'telebirr_ref_8803.png',
    purchaseDate: '2026-09-04 10:05',
    status: 'PENDING_APPROVAL',
    checkedIn: false,
  },
];

export const ticketService = {
  getOrders: (): OrderRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        return INITIAL_DEMO_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  },

  saveOrders: (orders: OrderRecord[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not save orders to localStorage:', e);
    }
  },

  addOrder: (order: OrderRecord): OrderRecord[] => {
    const orders = ticketService.getOrders();
    const updated = [order, ...orders];
    ticketService.saveOrders(updated);
    return updated;
  },

  updateOrderStatus: (
    orderId: string,
    status: OrderRecord['status'],
    rejectionReason?: string
  ): OrderRecord[] => {
    const orders = ticketService.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            checkedIn: status === 'CHECKED_IN' ? true : o.checkedIn,
            rejectionReason: rejectionReason || o.rejectionReason,
          }
        : o
    );
    ticketService.saveOrders(updated);
    return updated;
  },

  toggleCheckIn: (orderId: string): OrderRecord[] => {
    const orders = ticketService.getOrders();
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            checkedIn: !o.checkedIn,
            status: (!o.checkedIn ? 'CHECKED_IN' : 'APPROVED') as OrderRecord['status'],
          }
        : o
    );
    ticketService.saveOrders(updated);
    return updated;
  },

  deleteOrder: (orderId: string): OrderRecord[] => {
    const orders = ticketService.getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    ticketService.saveOrders(updated);
    return updated;
  },

  findOrder: (query: string): OrderRecord | undefined => {
    const orders = ticketService.getOrders();
    const cleanQuery = query.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQuery ||
        o.phone.toLowerCase() === cleanQuery ||
        o.customerName.toLowerCase().includes(cleanQuery)
    );
  },
};

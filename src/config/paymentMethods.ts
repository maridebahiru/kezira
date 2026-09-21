export interface PaymentMethodConfig {
  id: string;
  name: string;
  selectOptionText: string;
  accountNumber: string;
  accountName: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'boa',
    name: 'BANK OF ABYSSINIA (BOA)',
    selectOptionText: 'Bank of Abyssinia / BOA (268679286)',
    accountNumber: '268679286',
    accountName: 'Abel Zigyalew',
    bgClass: 'bg-yellow-50',
    borderClass: 'border-yellow-300',
    textClass: 'text-yellow-950',
  },
  {
    id: 'telebirr',
    name: 'TELEBIRR',
    selectOptionText: 'Telebirr (+251 94 295 3270)',
    accountNumber: '+251 94 295 3270',
    accountName: 'Abel Zigyalew',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-900',
  },
  {
    id: 'cbe',
    name: 'CBE (COMMERCIAL BANK)',
    selectOptionText: 'CBE (1000079215035)',
    accountNumber: '1000079215035',
    accountName: 'Abel Zigyalew',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-900',
  },
  {
    id: 'awash',
    name: 'AWASH BANK',
    selectOptionText: 'Awash Bank (013201015231203)',
    accountNumber: '013201015231203',
    accountName: 'Abel Zigyalew',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-emerald-900',
  },
  {
    id: 'ebirr',
    name: 'EBIRR',
    selectOptionText: 'ebirr (+251 94 295 3270)',
    accountNumber: '+251 94 295 3270',
    accountName: 'Abel Zigyalew',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-900',
  },
];

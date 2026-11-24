export type CategoryKey =
  | 'DISPLAY'
  | 'ARTICLE'
  | 'CROCKERY'
  | 'MOCKTAIL'
  | 'WAITER'
  | 'PAN'
  | 'GIRLS'
  | 'JUICE';

export const ALL_CATEGORIES: CategoryKey[] = [
  'DISPLAY',
  'ARTICLE',
  'CROCKERY',
  'MOCKTAIL',
  'WAITER',
  'PAN',
  'GIRLS',
  'JUICE',
];

export const UNSELECTED_ITEM_LABEL = 'Type Not Selected';
export const BOOTSTRAPPED_OWNER_EMAIL = 'parthhrajsinhvaghela@gmail.com';
export const APP_NAME = 'AD OCCASION';

export interface CategoryMeta {
  key: CategoryKey;
  label: string;
  singular: string;
  unitLabel: string;
  isQuantityServiceOnly: boolean; // True for WAITER and GIRLS (no individual profiles/varieties)
  supportsDispatch: boolean;
  defaultDailyCapacity: number;
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  DISPLAY: {
    key: 'DISPLAY',
    label: 'Display',
    singular: 'Display',
    unitLabel: 'Units',
    isQuantityServiceOnly: false,
    supportsDispatch: true,
    defaultDailyCapacity: 0,
  },
  ARTICLE: {
    key: 'ARTICLE',
    label: 'Article',
    singular: 'Article',
    unitLabel: 'Units',
    isQuantityServiceOnly: false,
    supportsDispatch: true,
    defaultDailyCapacity: 0,
  },
  CROCKERY: {
    key: 'CROCKERY',
    label: 'Crockery',
    singular: 'Crockery',
    unitLabel: 'Pieces',
    isQuantityServiceOnly: false,
    supportsDispatch: true,
    defaultDailyCapacity: 0,
  },
  MOCKTAIL: {
    key: 'MOCKTAIL',
    label: 'Mocktail',
    singular: 'Mocktail',
    unitLabel: 'Units',
    isQuantityServiceOnly: false,
    supportsDispatch: true,
    defaultDailyCapacity: 0,
  },
  WAITER: {
    key: 'WAITER',
    label: 'Waiter',
    singular: 'Waiter',
    unitLabel: 'Waiters',
    isQuantityServiceOnly: true,
    supportsDispatch: false,
    defaultDailyCapacity: 0,
  },
  PAN: {
    key: 'PAN',
    label: 'Pan',
    singular: 'Pan',
    unitLabel: 'Pieces',
    isQuantityServiceOnly: false,
    supportsDispatch: false,
    defaultDailyCapacity: 0,
  },
  GIRLS: {
    key: 'GIRLS',
    label: 'Girls',
    singular: 'Girls',
    unitLabel: 'Girls',
    isQuantityServiceOnly: true,
    supportsDispatch: false,
    defaultDailyCapacity: 0,
  },
  JUICE: {
    key: 'JUICE',
    label: 'Juice',
    singular: 'Juice',
    unitLabel: 'Units',
    isQuantityServiceOnly: false,
    supportsDispatch: true,
    defaultDailyCapacity: 0,
  },
};

export type UserRole = 'owner' | 'admin' | 'user' | 'pending';
export type UserStatus = 'active' | 'revoked';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserInvite {
  id: string;
  email: string;
  displayName: string;
  role: 'owner' | 'admin' | 'user';
  invitedBy: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminPermissions {
  canViewFinancials: boolean;
  canManageUsers: boolean;
  canBackupRestore: boolean;
  canDeleteRecords: boolean;
  canEditPrices: boolean;
}

export interface UserPermissions {
  canExportReports: boolean;
}

export interface BusinessSettings {
  id: string;
  businessName: string;
  currencySymbol: string;
  adminPermissions: AdminPermissions;
  userPermissions: UserPermissions;
  defaultCapacities: {
    WAITER: number;
    GIRLS: number;
  };
  lastBackupAt?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CategoryConfig {
  id: string;
  key: CategoryKey;
  label: string;
  unitLabel: string;
  dailyCapacity: number;
  notes?: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface InventoryItem {
  id: string;
  category: CategoryKey;
  name: string;
  totalUnits: number;
  damagedUnits: number;
  missingUnits: number;
  rentalPrice?: number | null;
  purchaseCost?: number | null;
  description?: string;
  imageUrl?: string;
  notes?: string;
  archived: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
  archived: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type BookingStatus = 'confirmed' | 'reserved' | 'cancelled' | 'completed' | 'archived';
export type DispatchStatus = 'pending' | 'outgoing' | 'returned';

export interface BookingLineItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice?: number | null;
}

export interface Booking {
  id: string;
  bookingCode: string;
  eventGroupId?: string;
  customerId?: string;
  customerName: string;
  eventDate: string; // YYYY-MM-DD
  category: CategoryKey;
  itemId?: string;
  itemName?: string;
  items?: BookingLineItem[];
  quantity: number;
  venue?: string;
  totalAmount?: number | null;
  advanceReceived?: number | null;
  advancePaid?: number | null;
  status: BookingStatus;
  dispatchStatus: DispatchStatus;
  outgoingUnits?: number;
  returnedUnits?: number;
  damagedUnits?: number;
  missingUnits?: number;
  notes?: string;
  negotiationId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdvanceEntry {
  id: string;
  direction: 'received' | 'paid';
  partyName: string;
  customerId?: string;
  bookingId?: string;
  date: string; // YYYY-MM-DD
  amount: number;
  paymentMethod?: string;
  notes?: string;
  archived: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface NegotiationEntry {
  id: string;
  customerId?: string;
  customerName: string;
  negotiationDate: string;
  eventDate?: string;
  category: CategoryKey;
  itemId?: string;
  itemName?: string;
  units: number;
  originalPrice?: number | null;
  customerOffer?: number | null;
  finalPrice: number;
  advanceReceived?: number | null;
  status: 'open' | 'converted' | 'cancelled';
  convertedBookingId?: string;
  notes?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ExpenseEntry {
  id: string;
  title: string;
  expenseCategory: string;
  date: string;
  amount: number;
  vendor?: string;
  bookingId?: string;
  notes?: string;
  archived: boolean;
  createdBy: string;
  updatedBy?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  summary: string;
  performedBy: string;
  performedByEmail?: string;
  createdAt?: unknown;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export type NavSection =
  | 'dashboard'
  | 'bookings'
  | 'reservations'
  | 'calendar'
  | 'display'
  | 'article'
  | 'crockery'
  | 'mocktail'
  | 'waiter'
  | 'pan'
  | 'girls'
  | 'juice'
  | 'inventory'
  | 'customers'
  | 'advances'
  | 'negotiations'
  | 'reports'
  | 'profit-loss'
  | 'backup'
  | 'users'
  | 'settings';

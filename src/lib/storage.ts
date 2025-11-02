// LocalStorage utilities for blood bank management

export interface Transaction {
  id: number;
  email: string;
  role: string;
  type: string;
  bloodGroup: string;
  units: number;
  status: string;
  ts: string;
}

export interface Inventory {
  [bloodGroup: string]: number;
}

const STORAGE_KEYS = {
  INVENTORY: 'bloodbank_inventory',
  TRANSACTIONS: 'bloodbank_transactions',
  USER_EMAIL: 'bloodbank_user_email',
  USER_ROLE: 'bloodbank_user_role',
};

// Initialize default inventory
const DEFAULT_INVENTORY: Inventory = {
  'A+': 45,
  'A-': 12,
  'B+': 38,
  'B-': 8,
  'AB+': 15,
  'AB-': 5,
  'O+': 52,
  'O-': 18,
};

export const getInventory = (): Inventory => {
  const stored = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  if (!stored) {
    setInventory(DEFAULT_INVENTORY);
    return DEFAULT_INVENTORY;
  }
  return JSON.parse(stored);
};

export const setInventory = (inventory: Inventory): void => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

export const updateInventory = (bloodGroup: string, units: number): void => {
  const inventory = getInventory();
  inventory[bloodGroup] = Math.max(0, inventory[bloodGroup] + units);
  setInventory(inventory);
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'ts'>): void => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now(),
    ts: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getUserEmail = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
};

export const setUserEmail = (email: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

export const setUserRole = (role: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
};

export const clearUserSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
};

export const getUserTransactions = (email: string): Transaction[] => {
  const transactions = getTransactions();
  return transactions.filter(t => t.email === email);
};

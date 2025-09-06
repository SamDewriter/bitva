export type TransactionStatus = "Completed" | "Pending" | "Failed" | string;

export interface Transaction {
  id: string;
  asset: string;     // e.g. "Bitcoin"
  type: string;      // "Buy" | "Sell"
  amount: string;    // display value, e.g. "0.05 BTC"
  valueUsd: number;  // numeric USD value
  status: TransactionStatus;
  createdAt: string; // ISO timestamp
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
}

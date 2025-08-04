export type TransactionType = "BUY" | "SELL" | "REWARD";

export interface Transaction {
  id: number;
  tokenAddress: string;
  userAddress: string;
  type: TransactionType;
  amount: number;
  valueUsd: number;
  txHash: string;
  createdAt: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  total: number;
  currentPage: number;
}

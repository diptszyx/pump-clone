"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Token } from "@/src/types/token";
import { Transaction, TransactionResponse } from "@/src/types/transaction";
import { timeAgo } from "@/src/utils/format";

export default function Transactions({ token }: { token: Token }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/transaction?tokenAddress=${token.address}&page=${currentPage}`
        );
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data: TransactionResponse = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [token.address, currentPage]);

  return (
    <div className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">Transactions</h4>
        <span className="text-sm text-gray-400">
          {transactions.length} transactions
        </span>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-400">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No transactions yet</div>
          <div className="text-sm text-gray-600">
            Trades will appear here once they start happening
          </div>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Time
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Type
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Price
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Amount
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Value
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      User
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
                      Tx
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors"
                    >
                      <td className="py-3 px-2 text-sm text-gray-300">
                        {timeAgo(tx.createdAt)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            tx.type === "BUY"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.type === "BUY" ? "🟢 Buy" : "🔴 Sell"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-white font-medium">
                        $0 {/* Giá chưa có cột riêng */}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-300">
                        {tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-white font-medium">
                        ${tx.valueUsd.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm text-gray-400 font-mono">
                          {truncateAddress(tx.userAddress)}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

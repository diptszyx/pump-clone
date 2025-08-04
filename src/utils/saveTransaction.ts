export async function saveTransaction({
  tokenAddress,
  userAddress,
  type,
  amount,
  valueUsd,
  txHash,
}: {
  tokenAddress: string;
  userAddress: string;
  type: string;
  amount: number;
  valueUsd: number;
  txHash: string;
}) {
  try {
    await fetch("/api/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokenAddress,
        userAddress,
        type,
        amount,
        valueUsd,
        txHash,
      }),
    });

    console.log(" Transaction saved!");
  } catch (err) {
    console.error(" Failed to save transaction:", err);
  }
}

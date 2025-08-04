import { Header } from "@/src/components/layout/Header";
import TokenPage from "@/src/components/token/TokenPage";
import { getTokenByAddress } from "@/src/lib/db/token";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const token = await getTokenByAddress(address);

  if (token) {
    return {
      title: `${token.metadata?.name || "Unknown Token"} (${token.metadata?.symbol || "TOKEN"}) - Moon Pump`,
      description:
        token.metadata?.description ||
        `Trade ${token.metadata?.name} on Moon Pump`,
    };
  }

  return {
    title: "Token - Moon Pump",
    description: "Trade tokens on Moon Pump",
  };
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  const token = await getTokenByAddress(address);

  if (!token) {
    return;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <TokenPage token={token} />
    </div>
  );
}

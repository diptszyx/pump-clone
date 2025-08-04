export interface Token {
  id: number;
  address: string;
  creator: string;
  tokenURI: string;
  tvl: number;
  marketCap: number;
  createdAt: Date;
  metadata: {
    name: string;
    symbol: string;
    description?: string;
    image?: string;
    website?: string;
    telegram?: string;
    twitter?: string;
  };
}

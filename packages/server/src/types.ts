export type TokenQuote = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tag: {
    slug: string;
    name: string;
    category: 'ALGORITHM' | 'PLATFORM' | 'CATEGORY';
  }[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  is_active: number;
  cmc_rank: number;
  is_fiat: number;
  last_updated: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      tvl: null;
      last_updated: string;
    };
  };
};

export type QuoteResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
  data: Record<string, TokenQuote[]>;
};

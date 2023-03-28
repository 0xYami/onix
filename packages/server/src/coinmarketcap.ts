import { asyncFaillable } from '@onix/utils';
import axios, { type Axios } from 'axios';

type TokenQuote = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: {
    slug: string;
    name: string;
    category: 'ALGORITHM' | 'PLATFORM' | 'CATEGORY';
  }[];
  max_supply: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  is_active: 0 | 1;
  cmc_rank: number;
  is_fiat: 0 | 1;
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
      last_updated: string;
    };
  };
}

type GetTokenQuoteResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
    notice: null;
  };
  data: Record<string, TokenQuote[]>
};

export class CoinMarketCap {
  #httpClient: Axios;

  constructor() {
    this.#httpClient = axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
      },
    });
  }

  async getTokenPrices(symbols: string[]): Promise<TokenQuote[]> {
    const url = '/v2/cryptocurrency/quotes/latest';
    const response = await asyncFaillable<{ data: GetTokenQuoteResponse }>(
      this.#httpClient.get(url, {
        params: {
          symbol: symbols.join(','),
          convert: 'USD',
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get token price');
    }

    return symbols.map(symbol => response.result.data.data[symbol][0]);
  }
}

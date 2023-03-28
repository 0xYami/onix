import { asyncFaillable } from '@onix/utils';
import axios, { type Axios } from 'axios';
import type { TokenQuote, GetTokenQuoteResponse } from '../types';

type CoinMarketCapConfig = {
  apiKey: string | undefined;
};

export class CoinMarketCap {
  #httpClient: Axios;

  constructor(config: CoinMarketCapConfig) {
    this.#httpClient = axios.create({
      baseURL: 'https://pro-api.coinmarketcap.com',
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': config.apiKey,
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

    return symbols.map((symbol) => response.result.data.data[symbol][0]);
  }
}

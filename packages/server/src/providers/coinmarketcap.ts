import { asyncFaillable } from '@onix/utils';
import axios, { type Axios } from 'axios';
import type { NetworkConfig } from '../config';
import type { TokenQuote, GetTokenQuoteResponse } from '../types';

export class CoinMarketCap {
  #httpClient: Axios;

  constructor(config: NetworkConfig) {
    this.#httpClient = axios.create({
      baseURL: config.baseURL,
      headers: {
        Accept: 'application/json',
        'X-CMC_PRO_API_KEY': config.apiKey,
      },
    });
  }

  async getTokenPrices(symbols: string[]): Promise<TokenQuote[]> {
    const response = await asyncFaillable<{ data: GetTokenQuoteResponse }>(
      this.#httpClient.get('/v2/cryptocurrency/quotes/latest', {
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

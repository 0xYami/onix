import axios, { Axios } from 'axios';
import { asyncFaillable } from '@onix/utils';

type TokenName = 'ethereum';

type GetPricesResult = Record<TokenName, { usd: string }>;

class CoinGecko {
  #httpClient: Axios;

  constructor() {
    this.#httpClient = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
    });
  }

  async getPrices(tokenName: TokenName, currency = 'usd'): Promise<string> {
    const response = await asyncFaillable<{ data: GetPricesResult }>(
      this.#httpClient.get(`/simple/price?ids=${tokenName}&vs_currencies=${currency}`),
    );
    if (response.failed) {
      throw new Error(`Failed to price for ${tokenName}`);
    }
    return response.result.data.ethereum.usd.toString();
  }
}

export { CoinGecko };

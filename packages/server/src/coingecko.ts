import axios, { Axios } from 'axios';
import { asyncFaillable } from '@onix/utils';

type GetPricesResult = Record<string, { usd: string }>;

class CoinGecko {
  #httpClient: Axios;

  constructor() {
    this.#httpClient = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
    });
  }

  async getPriceById(id: string): Promise<GetPricesResult> {
    const url = `/simple/price?ids=${id}&vs_currencies=usd`;
    const response = await asyncFaillable<{ data: GetPricesResult }>(this.#httpClient.get(url));
    if (response.failed) {
      throw new Error(`Failed to retrieve price for token ${id}`);
    }
    return response.result.data;
  }

  async getPricesByAddresses(addresses: string[], currency = 'usd'): Promise<GetPricesResult> {
    const addressesString = addresses.join(',');
    const url = `/simple/token_price/ethereum?contract_addresses=${addressesString}&vs_currencies=${currency}`;
    const response = await asyncFaillable<{ data: GetPricesResult }>(this.#httpClient.get(url));
    if (response.failed) {
      throw new Error('Failed to retrieve token prices');
    }
    return response.result.data;
  }
}

export { CoinGecko };

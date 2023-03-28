import { asyncFaillable } from '@onix/utils';
import axios, { type Axios } from 'axios';

type GetBalanceResponse = {
  status: '1';
  message: 'OK';
  result: string;
};

type GetEtherPriceResponse = {
  status: '1';
  message: 'OK';
  result: {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
  };
};

export class Etherscan {
  #apiKey: string;
  #httpClient: Axios;

  constructor() {
    this.#apiKey = process.env.ETHERSCAN_API_KEY!;
    this.#httpClient = axios.create({
      baseURL: 'https://api.etherscan.io/api',
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getEtherBalance(address: string): Promise<GetBalanceResponse['result']> {
    // Etherscan returns the balance in wei
    const response = await asyncFaillable<{ data: GetBalanceResponse }>(
      this.#httpClient.get('/', {
        params: {
          module: 'account',
          action: 'balance',
          address,
          tag: 'latest',
          apiKey: this.#apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to   get et her balance');
    }

    return response.result.data.result;
  }

  async getEtherPrice(): Promise<GetEtherPriceResponse['result']['ethusd']> {
    const response = await asyncFaillable<{ data: GetEtherPriceResponse }>(
      this.#httpClient.get('/', {
        params: {
          module: 'stats',
          action: 'ethprice',
          apiKey: this.#apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get ether balance');
    }

    return response.result.data.result.ethusd;
  }

  async getERC20Balance(
    address: string,
    contractAddress: string,
  ): Promise<GetBalanceResponse['result']> {
    const response = await asyncFaillable<{ data: GetBalanceResponse }>(
      this.#httpClient.get('/', {
        params: {
          module: 'account',
          action: 'tokenBalance',
          address,
          contractaddress: contractAddress.toLowerCase(),
          tag: 'latest',
          apiKey: this.#apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get ERC20 balance');
    }

    return response.result.data.result;
  }
}

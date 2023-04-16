import axios, { type Axios } from 'axios';
import type {
  EtherscanNormalTransaction,
  EtherscanEtherPrices,
  EtherscanGasPrices,
  GetEtherscanNormalTransactions,
  Transfers,
} from '@onix/schemas';
import { asyncFaillable } from '@onix/utils';

type BaseResponse<TResult> = {
  status: '1';
  message: 'OK';
  result: TResult;
};

type GetBalanceResponse = BaseResponse<string>;

type GetEtherPriceResponse = BaseResponse<EtherscanEtherPrices>;

type GetERC20TransfersResponse = BaseResponse<Transfers>;

type GetGasPricesResponse = BaseResponse<EtherscanGasPrices>;

type EtherscanConfig = {
  apiKey: string;
};

export class Etherscan {
  #apiKey: string;
  #httpClient: Axios;

  constructor(config: EtherscanConfig) {
    this.#apiKey = config.apiKey;
    this.#httpClient = axios.create({
      baseURL: 'https://api.etherscan.io/api',
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getGasPrices(): Promise<GetGasPricesResponse['result']> {
    // Etherscan returns the gas prices in Gwei
    const response = await asyncFaillable<{ data: GetGasPricesResponse }>(
      this.#httpClient.get('/', {
        params: {
          module: 'gastracker',
          action: 'gasoracle',
          apiKey: this.#apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get gas prices');
    }

    return response.result.data.result;
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
      throw new Error('Failed to get ether balance');
    }

    return response.result.data.result;
  }

  async getEtherPrices(): Promise<GetEtherPriceResponse['result']> {
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

    return response.result.data.result;
  }

  async getNormalTransactions(address: string): Promise<EtherscanNormalTransaction[]> {
    const response = await asyncFaillable<{ data: GetEtherscanNormalTransactions }>(
      this.#httpClient.get('/', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 100,
          sort: 'desc',
          apiKey: this.#apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get normal transactions');
    }

    return response.result.data.result;
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

  async getERC20Transfers(
    address: string,
    contractAddress: string,
  ): Promise<GetERC20TransfersResponse['result']> {
    const response = await asyncFaillable<{ data: GetERC20TransfersResponse }>(
      this.#httpClient.get('/', {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          contractaddress: contractAddress,
          page: 1,
          offset: 20,
          sort: 'desc',
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

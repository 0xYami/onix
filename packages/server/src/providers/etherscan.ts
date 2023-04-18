import axios, { type Axios } from 'axios';
import type {
  EtherscanNormalTransaction,
  EtherscanEtherPrices,
  EtherscanGasPrices,
  GetEtherscanNormalTransactions,
  NetworkName,
  Transfers,
} from '@onix/schemas';
import { asyncFaillable } from '@onix/utils';
import type { NetworkConfig } from '../config';

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
  networks: {
    mainnet: NetworkConfig;
    goerli: NetworkConfig;
  };
};

export class Etherscan {
  #configs: EtherscanConfig['networks'];
  #httpClient: Axios;

  constructor(config: EtherscanConfig) {
    this.#configs = config.networks;
    this.#httpClient = axios.create({
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getGasPrices(network: NetworkName): Promise<GetGasPricesResponse['result']> {
    const config = this.#configs[network];
    // Etherscan returns the gas prices in Gwei
    const response = await asyncFaillable<{ data: GetGasPricesResponse }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'gastracker',
          action: 'gasoracle',
          apiKey: config.apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get gas prices');
    }

    return response.result.data.result;
  }

  async getEtherBalance(
    address: string,
    network: NetworkName,
  ): Promise<GetBalanceResponse['result']> {
    const config = this.#configs[network];
    // Etherscan returns the balance in wei
    const response = await asyncFaillable<{ data: GetBalanceResponse }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'account',
          action: 'balance',
          address,
          tag: 'latest',
          apiKey: config.apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get ether balance');
    }

    return response.result.data.result;
  }

  async getEtherPrices(network: NetworkName): Promise<GetEtherPriceResponse['result']> {
    const config = this.#configs[network];
    const response = await asyncFaillable<{ data: GetEtherPriceResponse }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'stats',
          action: 'ethprice',
          apiKey: config.apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get ether balance');
    }

    return response.result.data.result;
  }

  async getNormalTransactions(
    address: string,
    network: NetworkName,
  ): Promise<EtherscanNormalTransaction[]> {
    const config = this.#configs[network];
    const response = await asyncFaillable<{ data: GetEtherscanNormalTransactions }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 100,
          sort: 'desc',
          apiKey: config.apiKey,
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
    network: NetworkName,
  ): Promise<GetBalanceResponse['result']> {
    const config = this.#configs[network];
    const response = await asyncFaillable<{ data: GetBalanceResponse }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'account',
          action: 'tokenBalance',
          address,
          contractaddress: contractAddress.toLowerCase(),
          tag: 'latest',
          apiKey: config.apiKey,
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
    network: NetworkName,
  ): Promise<GetERC20TransfersResponse['result']> {
    const config = this.#configs[network];
    const response = await asyncFaillable<{ data: GetERC20TransfersResponse }>(
      this.#httpClient.get(config.baseURL, {
        params: {
          module: 'account',
          action: 'tokentx',
          address,
          contractaddress: contractAddress,
          page: 1,
          offset: 20,
          sort: 'desc',
          apiKey: config.apiKey,
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get ERC20 balance');
    }

    return response.result.data.result;
  }
}

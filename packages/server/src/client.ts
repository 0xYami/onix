import type { AddressDetails, GetAssetResult } from '@onix/schemas';
import { assets } from '@onix/utils';
import { BigNumber } from 'bignumber.js';
import { take, toBaseUnit } from './utils';
import { Alchemy } from './providers/alchemy';
import { Etherscan } from './providers/etherscan';
import { CoinMarketCap } from './providers/coinmarketcap';

type GetAssetParams = {
  userAddress: string;
  contractAddress: string;
};

type ClientConfig = {
  apiKeys: {
    alchemy: string;
    etherscan: string;
    coinmarketcap: string;
  };
};

export class Client {
  alchemy: Alchemy;
  etherscan: Etherscan;
  coinmarketcap: CoinMarketCap;

  constructor(config: ClientConfig) {
    this.alchemy = new Alchemy({ apiKey: config.apiKeys.alchemy });
    this.etherscan = new Etherscan({ apiKey: config.apiKeys.etherscan });
    this.coinmarketcap = new CoinMarketCap({ apiKey: config.apiKeys.coinmarketcap });
  }

  async getAsset(params: GetAssetParams): Promise<GetAssetResult> {
    const asset = assets.find((asset) => {
      return asset.address.toLowerCase() === params.contractAddress.toLowerCase();
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    const [balance, [price]] = await Promise.all([
      this.etherscan.getERC20Balance(params.userAddress, params.contractAddress),
      this.coinmarketcap.getTokenPrices([asset.symbol]),
    ]);

    const transfers = await this.etherscan.getERC20Transfers(
      params.userAddress,
      params.contractAddress,
    );

    transfers.forEach((transfer) => {
      transfer.value = toBaseUnit(transfer.value, asset.decimals).toFixed(2);
    });

    return {
      name: asset.name,
      symbol: asset.symbol,
      address: asset.address,
      balance: {
        token: toBaseUnit(balance, asset.decimals).toFixed(4),
        usd: toBaseUnit(balance, asset.decimals).times(price.quote.USD.price).toFixed(4),
      },
      transfers,
    };
  }

  async getAddressDetails(address: string): Promise<AddressDetails> {
    const [etherBalance, etherPrice] = await Promise.all([
      this.etherscan.getEtherBalance(address),
      this.etherscan.getEtherPrice(),
    ]);

    // Limit to 3 assets for now due to rate limits
    const tokens = take(assets, 3);
    const tokenAddresses = tokens.map((token) => token.address);
    const balances = await this.alchemy.getERC20Balances(address, tokenAddresses);

    const tokensWithBalances = tokens.map((token) => {
      const asset = balances.tokenBalances.find(
        (balance) => balance.contractAddress === token.address,
      );
      return {
        ...token,
        balance: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          token: toBaseUnit(Number(asset!.tokenBalance).toString(), token.decimals).toFixed(4),
          // To be set once token prices have been fetched
          usd: '0',
        },
      };
    });

    const tokenSymbols = tokens.map((token) => token.symbol);
    const tokenPrices = await this.coinmarketcap.getTokenPrices(tokenSymbols);

    tokensWithBalances.forEach((asset, index) => {
      asset.balance.usd = new BigNumber(asset.balance.token)
        .times(tokenPrices[index].quote.USD.price)
        .toFixed(2);
    });

    const totalBalance = tokensWithBalances.reduce(
      (acc, asset) => acc.plus(new BigNumber(asset.balance.usd)),
      new BigNumber(0),
    );

    const result: AddressDetails = {
      address,
      etherBalance: {
        token: toBaseUnit(etherBalance, 18).toFixed(4),
        usd: toBaseUnit(etherBalance, 18).times(etherPrice).toFixed(2),
      },
      totalBalance: totalBalance.toFixed(4),
      assets: tokensWithBalances,
    };

    return result;
  }
}

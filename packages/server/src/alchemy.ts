import { Alchemy as AlchemySDK, Network as AlchemyNetwork, AlchemySettings } from 'alchemy-sdk';
import type { AddressDetails } from '@onix/schemas';
import BigNumber from 'bignumber.js';
import { CoinGecko } from './coingecko';
import { tokens as tokens_ } from './tokens';
import { toBaseUnit } from './utils';

type Network = 'mainnet';

const networkToAlchemyNetwork: Record<Network, AlchemyNetwork> = {
  mainnet: AlchemyNetwork.ETH_MAINNET,
};

type AlchemyConfig = Pick<AlchemySettings, 'apiKey'> & {
  network: Network;
};

class Alchemy {
  client: AlchemySDK;
  coingecko: CoinGecko;

  constructor(config: AlchemyConfig) {
    this.client = new AlchemySDK({
      apiKey: config.apiKey,
      network: networkToAlchemyNetwork[config.network],
    });
    this.coingecko = new CoinGecko();
  }

  async getBlockNumber(): Promise<number> {
    return this.client.core.getBlockNumber();
  }

  async getAddressDetails(address: string): Promise<AddressDetails> {
    const etherBalance = await this.client.core.getBalance(address);
    const etherPrice = await this.coingecko.getPriceById('ethereum');

    const tokenAddresses = tokens_.map((token) => token.address);
    const tokens = await this.client.core.getTokenBalances(address, tokenAddresses);

    const assets = await Promise.all(
      tokens.tokenBalances.map(async (token) => {
        const metadata = await this.client.core.getTokenMetadata(token.contractAddress);
        return {
          name: metadata.name!,
          address: token.contractAddress,
          balance: {
            // To update after asset price has been retrieved
            price: '0',
            token: toBaseUnit(token.tokenBalance!, metadata.decimals!).toFixed(2),
            value: '0',
          },
          symbol: metadata.symbol!,
        };
      }),
    );

    const assetPrices = await this.coingecko.getPricesByAddresses(tokenAddresses);
    assets.forEach((asset) => {
      asset.balance.price = assetPrices[asset.address.toLowerCase()].usd.toString();
      asset.balance.value = new BigNumber(asset.balance.token)
        .times(asset.balance.price)
        .toFixed(2);
    });
    assets.unshift({
      name: 'Ethereum',
      address: '',
      balance: {
        price: etherPrice['ethereum'].usd.toString(),
        token: toBaseUnit(etherBalance.toString(), 18).toFixed(2),
        value: new BigNumber(toBaseUnit(etherBalance.toString(), 18).toFixed(2))
          .times(etherPrice['ethereum'].usd)
          .toFixed(2),
      },
      symbol: 'ETH',
    });

    const totalBalance = assets.reduce((acc, asset) => {
      const price = Number(asset.balance.token) * Number(asset.balance.price);
      return acc.plus(price);
    }, new BigNumber(0));

    return {
      address,
      balance: totalBalance.toFixed(2),
      assets,
    };
  }
}

export { Alchemy };

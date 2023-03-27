import { Alchemy as AlchemySDK, Network as AlchemyNetwork, AlchemySettings } from 'alchemy-sdk';
import type { AddressDetails } from '@onix/schemas';
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
    const price = await this.coingecko.getPrices('ethereum');

    const tokenAddresses = tokens_.map((token) => token.address);
    const tokens = await this.client.core.getTokenBalances(address, tokenAddresses);

    const assets = await Promise.all(
      tokens.tokenBalances.map(async (token) => {
        const metadata = await this.client.core.getTokenMetadata(token.contractAddress);
        return {
          name: metadata.name!,
          balance: toBaseUnit(token.tokenBalance!, metadata.decimals!).toFixed(2),
          symbol: metadata.symbol!,
        };
      }),
    );

    return {
      address,
      balance: {
        token: toBaseUnit(etherBalance.toString(), 18).toFixed(2),
        price,
      },
      assets,
    };
  }
}

export { Alchemy };

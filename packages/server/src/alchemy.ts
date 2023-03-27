import { Alchemy as AlchemySDK, Network as AlchemyNetwork, AlchemySettings } from 'alchemy-sdk';
import { AddressDetails } from '@onix/schemas';
import { tokens as tokens_ } from './tokens';

type Network = 'mainnet';

const networkToAlchemyNetwork: Record<Network, AlchemyNetwork> = {
  mainnet: AlchemyNetwork.ETH_MAINNET,
};

type AlchemyConfig = Pick<AlchemySettings, 'apiKey'> & {
  network: 'mainnet';
};

class Alchemy {
  client: AlchemySDK;

  constructor(config: AlchemyConfig) {
    this.client = new AlchemySDK({
      apiKey: config.apiKey,
      network: networkToAlchemyNetwork[config.network],
    });
  }

  async getBlockNumber(): Promise<number> {
    return this.client.core.getBlockNumber();
  }

  async getAddressDetails(address: string): Promise<AddressDetails> {
    const tokenAddresses = tokens_.map((token) => token.address);
    const tokens = await this.client.core.getTokenBalances(address, tokenAddresses);

    const assets = await Promise.all(
      tokens.tokenBalances.map(async (token) => {
        const metadata = await this.client.core.getTokenMetadata(token.contractAddress);
        // TODO: better handle conversions
        const balance = (Number(token.tokenBalance) / Math.pow(10, metadata.decimals!)).toFixed(2);
        return {
          name: metadata.name!,
          balance,
          symbol: metadata.symbol!,
        };
      }),
    );
    return { address, assets };
  }
}

export { Alchemy };

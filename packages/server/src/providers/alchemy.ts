import { HttpClient } from '@onix/utils';
import {
  alchemyERC20BalancesSchema,
  alchemyNFTSchema,
  alchemyAssetTransfersSchema,
  getNFTCollectionResponseSchema,
  getNFTCollectionsResponseSchema,
  type AlchemyERC20Balances,
  type GetNFTCollectionsResponse,
  type AlchemyNFT,
  type NFTCollection,
  type NetworkName,
} from '@onix/schemas';
import type { NetworkConfig } from '../config';
import { formatNFTImageUrl } from '../utils';

type AlchemyConfig = {
  networks: {
    mainnet: NetworkConfig;
    goerli: NetworkConfig;
  };
};

export class Alchemy {
  #configs: AlchemyConfig['networks'];
  #httpClient: HttpClient;

  constructor(config: AlchemyConfig) {
    this.#configs = config.networks;
    this.#httpClient = new HttpClient();
  }

  async getERC20Balances(
    owner: string,
    contractAddresses: string[],
    network: NetworkName,
  ): Promise<AlchemyERC20Balances['result']> {
    const config = this.#configs[network];
    return this.#httpClient.post({
      url: `${config.baseURL}/v2/${config.apiKey}`,
      data: {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [owner, contractAddresses],
      },
      validation: {
        response: alchemyERC20BalancesSchema.transform((balance) => balance.result),
      },
    });
  }

  async getNFT(
    owner: string,
    contractAddress: string,
    tokenId: string,
    network: NetworkName,
  ): Promise<AlchemyNFT> {
    const config = this.#configs[network];
    const nft = await this.#httpClient.get({
      url: `${config.baseURL}/nft/v2/${config.apiKey}/getNFTMetadata`,
      options: {
        params: {
          owner,
          contractAddress,
          tokenId,
        },
      },
      validation: {
        response: alchemyNFTSchema,
      },
    });

    if (nft.metadata.image) {
      nft.metadata.image = formatNFTImageUrl(nft.metadata.image);
    }

    return nft;
  }

  async getNFTCollection(
    ownerAddress: string,
    contractAddress: string,
    network: NetworkName,
  ): Promise<NFTCollection> {
    const config = this.#configs[network];
    const collection = await this.#httpClient.get({
      url: `${config.baseURL}/nft/v2/${config.apiKey}/getNFTs`,
      options: {
        params: {
          owner: ownerAddress,
          contractAddresses: [contractAddress],
          pageSize: 50,
          withMetadata: true,
          excludeFilters: ['AIRDROPS', 'SPAM'],
          spamConfidenceLevel: 'MEDIUM',
        },
      },
      validation: {
        response: getNFTCollectionResponseSchema,
      },
    });
    return {
      pageKey: collection.pageKey,
      totalCount: collection.totalCount,
      blockHash: collection.blockHash,
      contract: {
        name: collection.ownedNfts[0].contractMetadata.name,
        address: collection.ownedNfts[0].contract.address,
      },
      nfts: collection.ownedNfts.map((nft) => {
        const imageURL = nft.metadata.image;
        if (imageURL) nft.metadata.image = formatNFTImageUrl(imageURL);
        return {
          title: nft.title,
          description: nft.description,
          balance: nft.balance,
          address: nft.contract.address,
          id: Number(nft.id.tokenId).toString(),
          type: nft.id.tokenMetadata.tokenType,
          metadata: nft.metadata,
        };
      }),
    };
  }

  async getNFTCollections(
    ownerAddress: string,
    network: NetworkName,
  ): Promise<GetNFTCollectionsResponse> {
    const config = this.#configs[network];
    return this.#httpClient.get({
      url: `${config.baseURL}/nft/v2/${config.apiKey}/getContractsForOwner`,
      options: {
        params: {
          owner: ownerAddress,
          pageSize: 50,
          excludeFilters: ['AIRDROPS', 'SPAM'],
          spamConfidenceLevel: 'MEDIUM',
        },
      },
      validation: {
        response: getNFTCollectionsResponseSchema,
      },
    });
  }

  async getAssetsTransfers(ownerAddress: string, network: NetworkName) {
    const config = this.#configs[network];

    const params = {
      fromBlock: '0x0',
      toBlock: 'latest',
      withMetadata: true,
      order: 'desc',
      maxCount: '0x32', // 50
      category: ['external', 'erc20', 'erc721'],
    };

    const sent = await this.#httpClient.post({
      url: `${config.baseURL}/v2/${config.apiKey}`,
      data: {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{ ...params, fromAddress: ownerAddress }],
      },
      validation: {
        response: alchemyAssetTransfersSchema,
      },
    });

    const received = await this.#httpClient.post({
      url: `${config.baseURL}/v2/${config.apiKey}`,
      data: {
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [{ ...params, toAddress: ownerAddress }],
      },
      validation: {
        response: alchemyAssetTransfersSchema,
      },
    });

    return {
      result: {
        transfers: [...sent.result.transfers, ...received.result.transfers].sort(
          (sent, received) => parseInt(received.blockNum, 16) - parseInt(sent.blockNum, 16),
        ),
      },
    };
  }
}

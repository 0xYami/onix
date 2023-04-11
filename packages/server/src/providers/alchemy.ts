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
} from '@onix/schemas';
import { formatNFTImageUrl } from '../utils';

type AlchemyConfig = {
  apiKey: string;
};

export class Alchemy {
  #apiKey: string;
  #httpClient: HttpClient;

  constructor(config: AlchemyConfig) {
    this.#apiKey = config.apiKey;
    this.#httpClient = new HttpClient({
      baseURL: `https://eth-mainnet.g.alchemy.com`,
    });
  }

  async getERC20Balances(
    owner: string,
    contractAddresses: string[],
  ): Promise<AlchemyERC20Balances['result']> {
    return this.#httpClient.post({
      url: `/v2/${this.#apiKey}`,
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

  async getNFT(owner: string, contractAddress: string, tokenId: string): Promise<AlchemyNFT> {
    const nft = await this.#httpClient.get({
      url: `/nft/v2/${this.#apiKey}/getNFTMetadata`,
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

  async getNFTCollection(ownerAddress: string, contractAddress: string): Promise<NFTCollection> {
    const collection = await this.#httpClient.get({
      url: `/nft/v2/${this.#apiKey}/getNFTs`,
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

  async getNFTCollections(ownerAddress: string): Promise<GetNFTCollectionsResponse> {
    return this.#httpClient.get({
      url: `/nft/v2/${this.#apiKey}/getContractsForOwner`,
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

  async getAssetsTransfers(ownerAddress: string) {
    const params = {
      fromBlock: '0x0',
      toBlock: 'latest',
      withMetadata: true,
      order: 'desc',
      maxCount: '0x32', // 50
      category: ['external', 'erc20', 'erc721'],
    };
    const sent = await this.#httpClient.post({
      url: `/v2/${this.#apiKey}`,
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
      url: `/v2/${this.#apiKey}`,
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

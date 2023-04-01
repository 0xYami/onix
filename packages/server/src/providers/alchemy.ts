import { HttpClient } from '@onix/utils';
import {
  alchemyNFTSchema,
  getNFTCollectionResponseSchema,
  getNFTCollectionsResponseSchema,
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
}

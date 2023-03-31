import axios, { type Axios } from 'axios';
import { asyncFaillable } from '@onix/utils';
import {
  getNFTCollectionResponseSchema,
  getNFTCollectionsResponseSchema,
  type GetNFTCollectionsResponse,
  type GetNFTCollectionResponse,
} from '@onix/schemas';

type AlchemyConfig = {
  apiKey: string;
};

export class Alchemy {
  #apiKey: string;
  #httpClient: Axios;

  constructor(config: AlchemyConfig) {
    this.#apiKey = config.apiKey;
    this.#httpClient = axios.create({
      baseURL: `https://eth-mainnet.g.alchemy.com`,
    });
  }

  async getNFTCollection(
    ownerAddress: string,
    contractAddress: string,
  ): Promise<GetNFTCollectionResponse> {
    const response = await asyncFaillable<{ data: GetNFTCollectionResponse }>(
      this.#httpClient.get(`/nft/v2/${this.#apiKey}/getNFTs`, {
        params: {
          owner: ownerAddress,
          contractAddresses: [contractAddress],
          pageSize: 50,
          withMetadata: true,
          excludeFilters: ['AIRDROPS', 'SPAM'],
          spamConfidenceLevel: 'MEDIUM',
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get NFTs');
    }

    return getNFTCollectionResponseSchema.parse(response.result.data);
  }

  async getNFTCollections(ownerAddress: string): Promise<GetNFTCollectionsResponse> {
    const response = await asyncFaillable<{ data: GetNFTCollectionsResponse }>(
      this.#httpClient.get(`/nft/v2/${this.#apiKey}/getContractsForOwner`, {
        params: {
          owner: ownerAddress,
          pageSize: 50,
          excludeFilters: ['AIRDROPS', 'SPAM'],
          spamConfidenceLevel: 'MEDIUM',
        },
      }),
    );

    if (response.failed) {
      throw new Error('Failed to get NFT collections');
    }

    return getNFTCollectionsResponseSchema.parse(response.result.data);
  }
}

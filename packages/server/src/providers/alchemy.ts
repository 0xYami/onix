import axios, { type Axios } from 'axios';
import { asyncFaillable } from '@onix/utils';
import { getNFTCollectionsResponseSchema, type GetNFTCollectionsResponse } from '@onix/schemas';

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

  async getNFTCollections(ownerAddress: string): Promise<GetNFTCollectionsResponse> {
    const response = await asyncFaillable<{ data: GetNFTCollectionsResponse }>(
      this.#httpClient.get(
        `/nft/v2/${this.#apiKey}/getContractsForOwner?owner=${ownerAddress}&pageSize=50`,
      ),
    );

    if (response.failed) {
      throw new Error('Failed to get NFT collections');
    }

    return getNFTCollectionsResponseSchema.parse(response.result.data);
  }
}

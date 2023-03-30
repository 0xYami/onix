import { z, type ZodSchema } from 'zod';

const assetSymbolSchema = z.union([
  z.literal('ETH'),
  z.literal('USDT'),
  z.literal('USDC'),
  z.literal('DAI'),
  z.literal('MATIC'),
  z.literal('LINK'),
  z.literal('UNI'),
  z.literal('LDO'),
  z.literal('MKR'),
  z.literal('AAVE'),
  z.literal('APE'),
]);

const assetBalanceSchema = z.object({
  token: z.string(),
  usd: z.string(),
});

export const addressDetailsSchema = z.object({
  address: z.string(),
  etherBalance: assetBalanceSchema,
  totalBalance: z.string(),
  assets: z.array(
    z.object({
      name: z.string(),
      symbol: assetSymbolSchema,
      address: z.string(),
      balance: assetBalanceSchema,
    }),
  ),
});

const transferSchema = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  from: z.string(),
  contractAddress: z.string(),
  to: z.string(),
  value: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenDecimal: z.string(),
  transactionIndex: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  gasUsed: z.string(),
  cumulativeGasUsed: z.string(),
  confirmations: z.string(),
});

const transfers = z.array(transferSchema);

export const getAssetResultSchema = z.object({
  name: z.string(),
  symbol: assetSymbolSchema,
  address: z.string(),
  balance: assetBalanceSchema,
  transfers: z.array(transferSchema),
});

const NFTMedia = z.object({
  raw: z.string(),
  gateway: z.string(),
  thumbnail: z.string().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});

export const getNFTCollectionResponseSchema = z.object({
  pageKey: z.string().optional(),
  totalCount: z.number(),
  blockHash: z.string(),
  ownedNfts: z.array(
    z.object({
      contract: z.object({
        address: z.string(),
      }),
      id: z.object({
        tokenId: z.string(),
        tokenMetadata: z.object({
          tokenType: z.union([
            z.literal('ERC721'),
            z.literal('ERC1155'),
            z.literal('NO_SUPPORTED_NFT_STANDARD'),
            z.literal('NOT_A_CONTRACT'),
          ]),
        }),
      }),
      balance: z.string(),
      title: z.string(),
      description: z.string(),
      tokenUri: z.object({
        raw: z.string(),
        gateway: z.string(),
      }),
      media: z.array(NFTMedia),
      timeLastUpdated: z.string(),
      error: z.string().optional(),
      spamInfo: z.object({
        isSpam: z.union([z.literal('true'), z.literal('false')]),
        classifications: z.array(z.string()),
      }),
    }),
  ),
});

export const getNFTCollectionsResponseSchema = z.object({
  pageKey: z.string().optional(),
  totalCount: z.number(),
  contracts: z.array(
    z.object({
      address: z.string(),
      totalBalance: z.number(),
      numDistinctTokensOwned: z.number(),
      isSpam: z.boolean(),
      name: z.string(),
      title: z.string(),
      symbol: z.string(),
      tokenType: z.union([z.literal('ERC721'), z.literal('ERC1155')]),
      contractDeployer: z.string(),
      deployedBlockNumber: z.number(),
      media: z.array(NFTMedia).optional(),
      opensea: z
        .object({
          floorPrice: z.number().optional(),
          collectionName: z.string(),
          safelistRequestStatus: z.string(),
          imageUrl: z.string().optional(),
          description: z.string().optional(),
          externalLink: z.string().optional(),
          twitterUsername: z.string().optional(),
          discordUrl: z.string().optional(),
          lastIngestedAt: z.string(),
        })
        .optional(),
    }),
  ),
});

export type GetAssetResult = z.infer<typeof getAssetResultSchema>;
export type Transfers = z.infer<typeof transfers>;
export type AddressDetails = z.infer<typeof addressDetailsSchema>;
export type GetNFTCollectionResponse = z.infer<typeof getNFTCollectionResponseSchema>;
export type GetNFTCollectionsResponse = z.infer<typeof getNFTCollectionsResponseSchema>;

export { z };
export type { ZodSchema };

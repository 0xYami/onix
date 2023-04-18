import { z, type ZodSchema } from 'zod';

export const networkNames = ['mainnet', 'goerli', 'sepolia'] as const;
export const networkName = z.enum(networkNames);

export type NetworkName = z.infer<typeof networkName>;

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

export const alchemyERC20BalancesSchema = z.object({
  jsonrpc: z.string(),
  id: z.number(),
  result: z.object({
    address: z.string(),
    tokenBalances: z.array(
      z.object({
        contractAddress: z.string(),
        tokenBalance: z.string(),
      }),
    ),
  }),
});

export type AlchemyERC20Balances = z.infer<typeof alchemyERC20BalancesSchema>;

export const addressDetailsSchema = z.object({
  address: z.string(),
  etherBalance: assetBalanceSchema,
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

const NFTTypeSchema = z.union([z.literal('ERC721'), z.literal('ERC1155'), z.literal('UNKNOWN')]);

const NFTMetadataSchema = z.object({
  image: z.string().optional(),
  external_url: z.string().optional(),
  background_color: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  attributes: z
    .array(
      z.object({
        value: z.string(),
        trait_type: z.string(),
      }),
    )
    .optional(),
});

const NFTMedia = z.object({
  raw: z.string(),
  gateway: z.string(),
  thumbnail: z.string().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
});

export const alchemyNFTSchema = z.object({
  contract: z.object({
    address: z.string(),
  }),
  id: z.object({
    tokenId: z.string(),
    tokenMetadata: z.object({
      tokenType: z.union([
        NFTTypeSchema,
        z.literal('NO_SUPPORTED_NFT_STANDARD'),
        z.literal('NOT_A_CONTRACT'),
      ]),
    }),
  }),
  balance: z.string().optional(),
  title: z.string(),
  description: z.string(),
  tokenUri: z.object({
    raw: z.string(),
    gateway: z.string(),
  }),
  media: z.array(NFTMedia),
  metadata: NFTMetadataSchema,
  contractMetadata: z.object({
    name: z.string().optional(),
    symbol: z.string().optional(),
    totalSupply: z.string().optional(),
  }),
  timeLastUpdated: z.string(),
  error: z.string().optional(),
});

export const getNFTCollectionResponseSchema = z.object({
  pageKey: z.string().optional(),
  totalCount: z.number(),
  blockHash: z.string(),
  ownedNfts: z.array(alchemyNFTSchema),
});

export const nftCollectionSchema = z.object({
  pageKey: z.string().optional(),
  totalCount: z.number(),
  blockHash: z.string(),
  contract: z.object({
    name: z.string().optional(),
    address: z.string(),
  }),
  nfts: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      balance: z.string().optional(),
      id: z.string(),
      type: z.union([
        NFTTypeSchema,
        z.literal('NO_SUPPORTED_NFT_STANDARD'),
        z.literal('NOT_A_CONTRACT'),
      ]),
      metadata: NFTMetadataSchema,
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
      name: z.string().optional(),
      title: z.string(),
      symbol: z.string().optional(),
      tokenType: NFTTypeSchema,
      contractDeployer: z.string().optional(),
      deployedBlockNumber: z.number().optional(),
      media: z.array(NFTMedia).optional(),
      opensea: z
        .object({
          floorPrice: z.number().optional(),
          collectionName: z.string().optional(),
          safelistRequestStatus: z.string().optional(),
          imageUrl: z.string().optional(),
          description: z.string().optional(),
          externalLink: z.string().optional(),
          twitterUsername: z.string().optional(),
          discordUrl: z.string().optional(),
          lastIngestedAt: z.string().optional(),
        })
        .optional(),
    }),
  ),
});

const alchemyAssetTransferSchema = z.object({
  blockNum: z.string(),
  from: z.string(),
  to: z.string().nullable(),
  value: z.number().nullable(),
  tokenId: z.string().nullable(),
  asset: z.string().nullable(),
  hash: z.string(),
  metadata: z.object({
    blockTimestamp: z.string(),
  }),
  category: z.union([
    z.literal('external'),
    z.literal('internal'),
    z.literal('token'),
    z.literal('erc20'),
    z.literal('erc721'),
    z.literal('erc1155'),
    z.literal('specialnft'),
  ]),
});

export const alchemyAssetTransfersSchema = z.object({
  result: z.object({
    pageKey: z.string().optional(),
    transfers: z.array(alchemyAssetTransferSchema),
  }),
});

export const etherscanEtherPricesSchema = z.object({
  ethbtc: z.string(),
  ethbtc_timestamp: z.string(),
  ethusd: z.string(),
  ethusd_timestamp: z.string(),
});

export type EtherscanEtherPrices = z.infer<typeof etherscanEtherPricesSchema>;

export const etherscanGasPricesSchema = z.object({
  LastBlock: z.string(),
  SafeGasPrice: z.string(),
  ProposeGasPrice: z.string(),
  FastGasPrice: z.string(),
  suggestBaseFee: z.string(),
  gasUsedRatio: z.string(),
});

export type EtherscanGasPrices = z.infer<typeof etherscanGasPricesSchema>;

export const normalTransactionSchema = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  transactionIndex: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  isError: z.union([z.literal('0'), z.literal('1')]),
  txreceipt_status: z.union([z.literal('0'), z.literal('1')]),
  input: z.string(),
  contractAddress: z.string(),
  cumulativeGasUsed: z.string(),
  gasUsed: z.string(),
  confirmations: z.string(),
  methodId: z.string(),
  functionName: z.string(),
});

export type EtherscanNormalTransaction = z.infer<typeof normalTransactionSchema>;

export const getEtherscanNormalTransactions = z.object({
  status: z.union([z.literal('1'), z.literal('0')]),
  message: z.string(),
  result: normalTransactionSchema.array(),
});

export type GetEtherscanNormalTransactions = z.infer<typeof getEtherscanNormalTransactions>;

export type GetAssetResult = z.infer<typeof getAssetResultSchema>;
export type Transfers = z.infer<typeof transfers>;
export type AddressDetails = z.infer<typeof addressDetailsSchema>;
export type GetNFTCollectionResponse = z.infer<typeof getNFTCollectionResponseSchema>;
export type GetNFTCollectionsResponse = z.infer<typeof getNFTCollectionsResponseSchema>;
export type NFTCollection = z.infer<typeof nftCollectionSchema>;
export type AlchemyNFT = z.infer<typeof alchemyNFTSchema>;
export type AlchemyAssetTransfers = z.infer<typeof alchemyAssetTransfersSchema>;
export type AlchemyAssetTransfer = z.infer<typeof alchemyAssetTransferSchema>;

export { z };
export type { ZodSchema };

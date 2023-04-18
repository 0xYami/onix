import { z } from '@onix/schemas';

const networkConfig = z.object({
  apiKey: z.string().nonempty(),
  baseURL: z.string().nonempty(),
});

export type NetworkConfig = z.infer<typeof networkConfig>;

const configSchema = z
  .object({
    env: z.union([z.literal('development'), z.literal('production'), z.literal('test')]),
    host: z.string().nonempty(),
    port: z.coerce.number(),
    providers: z.object({
      alchemy: z.object({
        mainnet: networkConfig,
        goerli: networkConfig,
        sepolia: networkConfig,
      }),
      etherscan: z.object({
        mainnet: networkConfig,
        goerli: networkConfig,
        sepolia: networkConfig,
      }),
      coinmarketcap: networkConfig,
    }),
  })
  .strict();

export type Config = z.infer<typeof configSchema>;

export function getConfig(): Config {
  const config = configSchema.parse({
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    providers: {
      alchemy: {
        mainnet: {
          apiKey: process.env.ALCHEMY_MAINNET_API_KEY,
          baseURL: 'https://eth-mainnet.g.alchemy.com',
        },
        goerli: {
          apiKey: process.env.ALCHEMY_GOERLI_API_KEY,
          baseURL: 'https://eth-goerli.g.alchemy.com',
        },
        sepolia: {
          apiKey: process.env.ALCHEMY_SEPOLIA_API_KEY,
          baseURL: 'https://eth-sepolia.g.alchemy.com',
        },
      },
      etherscan: {
        mainnet: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          baseURL: 'https://api.etherscan.io/api',
        },
        goerli: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          baseURL: 'https://api-goerli.etherscan.io/api',
        },
        sepolia: {
          apiKey: process.env.ETHERSCAN_API_KEY,
          baseURL: 'https://api-sepolia.etherscan.io/api',
        },
      },
      coinmarketcap: {
        apiKey: process.env.COINMARKETCAP_API_KEY,
        baseURL: 'https://pro-api.coinmarketcap.com',
      },
    },
  });
  return config;
}

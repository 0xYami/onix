import { z } from '@onix/schemas';

const configSchema = z
  .object({
    env: z.union([z.literal('development'), z.literal('production'), z.literal('test')]),
    host: z.string().nonempty(),
    port: z.coerce.number(),
    apiKeys: z.object({
      etherscan: z.string().nonempty(),
      coinmarketcap: z.string().nonempty(),
    }),
  })
  .strict();

export type Config = z.infer<typeof configSchema>;

export function getConfig(): Config {
  const config = configSchema.parse({
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    apiKeys: {
      etherscan: process.env.ETHERSCAN_API_KEY,
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
  });
  return config;
}

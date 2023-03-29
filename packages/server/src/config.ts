import { z } from '@onix/schemas';

const configSchema = z
  .object({
    host: z.string().nonempty(),
    port: z.coerce.number(),
    apiKeys: z.object({
      etherscan: z.string().nonempty(),
      coinmarketcap: z.string().nonempty(),
    }),
  })
  .strict();

export function getConfig(): z.infer<typeof configSchema> {
  const config = configSchema.parse({
    host: process.env.HOST,
    port: process.env.PORT,
    apiKeys: {
      etherscan: process.env.ETHERSCAN_API_KEY,
      coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
  });
  return config;
}

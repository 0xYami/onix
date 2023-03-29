import { z } from '@onix/schemas';
import type { ClientConfig } from './client';

type Config = ClientConfig & {
  host: string;
  port: number;
};

const schema = z.string().nonempty();

export function getConfig(): Config {
  const host = schema.parse(process.env.HOST);
  const port = z.coerce.number().parse(process.env.PORT);
  const etherscanApiKey = schema.parse(process.env.ETHERSCAN_API_KEY);
  const coinmarketcapApikey = schema.parse(process.env.COINMARKETCAP_API_KEY);
  return {
    host,
    port,
    apiKeys: {
      etherscan: etherscanApiKey,
      coinmarketcap: coinmarketcapApikey,
    },
  };
}

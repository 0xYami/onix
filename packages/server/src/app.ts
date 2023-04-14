import Fastify, { type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { getConfig, type Config } from './config';
import {
  addressParamsSchema,
  erc20ActivityParams,
  nftQueryParamsSchema,
  userAssetParamsSchema,
} from './schemas';

const envToLoggerOptions: Record<Config['env'], FastifyServerOptions['logger']> = {
  production: true,
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  test: false,
};

const config = getConfig();
const router = Fastify({
  logger: envToLoggerOptions[config.env],
});

router.register(cors, { origin: true });

const client = new Client({ apiKeys: config.apiKeys });

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/users/:address', async (req) => {
    const { address } = addressParamsSchema.parse(req.params);
    return client.getAddressDetails(address);
  })
  .get('/users/:address/nfts/collections', async (req) => {
    const { address } = addressParamsSchema.parse(req.params);
    return client.alchemy.getNFTCollections(address);
  })
  .get('/users/:address/collections/:contractAddress', async (req) => {
    const { address, contractAddress } = userAssetParamsSchema.parse(req.params);
    return client.alchemy.getNFTCollection(address, contractAddress);
  })
  .get('/users/:address/collections/:contractAddress/:tokenId', async (req) => {
    const { address, contractAddress, tokenId } = nftQueryParamsSchema.parse(req.params);
    return client.alchemy.getNFT(address, contractAddress, tokenId);
  })
  .get('/users/:userAddress/asset/erc20/:contractAddressOrSymbol', async (req) => {
    const params = erc20ActivityParams.parse(req.params);
    return client.getAsset({
      userAddress: params.userAddress,
      contractAddressOrSymbol: params.contractAddressOrSymbol,
    });
  })
  .get('/users/:address/activity', async (req) => {
    const params = addressParamsSchema.parse(req.params);
    return client.alchemy.getAssetsTransfers(params.address);
  });

const start = async () => {
  try {
    await router.listen({
      host: config.host,
      port: config.port,
    });
  } catch (err) {
    router.log.error(err);
    process.exit(1);
  }
};

start();

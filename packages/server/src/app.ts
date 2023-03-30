import Fastify, { type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { getConfig, type Config } from './config';
import { addressParamsSchema, userAssetParamsSchema } from './schemas';

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
    return client.getNFTCollections(address);
  })
  .get('/users/:address/asset/erc20/:contractAddress', async (req) => {
    const params = userAssetParamsSchema.parse(req.params);
    return client.getAsset({
      userAddress: params.address,
      contractAddress: params.contractAddress,
    });
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

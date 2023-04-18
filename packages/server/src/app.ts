import Fastify, { type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { getConfig, type Config } from './config';
import {
  addressParamsSchema,
  baseQuerySchema,
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

const client = new Client({
  alchemy: config.providers.alchemy,
  etherscan: config.providers.etherscan,
  coinmarketcap: config.providers.coinmarketcap,
});

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/gas-prices', async (req) => {
    const query = baseQuerySchema.parse(req.query);
    return client.etherscan.getGasPrices(query.network);
  })
  .get('/users/:address', async (req) => {
    const params = addressParamsSchema.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.getAddressDetails(params.address, query.network);
  })
  .get('/users/:address/nfts/collections', async (req) => {
    const params = addressParamsSchema.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.alchemy.getNFTCollections(params.address, query.network);
  })
  .get('/users/:address/collections/:contractAddress', async (req) => {
    const params = userAssetParamsSchema.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.alchemy.getNFTCollection(params.address, params.contractAddress, query.network);
  })
  .get('/users/:address/collections/:contractAddress/:tokenId', async (req) => {
    const params = nftQueryParamsSchema.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.alchemy.getNFT(
      params.address,
      params.contractAddress,
      params.tokenId,
      query.network,
    );
  })
  .get('/users/:userAddress/asset/erc20/:contractAddressOrSymbol', async (req) => {
    const params = erc20ActivityParams.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.getAsset(
      {
        userAddress: params.userAddress,
        contractAddressOrSymbol: params.contractAddressOrSymbol,
      },
      query.network,
    );
  })
  .get('/users/:address/activity', async (req) => {
    const params = addressParamsSchema.parse(req.params);
    const query = baseQuerySchema.parse(req.query);
    return client.alchemy.getAssetsTransfers(params.address, query.network);
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

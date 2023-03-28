import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { addressDetailsParams } from './schemas';

const router = Fastify({
  logger: process.env.NODE_ENV === 'development',
});

router.register(cors, { origin: true });

const client = new Client({
  apiKeys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
});

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/address/:address', async (req) => {
    const { address } = addressDetailsParams.parse(req.params);
    return client.getAddressDetails(address);
  });

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await router.listen({ port });
  } catch (err) {
    router.log.error(err);
    process.exit(1);
  }
};

start();

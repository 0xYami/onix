import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { getConfig } from './config';
import { addressDetailsParams } from './schemas';

const router = Fastify({
  logger: process.env.NODE_ENV === 'development',
});

router.register(cors, { origin: true });

const config = getConfig();
const client = new Client({ apiKeys: config.apiKeys });

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

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Alchemy } from './alchemy';
import { addressDetailsParams } from './schemas';

// TODO: validate environment variables

const router = Fastify({
  logger: process.env.NODE_ENV === 'dev',
});

router.register(cors, { origin: true });

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: 'mainnet',
});

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/', async () => {
    const latestBlock = await alchemy.getBlockNumber();
    return { result: latestBlock };
  })
  .get('/address/:address', async (req) => {
    const { address } = addressDetailsParams.parse(req.params);
    return alchemy.getAddressDetails(address);
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

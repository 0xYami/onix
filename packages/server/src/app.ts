import Fastify from 'fastify';
import { Network, Alchemy } from 'alchemy-sdk';

const router = Fastify({
  logger: true,
});

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/', async () => {
    const latestBlock = await alchemy.core.getBlockNumber();
    return { result: latestBlock };
  });

try {
  await router.listen({ port: 4000 });
} catch (err) {
  router.log.error(err);
  process.exit(1);
}

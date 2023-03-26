import Fastify from 'fastify';
import { Network, Alchemy } from 'alchemy-sdk';
import { take } from './utils';

const router = Fastify({
  logger: process.env.NODE_ENV === 'dev',
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
  })
  .route({
    method: 'GET',
    url: '/address/:address',
    handler: async (req) => {
      // @ts-expect-error
      const { address } = req.params
      const allBalances = await alchemy.core.getTokenBalances(address);

      const balances = take(allBalances.tokenBalances, 10);

      const result = await Promise.all(
        balances.map(async (token) => {
          if (!token.tokenBalance) return null;
          const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
          const balance = (Number(token.tokenBalance) / Math.pow(10, metadata.decimals!)).toFixed(2);
          return {
            name: metadata.name,
            balance,
            symbol: metadata.symbol,
          };
        }),
      );

      return result
    },
    schema: {
      querystring: {
        address: { type: 'string' },
      }
    }
  });

try {
  // TODO: validate environment variables
  const port = Number(process.env.PORT) || 4000;
  await router.listen({ port });
} catch (err) {
  router.log.error(err);
  process.exit(1);
}

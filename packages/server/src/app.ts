import Koa from 'koa';
import Router from '@koa/router';
import { Network, Alchemy } from 'alchemy-sdk';

const app = new Koa();
const router = new Router();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

router
  .get('/_health', async (ctx) => {
    ctx.body = 'healthy';
  })
  .get('/', async (ctx) => {
    const latestBlock = await alchemy.core.getBlockNumber();
    ctx.body = latestBlock;
  });

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);

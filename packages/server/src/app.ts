import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { AddressDetails } from '@onix/schemas';
import BigNumber from 'bignumber.js';
import { Etherscan } from './etherscan';
import { CoinMarketCap } from './coinmarketcap';
import { tokens } from './tokens';
import { addressDetailsParams } from './schemas';
import { take, toBaseUnit } from './utils';

// TODO: validate environment variables

const router = Fastify({
  logger: process.env.NODE_ENV === 'dev',
});

router.register(cors, { origin: true });

const etherscan = new Etherscan();
const coinmarketcap = new CoinMarketCap();

router
  .get('/_health', () => {
    return 'healthy';
  })
  .get('/address/:address', async (req) => {
    const { address } = addressDetailsParams.parse(req.params);
    const etherBalance = await etherscan.getEtherBalance(address);
    const etherPrice = await etherscan.getEtherPrice();

    const tokens_ = take(tokens, 3);
    const assets = await Promise.all(
      tokens_.map(async (token) => {
        const balance = await etherscan.getERC20Balance(address, token.address);
        return {
          ...token,
          balance: {
            token: new BigNumber(balance).div(new BigNumber(10).pow(token.decimals)).toFixed(4),
            // To be set once token prices have been fetched
            usd: '0',
          },
        };
      }),
    );

    const tokenSymbols = tokens_.map(token => token.symbol);
    const tokenPrices = await coinmarketcap.getTokenPrices(tokenSymbols)

    assets.forEach((asset, index) => {
      asset.balance.usd = new BigNumber(asset.balance.token).times(tokenPrices[index].quote.USD.price).toFixed(4);
    })

    const totalBalance = assets.reduce(
      (acc, asset) => acc.plus(new BigNumber(asset.balance.usd)),
      new BigNumber(0),
    );

    const result: AddressDetails = {
      address,
      etherBalance: {
        token: toBaseUnit(etherBalance, 18).toFixed(4),
        usd: toBaseUnit(etherBalance, 18).times(etherPrice).toFixed(4),
      },
      totalBalance: totalBalance.toFixed(4),
      assets,
    };

    return result;
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

import Fastify, { type FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import { Client } from './client';
import { getConfig, type Config } from './config';
import { addressDetailsParams } from './schemas';

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

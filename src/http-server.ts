import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { STATUS_CODES } from 'node:http';
import { randomUUID } from 'node:crypto';

import fastify from 'fastify';
import { createHttpTerminator } from 'http-terminator';
import { rootLogger } from './infra/logger';
import { PORT } from './config';
import { isFastifyError } from './errors';

export const HEADER_REQUEST_ID = 'request-id';
export const HEADER_X_REQUEST_ID = 'X-Request-Id';
export const HEADER_X_REQUEST_ID_LOWER = HEADER_X_REQUEST_ID.toLowerCase();

export interface ServerOptions {
  signal: AbortSignal;
}

export interface Server {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  get: () => FastifyInstance;
}

const buildServer = async (
  { signal }: ServerOptions,
  register: FastifyPluginAsync
): Promise<Server> => {
  const logger = rootLogger.child({
    context: 'http',
  });

  const app: FastifyInstance = fastify({
    logger,
    disableRequestLogging: true,
    requestIdLogLabel: 'requestId',
    requestIdHeader: HEADER_X_REQUEST_ID_LOWER,
    genReqId(req) {
      return (
        // fall back to non-x header or generate one
        (req.headers[HEADER_REQUEST_ID] as string) ?? `DSS:${randomUUID()}`
      );
    },
  });

  app.addHook('onSend', async (req, reply) => {
    void reply.header(HEADER_X_REQUEST_ID, req.id);
  });

  app.addHook('onRequest', async (req) => {
    req.log.info({ req }, 'incoming request');
  });

  app.setErrorHandler((err, req, reply) => {
    req.log.error({ err }, err.message);

    if (isFastifyError(err)) {
      void reply.status(err.statusCode ?? 500).send({
        error:
          err.statusCode != null
            ? STATUS_CODES[err.statusCode]
            : 'Unknown Error',
        message: err.message,
        statusCode: err.statusCode,
        code: err.code,
      });

      return;
    }

    void reply.status(500).send({
      error: 'Unknown Error',
      statusCode: 500,
      code: 'UNKNOWN',
    });
  });

  app.addHook('onResponse', async (req, res) => {
    const data = { statusCode: res.raw.statusCode, req, res };

    if (res.statusCode >= 400 && res.statusCode < 500) {
      req.log.warn(data, 'request completed');
      return;
    }
    if (res.statusCode >= 500) {
      req.log.error(data, 'request completed with error');
      return;
    }

    req.log.info(data, 'request completed');
  });

  app.get('/.well-known/health', { logLevel: 'warn' }, () => ({
    status: 'OK',
  }));

  await app.register(register);

  let stoping = false;

  const httpTerminator = createHttpTerminator({
    server: app.server,
  });

  const stop = async (): Promise<void> => {
    if (stoping) {
      return;
    }

    stoping = true;

    signal.removeEventListener('abort', stop);

    app.log.warn('stopping server');

    await httpTerminator.terminate().catch((err) => {
      logger.warn({ err }, 'failed to stop server');
    });
  };

  return {
    stop,
    get() {
      return app;
    },
    async start(port?: number) {
      await app.listen({
        host: '0.0.0.0',
        port: port ?? PORT,
      });

      signal.addEventListener('abort', stop);
    },
  };
};

export { buildServer };

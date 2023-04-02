import pino from 'pino';

const prettryLogIsEnabled = ((): boolean => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  try {
    return !(require.resolve('pino-pretty').length === 0) && true;
  } catch {
    return false;
  }
})();

const rootLogger = pino({
  name: 'example-app',
  level: (process.env.LOG_LEVEL ?? 'info').toLowerCase(),
  base: {
    version: process.env.APP_VERSION ?? 'unknown',
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  formatters: {
    messageKey: 'message',
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
  ...(prettryLogIsEnabled
    ? {
        transport: {
          target: 'pino-pretty',
        },
      }
    : {}),
});

export { rootLogger };

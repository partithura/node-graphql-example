import type { FastifyError } from 'fastify';

const isFastifyError = (error: unknown): error is FastifyError => {
  return error instanceof Error && 'statusCode' in error;
};

export { isFastifyError };

const DATABASE = Object.freeze({
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_USERNAME: process.env.DB_USERNAME ?? 'root',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 's3cr3t',
  DB_NAME: process.env.DB_NAME ?? 'graphql',
});

export { DATABASE };

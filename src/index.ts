import app from './app';
import { env } from './config/env';
import { testConnection } from './config/db';

async function start() {
  await testConnection();
  app.listen(env.PORT, () => {
    console.log(`\u{1F680} Aspire API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

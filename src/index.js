import 'dotenv/config';
import app from './app.js';
import logger from './logs/logger.js';
import config from './config/env.js';
import { sequelize } from './database/database.js';

async function main() {
  await sequelize.sync({force: true});
  const port = config.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    logger.info(`Server is running on port ${port}`);
  });
}

main();
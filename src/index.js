import setupServer from './server.js';
import initMongoDB from './db/initMongoCollection.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();

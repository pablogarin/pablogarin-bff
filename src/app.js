// Third-party imports
const express = require('express');
// Configure env variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// Custom Imports
const {DIContainer} = require('./DIContainer');
const {APIRoutes} = require('./routes');

const startServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Config dependencies
  app.diContainer = new DIContainer();
  await app.diContainer.prepare();

  // Thrid-party middlewares
  app.use(express.json());
  // Custom Middlewares
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });
  app.use(APIRoutes);

  // Start app
  app.listen(PORT, () => {
    app.startDate = new Date();
    console.log(`Server running on port ${PORT}`);
  });
};

if (require.main === module ) {
  startServer();
}

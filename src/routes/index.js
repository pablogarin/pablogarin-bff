const proyect = require('./project');
const health = require('./health');

// TODO: API should have auth middleware

/**
 * Registers routes for the API
 * @param {Express.Request} req Request object
 * @param {Express.Response} res Response object
 * @param {Express.next} next next function
 */
const APIRoutes = (req, res, next) => {
  const app = req.app;
  app.use('/project', proyect);
  app.use('/health', health);
  next();
};

module.exports = {APIRoutes};

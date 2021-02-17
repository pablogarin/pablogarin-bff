const experience = require('./experience');
const health = require('./health');
const proyect = require('./project');

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
  app.use('/experience', experience);
  app.use('/health', health);
  next();
};

module.exports = {APIRoutes};

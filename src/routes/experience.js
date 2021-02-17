const express = require('express');
const {BadRequest} = require('http-errors');
const router = new express.Router();

const {getStatusCodeFromError} = require('./routesHelper');
const {APIController} = require('../controllers/APIController');

router.use((req, res, next) => {
  console.log('Making a request to the Experiences resource');
  const app = req.app;
  req.controller = new APIController(
      app.diContainer.get('experience', 'database'),
  );
  next();
});

router.get('/', async (req, res) => {
  try {
    const controller = req.controller;
    // TODO: get search query
    const {query: {
      page=1,
      limit,
    }} = req;
    if (isNaN(page) || (limit && isNaN(limit))) {
      throw new BadRequest('invalid parameters');
    }
    const experienceList = await controller.getAll(
        parseInt(page, 10),
        parseInt(limit, 10),
    );
    res.send({
      'success': true,
      'experiences': experienceList,
    });
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.get('/:experienceId', async (req, res) => {
  try {
    const {params: {experienceId: id}} = req;
    const controller = req.controller;
    const experience = await controller.getById(id);
    res.statusCode = 200;
    res.send(experience);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.post('/', async (req, res) => {
  try {
    const {body: data} = req;
    const controller = req.controller;
    const experience = await controller.createResource(data);
    res.statusCode = 201;
    res.send(experience);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.put('/:experienceId', async (req, res) => {
  try {
    const {params: {experienceId: id}, body: data} = req;
    const controller = req.controller;
    const update = await controller.updateResource(id, data);
    res.send(update);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.delete('/:experienceId', async (req, res, next) => {
  try {
    const {params: {experienceId: id}} = req;
    const controller = req.controller;
    const deleted = await controller.disableResource(id);
    if (deleted) {
      res.statusCode = 200;
      res.send(deleted);
    }
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

module.exports = router;

const express = require('express');
const { BadRequest } = require('http-errors');
const router = new express.Router();

const {getStatusCodeFromError} = require('./routesHelper');
const {ProjectsController} = require('../controllers/ProjectsController');

router.use((req, res, next) => {
  console.log('Making a request to the projects resource');
  const app = req.app;
  req.controller = new ProjectsController(
      app.diContainer.get('project', 'database'),
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
    const projectList = await controller.getAll(
        parseInt(page, 10),
        parseInt(limit, 10),
    );
    res.send({
      'success': true,
      'projects': projectList,
    });
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.get('/:projectId', async (req, res) => {
  try {
    const {params: {projectId: id}} = req;
    const controller = req.controller;
    const project = await controller.getById(id);
    res.statusCode = 200;
    res.send(project);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.post('/', async (req, res) => {
  try {
    const {body: data} = req;
    const controller = req.controller;
    const project = await controller.createProject(data);
    res.statusCode = 201;
    res.send(project);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.put('/:projectId', async (req, res) => {
  try {
    const {params: {projectId: id}, body: data} = req;
    const controller = req.controller;
    const update = await controller.updateProject(id, data);
    res.send(update);
  } catch (e) {
    res.statusCode = getStatusCodeFromError(e);
    res.send({'message': e.message});
  }
});

router.delete('/:projectId', async (req, res, next) => {
  try {
    const {params: {projectId: id}} = req;
    const controller = req.controller;
    const deleted = await controller.disableProject(id);
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

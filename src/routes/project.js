const express = require('express');
const router = new express.Router();

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
  const controller = req.controller;
  try {
    const {query: {
      page=1,
      limit,
    }} = req;
    if (isNaN(page) || (limit && isNaN(limit))) {
      throw new Error('invalid parameters');
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
    res.status = 500;
    res.send({'message': e.message});
  }
});

router.get('/:projectId', async (req, res) => {
  const {params: {projectId: id}} = req;
  try {
    const controller = req.controller;
    const project = await controller.getById(id);
    res.status = 200;
    res.send(project);
  } catch (e) {
    res.status = 500;
    res.send({'message': e.message});
  }
});

router.post('/', async (req, res) => {
  try {
    const {body: data} = req;
    const controller = req.controller;
    const project = await controller.createProject(data);
    res.status = 200;
    res.send(project);
  } catch (e) {
    res.status = 500;
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
    res.status = 500;
    res.send({'message': e.message});
  }
});

router.delete('/:projectId', async (req, res, next) => {
  try {
    const {params: {projectId: id}} = req;
    const controller = req.controller;
    const deleted = await controller.disableProject(id);
    if (deleted) {
      res.status = 200;
      res.send(deleted);
    }
  } catch (e) {
    res.status = 500;
    res.send({'message': e.message});
  }
});

module.exports = router;

const express = require('express');
const router = new express.Router();

router.use((req, res, next) => {
  console.log('Requested a health check');
  next();
});

router.get('/', (req, res) => {
  const startDate = req.app.startDate;
  const diff = (new Date() - startDate) / 1000;
  res.status = 200;
  res.send({
    'name': process.env.npm_package_name,
    'message': `Server running`,
    'startDate': startDate,
    'age': `${diff} seconds running`,
  });
});

module.exports = router;

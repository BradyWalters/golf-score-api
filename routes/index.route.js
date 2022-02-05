var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(`hey, you're in the index route`);
});

module.exports = router;

const express = require('express');
const router = express.Router();


const bootcampRouter = require('./bootcamp');


router.use('/bootcamps', bootcampRouter);


module.exports = router;
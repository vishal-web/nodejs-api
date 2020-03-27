const express = require('express');
const router = express.Router();


const bootcampRouter = require('./bootcamps');
const courseRouter = require('./courses');


router.use('/bootcamps', bootcampRouter);
router.use('/courses', courseRouter);


module.exports = router;
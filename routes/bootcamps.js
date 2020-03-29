const express = require('express');
const router = express.Router();

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps')

const Bootcamp = require('../models/Bootcamp');
const advancedResult = require('../middleware/advancedResult');

// Incluse other resourse router
const courseRouter = require('./courses');

// Re-router into other resourse routers
router.use('/:bootcampId/courses', courseRouter);


router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);


router.route('/')
  .get(advancedResult(Bootcamp, 'course'), getBootcamps)
  .post(createBootcamp);


router.route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = router;
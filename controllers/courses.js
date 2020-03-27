const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public 
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId)  {
    query = Course.find({ bootcamp: req.params.bootcampId})
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'  
    });
  }

  const courses = await query;

  res.status(200).json({
    status: true,
    count: courses.length,
    data: courses,
  })
})

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public 
exports.getCourse = asyncHandler(async (req, res, next) => {
  
  const course = await Course.findById(req.params.id);

  if (req.params.populate === 'bootcamp') {
    course.populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  if (!course) {
    return next(new ErrorResponse(`Course is not found with the id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    status: true,
    data: course,
    count: course.length
  })
})

// @desc    Add a course
// @route   POST /api/v1/bootcamp/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {

  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = Bootcamp.findById(req.params.bootcampId); 

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp is not being found by id of ${req.params.bootcampId}`));
  }

  const course = await Course.create(req.body);
  
  res.status(200).json({
    status: true,
    data: course
  })
})

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course found by id of ${req.params.id}`, 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: true,
    data: course
  })
})


// @desc     Delete Course
// @route    DELETE /api/v1/courses/:id
// @access   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course found by id of ${req.params.id}`, 404));
  }

  course = course.remove();

  res.status(200).json({
    status: true,
    data: []
  })
})
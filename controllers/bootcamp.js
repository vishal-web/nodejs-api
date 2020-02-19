const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    status: true,
    count: bootcamps.length,
    data: bootcamps
  });
})

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const singleBootcamp = await Bootcamp.findById(id);

  if (!singleBootcamp) {
    return  next(new ErrorResponse(`Bootcamp is not found with id of ${id}`, 404));
  }

  res.status(200).json({
    status: true,
    data: singleBootcamp
  })
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private 
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(200).json({
    status: true,
    data : bootcamp
  })
})

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { params: { id }, body } = req;

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  })

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp is not found with id of ${id}`, 404));
  }

  res.status(200).json({
    status: true,
    data: bootcamp
  })
})

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private 
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { params: { id } } = req;
  const bootcamp = await Bootcamp.findByIdAndDelete(id) 
  
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp is not found with id of ${id}`, 404));
  }

  res.status(200).json({
    status: true,
    data: []
  })
})


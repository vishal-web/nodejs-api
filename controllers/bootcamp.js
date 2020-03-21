const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  let query;

  // Copy query string
  let reqQuery = { ...req.query };

  // Remove feilds
  let removeFields = ['select', 'sort'];

  // Loop over & remove field from reqQuery
  removeFields.forEach(row => delete reqQuery[row]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Executing query
  const bootcamps = await query;

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


// @desc    Get bootcamps with in a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private 
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { params: { zipcode, distance } } = req;
  
  // Get lat & long from geocoders
  const loc =  await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide dist by radius of Earth
  // Earth radius = 3963 mi / 6378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[ lat, lng ], radius ] } }
  });

  res.status(200).json({
    status: true,
    count: bootcamps.length,
    data: bootcamps
  })
})

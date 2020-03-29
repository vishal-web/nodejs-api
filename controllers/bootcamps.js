const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const path = require('path');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
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
  const bootcamp = await Bootcamp.findById(id) 
  
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp is not found with id of ${id}`, 404));
  }

  bootcamp.remove();

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


// @desc    Upload photo for bootcamp
// @route   GET /api/v1/bootcamps/:id/photo
// @access  Private 
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp is found by the id of ${req.params.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const { file } = req.files;

  // Make sure file must be an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }  

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upalod an image file size less than ${process.env.MAX_FILE_UPLOAD }`,400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}` 

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

    res.status(200).json({
      status: true,
      data: file.name
    })
  })
})

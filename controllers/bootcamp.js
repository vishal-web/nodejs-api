const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = async (req, res, next) => {

  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      status: true,
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (err) {
    res.status(400).json({
      status: false
    })
  }
}

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = async (req, res, next) => {
  const { id } = req.params;

  try {
    const singleBootcamp = await Bootcamp.findById(id);

    if (!singleBootcamp) {
      return  next(new ErrorResponse(`Bootcampt is not found with id of ${id}`, 404));
    }

    res.status(200).json({
      status: true,
      data: singleBootcamp
    })
  } catch (err) {
    next(new ErrorResponse(`Bootcampt is not found with id of ${id}`, 404));
  }
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private 
exports.createBootcamp = async (req, res, next) => {

  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({
      status: true,
      data : bootcamp
    })
  } catch (err) {

    res.status(400).json({
      status: false
    })
  }
}

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.updateBootcamp = async (req, res, next) => {
  const { params: { id }, body } = req;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    })
  
    if (!bootcamp) {
      return res.status(400).json({ status: false });
    }

    res.status(200).json({
      status: true,
      data: bootcamp
    })
  } catch (err) {
    res.status(400).json({
      status: false
    })
  }
}

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private 
exports.deleteBootcamp = async (req, res, next) => {
  const { params: { id } } = req;

  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(id) 
    
    if (!bootcamp) {
      return res.status(400).json({ status: false})
    }

    res.status(200).json({
      status: true,
      data: 'Deleted'
    })
  } catch (err) {
    res.status(400).json({
      status: false
    })
  }
}


const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = async (req, res, next) => {

  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      status: true,
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
      return res.status(400).json({ status: null })
    }

    res.status(200).json({
      status: true,
      data: singleBootcamp
    })
  } catch (err) {
    res.json(400).json({
      status: false
    })
  }


  res.status(200).json({
    status: true,
    msg: `Show bootcamps ${req.params.id}`
  })
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
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    status: true,
    msg: `Update bootcamps ${req.params.id}`
  })
}

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private 
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    msg: `Delete bootcamp ${req.params.id}`
  })
}


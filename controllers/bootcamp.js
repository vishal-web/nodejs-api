// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    status: true,
    msg: 'Showing all bootcamps'
  });
}

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    status: true,
    msg: `Show bootcamps ${req.params.id}`
  })
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private 
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    status: true,
    msg: `Create new bootcamp`
  })
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


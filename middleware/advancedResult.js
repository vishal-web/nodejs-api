const advancedResult = (Model, populate) => async (req, res, next) => {

  let query;

  // Copy query string
  let reqQuery = { ...req.query };

  // Remove feilds
  let removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over & remove field from reqQuery
  removeFields.forEach(row => delete reqQuery[row]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Model.find(JSON.parse(queryStr));

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

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate)
  }

  // Executing query
  const results = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.advancedResult = {
    status: true,
    count: results.length,
    pagination,
    data: results
  }

  next();
}

module.exports = advancedResult;
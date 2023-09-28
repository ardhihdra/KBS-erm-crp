const paginatedList = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    const populatePath = [];
    Object.keys(Model.schema.obj).forEach((key) => {
      if (Model.schema.path(key).instance === 'ObjectID' && Model.schema.path(key).path)
        populatePath.push(Model.schema.path(key).path);
    });
    //  Query the database for a list of all results
    const resultsPromise = Model.find({ $ne: { removed: true } })
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' })
      .populate(populatePath.join(' '));
    // Counting the total documents
    const countPromise = Model.count({ $ne: { removed: true } });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);
    // const cekType = Model.schema.path(field);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

module.exports = paginatedList;

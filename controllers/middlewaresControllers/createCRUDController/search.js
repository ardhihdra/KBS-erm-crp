const search = async (Model, req, res) => {
  // console.log(req.query.fields)
  if (req.query.q === undefined || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
  const fieldsArray = req.query.fields
    ? req.query.fields.split(',')
    : ['name', 'surname', 'birthday'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    const type = Model.schema.path(field).instance;
    const value =
      type === 'Number' ? Number(req.query.q) : { $regex: new RegExp(String(req.query.q), 'i') };
    fields.$or.push({ [field]: value });
  }
  // console.log(fields)
  try {
    let results = await Model.find(fields).where('removed', { $ne: true }).limit(10);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: 'Successfully found all documents',
      });
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: 'No document found by this request',
        })
        .end();
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

module.exports = search;

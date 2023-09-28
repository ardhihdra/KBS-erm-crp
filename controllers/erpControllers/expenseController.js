const mongoose = require('mongoose');
const moment = require('moment');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Model = mongoose.model('Expense');
const methods = createCRUDController('Expense');

delete methods['create'];

methods.create = async (req, res) => {
  try {
    // Creating a new document in the collection
    const payload = { ...req.body };
    delete payload.status;
    delete payload.items;
    delete payload.taxRate;
    delete payload.amount;
    payload.expenseCategory = '64fc9f11cecad6a8631d307b';

    const promises = [];
    for (let item of req.body.items) {
      payload.total = item.total;
      payload.subTotal = Number(item.total) * Number(item.price);
      promises.push(new Model(payload).save());
    }
    const result = await Promise.all(promises);
    // Returning successfull response
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });
  } catch (err) {
    console.error(err);
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};

module.exports = methods;

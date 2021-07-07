const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const names = new Schema({
  name: {
    type: String,
    required: true,
  },
  where: {
    type: String,
    required: true,
  }
});
const name_schema = mongoose.model('names', names);
module.exports = name_schema;
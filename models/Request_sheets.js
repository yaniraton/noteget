const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Request = new Schema({
  name: {
    type: String,
    required: true,
  },
  songwriter: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
}, { timestamps: true });
const Request_schema = mongoose.model('requests', Request);
module.exports = Request_schema;
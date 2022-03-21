const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sheetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  songauthor: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true
  },
  haseazy: {
    type: Boolean,
    required: true
  },
  hashard: {
    type: Boolean,
    required: true
  },
  hardfile: {
    type: String
  },
  eazyfile: {
    type: String
  },
  widget:{
    type: String,
    required: true
  }

}, { timestamps: true });
sheetSchema.index({name: 'text', songauthor: 'text2'});
const sheet_schema = mongoose.model('sheets', sheetSchema);
module.exports = sheet_schema;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankSchema = new Schema({
  bank_id: {
    type: String,
    default: null,
  },
  bank_name: {
    type: String,
    default: null,
  },
  account_name: {
    type: String,
    default: null,
  },
  account_number: {
    type: String,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  image: {
    type: String,
  }
});

exports.Bank = mongoose.model('Bank', bankSchema);

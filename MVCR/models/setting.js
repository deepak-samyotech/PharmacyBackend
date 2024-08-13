const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },

  sitetitle: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  copyright: {
    type: String,
    default: null,
  },
  contact: {
    type: String,
    default: null,
  },
  currency: {
    type: String,
    default: null,
  },
  symbol: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
    trim: true,
  },
  address: {
    type: String,
    default: null,
    trim: true,
  },
});

exports.Setting = mongoose.model("Setting", settingSchema);

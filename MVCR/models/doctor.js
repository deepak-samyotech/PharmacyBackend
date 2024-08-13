const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    default: null,
  },
  contact: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
});

exports.Doctor = mongoose.model("Doctor", doctorSchema);
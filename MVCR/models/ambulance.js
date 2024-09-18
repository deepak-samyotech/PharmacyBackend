const mongoose = require("mongoose");
const { Schema } = mongoose;

const ambulanceSchema = new Schema({
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
  hospital_name: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    default: null,
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  employee_id:{
    type: Schema.Types.ObjectId,
    ref: "CreateEmployee",
    default: null,
  }
});

exports.Ambulance = mongoose.model("Ambulance", ambulanceSchema);

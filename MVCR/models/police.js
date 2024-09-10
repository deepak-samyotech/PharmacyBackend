const mongoose = require("mongoose");
const { Schema } = mongoose;

const policeSchema = new Schema({
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
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
  }
});

exports.Police = mongoose.model("Police", policeSchema);
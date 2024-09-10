const mongoose = require("mongoose");
const { Schema } = mongoose;

const fireServiceSchema = new Schema({
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

exports.FireService = mongoose.model("FireService", fireServiceSchema);

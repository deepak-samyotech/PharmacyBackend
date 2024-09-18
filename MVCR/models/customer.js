const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  c_id: {
    type: String,
    default: null,
  },
  c_name: {
    type: String,
    default: null,
  },
  pharmacy_name: {
    type: String,
    default: null,
  },
  c_email: {
    type: String,
    default: null,
  },
  c_type: {
    type: String,
    enum: ['Regular', 'Wholesale'],
    default: 'Regular'
  },
  barcode: {
    type: String,
    default: null,
  },
  cus_contact: {
    type: String,
    default: null,
  },
  c_address: {
    type: String,
    default: null,
  },
  c_note: {
    type: String,
    default: null,
  },
  image: {
    type: String,
  },
  regular_discount: {
    type: Number,
    default: 0,
  },
  target_amount: {
    type: Number,
    default: null,
  },
  target_discount: {
    type: Number,
    default: null,
  },
  entry_date: {
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

exports.Customer = mongoose.model('Customer', customerSchema);

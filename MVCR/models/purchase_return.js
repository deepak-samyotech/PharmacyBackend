const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedicineDataSchema = new Schema({
  medicine_id: String,
  product_name: String,
  mrp: String,
  return_qty: String,
  trade_discount: String,
  total: String
});

const PurchaseReturnSchema = new Schema({
  invoice_no: String,
  date: Date,
  details: String,
  grand_total: String,
  medicineData: [MedicineDataSchema],
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

exports.PurchaseReturn = mongoose.model("PurchaseReturn", PurchaseReturnSchema);
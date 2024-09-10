const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseReturnSchema = new Schema({
  id:  Number,
  r_id:  String,
  pur_id:  String,
  supplier_name: String,
  sid:  String,
  invoice_no:  String,
  return_date:  String,
  total_deduction:  String,
  total_amount: String,
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
}
});

exports.PurchaseReturn = mongoose.model("PurchaseReturn", PurchaseReturnSchema);
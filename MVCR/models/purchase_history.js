const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseHistorySchema = new Schema({
  supplier_name: {
    type: String,
  },
  supplier_id: {
    type: String,
    default: null,
},
  invoice_no: {
    type: String,
  },
  date: {
    type: String,
    default: null,
  },
  details: {
    type: String,
  },
  // medicines: [Medicine_Schema],
  product_name: {
    type: String,
  },
  generic_name: {
    type: String,
  },
  form: {
    type: String,
  },
  expire_date: {
    type: String,
  },
  sale_qty: {
    type: String,
  },
  trade_price: {
    type: String,
  },
  mrp: {
    type: String,
  },
  total_amount: {
    type: String,
  },
  barcode: {
    type: String,
  },
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
  }
});

exports.PurchaseHistory = mongoose.model("PurchaseHistory", PurchaseHistorySchema);

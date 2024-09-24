const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurchaseHistorySchema = new Schema({
  invoice_no: {
    type: String,
  },
  total_amount: {
    type: String,
  },
  details: {
    type: String,
  },
  medicineData: [{
    medicine_id: {
      type: Schema.Types.ObjectId,
      ref: "Medicine",
      default:null
    },
    purchase_qty: {
      type: String,
      default: '0'
    }
  }],
  
  company_id: {
    type: Schema.Types.ObjectId,
    ref:"User"
  }
}, {timestamps:true});

exports.PurchaseHistory = mongoose.model("PurchaseHistory", PurchaseHistorySchema);

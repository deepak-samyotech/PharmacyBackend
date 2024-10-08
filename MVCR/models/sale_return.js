const mongoose = require("mongoose");
const { Schema } = mongoose;

const Sale_ReturnSchema = new Schema({
  invoiceObjectId: { type: String, default: null },
  customerName: { type: String, default: null },
  sale_id: { type: String, default: null },
  invoiceNumber: { type: String, default: null },
  invoiceDate: { type: String, default: null },
  returnDate: { type: String, default: null },
  type: { type: String, default: null },
  medicineData: [
    {
      medicine_id: { type: String, default: null },
      medicine: { type: String, default: null },
      generic: { type: String, default: null },
      saleQty: { type: String, default: null },
      returnQty: { type: String, default: null },
      salePrice: { type: String, default: null },
      deduction: { type: String, default: null },
      total: { type: String, default: null },
    },
  ],
  grandTotal: { type: String, default: null },
  grandDeduction: { type: String, default: null },
  totalReturn: { type: String, default: null },
  company_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  employee_id: {
    type: Schema.Types.ObjectId,
    ref: "CreateEmployee",
    default: null,
  }
});

exports.Sale_Return = mongoose.model("Sale_Return", Sale_ReturnSchema);

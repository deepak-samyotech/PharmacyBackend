const mongoose = require("mongoose");
const { Schema } = mongoose;

const manage_invoiceSchema = new Schema({
  invoiceId: {
    type: String,
    default: null,
  },
  sale_id: {
    type: String,
    default: null,
  },
  customerName: {
    type: String,
    default: null,
  },
  customer_id: {
    type: String,
    default: null,
  },
  contact: {
    type: String,
    default: null,
  },
  customerType: {
    type: String,
    default: null,
  },
  createDate: {
    type: String,
    default: null,
  },
  medicineData: [
    {
      medicine: {
        type: String,
        default: null,
      },
      genericName: {
        type: String,
        default: null,
      },
      qty: {
        type: String,
        default: null,
      },
      discount: {
        type: String,
        default: null,
      },
      medMrp: {
        type: String,
        default: null,
      },
      product_total: {
        type: String,
        default: null,
      },
    },
  ],
  grand_total: {
    type: String,
    default: null,
  },
  total_paid: {
    type: String,
    default: null,
  },
  total_due: {
    type: String,
    default: null,
  },
});

exports.Manage_Invoice = mongoose.model("Manage_Invoice", manage_invoiceSchema);

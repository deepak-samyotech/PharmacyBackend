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
      medicine_id: {
        type: String,
        default:null,
      },
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
        default: '0',
      },
      prevReturnQty: {
        type: String,
        default: '0'
      },
      discount: {
        type: String,
        default: '0',
      },
      medMrp: {
        type: String,
        default: '0',
      },
      product_total: {
        type: String,
        default: '0',
      },
    },
  ],
  grand_total: {
    type: String,
    default: '0',
  },
  total_paid: {
    type: String,
    default: '0',
  },
  total_due: {
    type: String,
    default: '0',
  },
});

exports.Manage_Invoice = mongoose.model("Manage_Invoice", manage_invoiceSchema);

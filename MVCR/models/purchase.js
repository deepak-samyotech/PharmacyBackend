const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema({

    p_id: {
        type: String,
        default: null,
    },
    sid: {
        type: String,
        default: null,
    },
    invoice_no: {
        type: String,
        default: null,
    },
    supplier_name: {
        type: String,
        default: null,
    },
    pur_date: {
        type: String,
        default: null,
    },
    pur_details: {
        type: String,
        default: null,
    },
    total_discount: {
        type: String,
        default: null,
    },
    gtotal_amount: {
        type: String,
        default: null,
    },
    entry_date: {
        type: String,
        default: null,
    },
    entry_id: {
        type: String,
        default: null,
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }
}, {timestamps:true});

exports.Purchase = mongoose.model("Purchase", purchaseSchema);

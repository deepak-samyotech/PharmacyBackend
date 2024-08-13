const mongoose = require("mongoose");
const { Schema } = mongoose;

const supplier_ledgerSchema = new Schema({

    supplier_id: {
        type: String,
        default: null,
    },
    supplier_name: {
        type: String,
        default: null,
    },
    total_amount: {
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

exports.Supplier_ledger = mongoose.model("Supplier_ledger", supplier_ledgerSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const customer_ledgerSchema = new Schema({
    customer_id: {
        type: String,
        default: null,
    },
    customer_name: {
        type: String,
        default: null,
    },
    total_balance: {
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

exports.Customer_ledger = mongoose.model('Customer_ledger', customer_ledgerSchema);

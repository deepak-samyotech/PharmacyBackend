const mongoose = require("mongoose");
const { Schema } = mongoose;

const supp_paymentSchema = new Schema({

    supp_id: {
        type: String,
        default: null,
    },
    pur_id: {
        type: String,
        default: null,
    },
    type: {
        type:String,
        enum: ["Cash", "Cheque", "Credit"],
        default:"Cash"
    },
    bank_id: {
        type: String,
        default: null,
    },
    cheque_no: {
        type: String,
        default: null,
    },
    issue_date: {
        type: String,
        default: null,
    },
    receiver_name: {
        type: String,
        default: null,
    },
    receiver_contact: {
        type: String,
        default: null,
    },
    paid_amount: {
        type: String,
        default: null,
    },
    date: {
        type: String,
        default: null,
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});

exports.Supp_payment = mongoose.model("Supp_payment",supp_paymentSchema);

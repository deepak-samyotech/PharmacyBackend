const mongoose = require("mongoose");
const { Schema } = mongoose;
const coreSchema = require('./core/coreSchema.js');

const supplierSchema = new Schema({

    s_id: {
        type: String,
        default: null,
    },
    s_name: {
        type: String,
        default: null,
    },
    s_email: {
        type: String,
        default: null,
    },
    s_note: {
        type: String,
        default: null,
    },
    s_phone: {
        type: String,
        default: null,
    },
    s_address: {
        type: String,
        default: null,
    },
    entrydate: {
        type: String,
        default: null,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive",
    },
    s_details: coreSchema,
    company_id: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    employee_id:{
        type: Schema.Types.ObjectId,
        ref: "CreateEmployee",
        default: null,
      }
}, {timestamps:true});

exports.Supplier = mongoose.model("Supplier", supplierSchema);

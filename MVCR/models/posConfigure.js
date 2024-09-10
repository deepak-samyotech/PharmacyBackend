
const mongoose = require("mongoose");
const { Schema } = mongoose;

const posConfigureSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
    },
    value: {
        type: String,
        default: null,
    },
    active: {
        type: Boolean,
        default: true
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })

exports.PosConfigureData = mongoose.model("PosConfigureData", posConfigureSchema);
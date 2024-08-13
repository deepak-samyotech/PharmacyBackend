
const mongoose = require("mongoose");

const posConfigureSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required:true
    },
    value: {
        type: String,
        default: null
    }
}, {timestamps:true})

exports.PosConfigureData = mongoose.model("PosConfigureData", posConfigureSchema);
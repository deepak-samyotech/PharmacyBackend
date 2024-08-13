const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClosingSchema = new Schema({
    date: {type:String},
    opening_balance:  {type:String},
    cash_in:  {type:String},
    cash_out:  {type:String},
    cash_in_hand:  {type:String},
    closing_balance:  {type:String},
    adjustment:  {type:String},
    entry_id:  {type:String},
});

exports.Closing = mongoose.model("Closing", ClosingSchema);

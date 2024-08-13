const { boolean } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const coreSchema = new Schema({
    created_by: {
        type: String,
        // required: true
        default: null
    },
    updated_by: {
        type: String,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    },
    deleted_by: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default:true
    }
});

module.export = coreSchema;
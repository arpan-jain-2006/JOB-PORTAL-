const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    FullName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Phone: {
        type: String,
        required: true
    },
    Resume: {
        type: String, 
        required: true
    },
    CoverLetter: {
        type: String,
        default: ""
    },
});

const Apply = mongoose.model("Applications", applicationSchema);
module.exports = Apply;
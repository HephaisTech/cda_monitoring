
const mongoose = require("mongoose");
const Validator = require("mongoose-unique-validator");

const StatSchema = new mongoose.Schema({
    Kname: { type: String, required: true, unique: true },
    Kvalue: { type: String, required: true },
},
    { timestamps: true }
);
StatSchema.plugin(Validator);

module.exports = mongoose.model('Stat', StatSchema);
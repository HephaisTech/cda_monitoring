
const mongoose = require("mongoose");
const Validator = require("mongoose-unique-validator");


const TaegetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    initstate: { type: String, required: true },
    currentState: { type: String },
    lastscreenShot: { type: String },
    isSafe: { type: Boolean, default: true }
},
    { timestamps: true }

);
TaegetSchema.plugin(Validator);

module.exports = mongoose.model('Target', TaegetSchema)

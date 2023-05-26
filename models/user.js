
const mongoose = require("mongoose");
const Validator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "guest", },
    isAdmin: { type: Boolean, default: false, },
    activated: { type: Boolean, default: false, },
},
    { timestamps: true }
);
UserSchema.plugin(Validator);

module.exports = mongoose.model('User', UserSchema);
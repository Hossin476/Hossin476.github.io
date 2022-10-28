const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "please insert a unsername"]
    },
    Email: {
        type: String,
        required: [true, "please insert an email"],
        unique: true,
    },
    Password: {
        type: String,
        required: [true, "please insert a password"],
    },
    passConfirm: {
        type: String,
        required: [true, "please confirm your password"]
    },
}, {
    timestamps: true
});
module.exports = mongoose.model("user", userSchema);
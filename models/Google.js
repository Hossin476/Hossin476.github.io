const mongoose = require('mongoose');
const schema = mongoose.schema;
const gogleSchema = new schema({
    googleId: String,
    name: String,
    email: String,
    password: String,
    timestams: true
});
module.exports = mongoose.model('google', gogleSchema);
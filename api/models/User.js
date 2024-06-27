const mongoose = require('mongoose');
const {Schema} = mongoose;

// Required template for creating new users
const UserSchema = new Schema({
    name: String,
    email: {type:String, unique:true},
    password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
})

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username })
    // compare password and hashed password in the database
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false
};
userSchema.pre('save', async function (next) {
    //if password has not been modified execute next()
    if (!this.isModified('password')) return next();
    //if password is modified hash password
    this.password = await bcrypt.hash(this.password, 12);
    next()
})
const User = mongoose.model('User', userSchema);
module.exports = User
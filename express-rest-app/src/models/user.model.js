let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let schema = mongoose.Schema;

var userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync()) 
}

userSchema.methods.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = mongoose.model('users', userSchema, 'users');
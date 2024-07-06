const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
    },
    code:{
        type: Number,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,

    },
    role:{
        type: String,
        enum: ['customer', 'owner']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, "internetProject")

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
userSchema.statics.findUser = async function (code, password) {
    const user = await User.findOne({code})
    

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch){
        throw new Error('Wrong password')
    }
    console.log(user)
    return user

}


userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
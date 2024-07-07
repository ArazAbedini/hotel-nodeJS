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
    reservations: [{
        start: {
            type: String,
        },
        end: {
            type: String,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    }],
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
userSchema.methods.reserve = async function (start, end, roomId) {
    const user = this
    const reserve = {start, end, roomId}
    user.reservations = user.reservations.concat({reserve})
    await user.save()
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
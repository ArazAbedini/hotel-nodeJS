const mongoose = require('mongoose')


const roomSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    }, 
    type: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    
})


const Room = mongoose.model('Room', roomSchema);

module.exports = Room
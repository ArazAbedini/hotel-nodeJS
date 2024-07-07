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


roomSchema.statics.findAndFilter = async function (type, lowerBound, upperBound) {
    const rooms = Room.find({
        type: type,
        price: { $gte: lowerBound, $lte: upperBound }
      });
    

    if (!rooms) {
        throw new Error('Unable to login')
    }

    return rooms

}





const Room = mongoose.model('Room', roomSchema);

module.exports = Room
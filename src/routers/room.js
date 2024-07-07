const express = require('express');
const Room = require('../models/room')
const {auth, authOwner} = require('../middleware/auth');
const User = require('../models/user');
const router = new express.Router();




router.patch('/rooms/:id', authOwner, async(req, res) => {
    const keys = Object.keys(req.body)
    const allowedUpdates = ['number', 'type', 'price', 'status']
    const isAllowed = keys.every((key) => allowedUpdates.includes(key))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const room = await Room.findOne({ _id: req.params.id, owner: req.user._id})

        if (!room) {
            return res.status(404).send()
        }

        keys.forEach((update) => room[update] = req.body[update])
        await room.save()
        res.send(room)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/rooms', authOwner, async(req, res) => {
    const room = new Room(req.body);
    try {
        await room.save();
        res.status(201).send({room});
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/rooms', async(req, res) => {
    const rooms = await Room.find({status: false}).exec()
    if (!rooms) {
        res.status(404).send({error: 'not available!'})
    }
    res.status(201).send({rooms})
})

router.post('/rooms/filter', async(req, res) => {
    const{type, lowerBound, upperBound, availableDate} = req.body;
    const filteredRooms = await Room.findAndFilter(type, lowerBound, upperBound)
    const reservations = await User.find({}, 'reservations');
    // console.log(reservations)
    var arr = new Set();
    const reservedId = reservations.forEach(reserve => {
        if(reserve.reservations.length !== 0){
            
        
        for (let i = 0;i < reserve.reservations.length;i++) {
            if (reserve.reservations[i].room) {
                const beforeStart = availableDate.localeCompare(reserve.reservations[i].start)
                const afterStart = availableDate.localeCompare(reserve.reservations[i].end)
                if (beforeStart === 1 || afterStart === -1){
                arr.add(reserve.reservations[i].room.toString())
                }
            }
        }
    }
    })
    const myArr = Array.from(arr);
    console.log(myArr);
    const resultSecondList = filteredRooms.filter(room => {
        return !myArr.includes(room._id.toString());
      });
    if (!resultSecondList) {
        return res.status(404).send()
    } else {
        res.status(201).send({resultSecondList})
    }
})

router.post('/rooms/:id', auth, async(req, res) => {
    const user = req.user
    const roomId = req.params.id
    const {start, end} = req.body
    const reservation = {
        start,
        end,
        room: roomId 
    };
    user.reservations.push(reservation);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: 'Error saving reservation', error });
    }
})



router.delete('/rooms/:id', authOwner, async(req, res) => {
    try {
        const room = await Room.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if (!room) {
            return res.status(404).send()
        }

        res.send(task)

    }catch (e) {
        res.status(500).send()
    }

})


module.exports = router

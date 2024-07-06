const express = require('express');
const Room = require('../models/room')
const {auth, authOwner} = require('../middleware/auth')
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

const express = require("express");
const User = require("../models/user");
const {auth, authOwner} = require('../middleware/auth')
const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    console.log("araz!");
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/users/:id', authOwner, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['role', 'start', 'end', 'room']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
      const user = await User.findOne({ _id: req.params.id})
      if (!user) {
          return res.status(404).send()
      }

      updates.forEach((update) => user[update] = req.body[update])
      await user.save()
      res.send(task)
  } catch (e) {
      res.status(400).send(e)
  }
})
router.get('/users', authOwner, async(req, res) => {
  const users = await User.find({});
  res.send(users)
})
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findUser(req.body.code, req.body.password);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports = router;

const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const roomRouter = require('./routers/room')
// const User = require('./models/user');
const app = express()


const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(roomRouter)




app.listen(port, () => {
    console.log('server is UP!')
})
const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        const decode = jwt.verify(token, "internetProject");
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
        req.user = user;
        req.token = token;
        next();
    } catch(e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
    
}
const authOwner = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        const decode = jwt.verify(token, "internetProject");
        
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        if (user.role === 'owner') {
            req.user = user
            req.token = token
            next()
        } else {
            res.status(403).send({error: 'acess denied'})
        }
    } catch(e) {
        res.status(401).send({error: 'please authenticate.'})
    }
}

module.exports = {auth, authOwner}
const jwt = require('jsonwebtoken');
const User1=require('../model/User')

const auth = async (req, res, next) =>
{
   try {
       const token = req.header('Authorization').replace('Bearer ', '');
       console.log(token)
       const decode = jwt.verify(token, "abcd");
       console.log(token)
    const user =await User1.findOne({ _id: decode._id, 'tokens.token': token })
    if (!user)
    {
        throw new Error()
    }
       req.user = user;
       req.token = token;
    
    next();
   
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' }) 
       console.log(error)
    }

}


module.exports = auth;
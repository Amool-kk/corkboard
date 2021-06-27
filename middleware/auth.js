const jwt = require('jsonwebtoken');
const User = require('../models/userschema');

const auth = async (req,res,next)=>{
    try {
        
        console.log("auth function start")
        const token = req.cookies.jwt;

        const varifyUser = jwt.verify(token,process.env.KEY)


        const user = await User.findOne({_id:varifyUser._id, "tokens.tokenid":token});

        if (!user) {
            return new Error('User Not Found')
        }

        req.tokenid = token;
        req.user = user;   
        req.userID = user._id

        next() 
    } catch (e) {
        res.status(401).redirect("login");
        console.log(`error in auth.js is ${e}`)
    }
}

module.exports = auth
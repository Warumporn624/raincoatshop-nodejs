const jwt = require("jsonwebtoken");
const User = require('../models/User.model')

exports.auth = (req, res, next) => {
    try{
        const token = req.headers["authtoken"]
        
        if(!token){
            return res.status(401).send("No token, authorization denied")
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // console.log("middlware", decoded);
        req.user = decoded.user
        next()

    }catch(error){
        console.log(error)
        res.status(401).send('No token, authorization denied')
    }
}

exports.adminCheck = async (req, res, next) => {
    try{
        const {email} = req.user
        const adminUser = await User.findOne({ email }).exec()
        if(adminUser.role !== 'admin'){
            res.status(403).send(error, 'Admin access denied')
        }else{
            next()
        }
    }catch(error){
        console.log(error)
        res.status(401).send('Admin access denied')
    }
}



















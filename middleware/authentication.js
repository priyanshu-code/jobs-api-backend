require('dotenv').config()
const User = require("../models/User")
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')
const authMiddleware = async(req,res,next)=>{
    const atuhHeader = req.headers.authorization
    if (!atuhHeader || !atuhHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Authentication Invalid" )
    }
    const token = atuhHeader.split(' ')[1]
    try {
        const payload  = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {userId:payload.userId,name:payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid ")
    }
}
module.exports = authMiddleware
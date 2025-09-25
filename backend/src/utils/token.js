const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "secretkey";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId)=>{
    return jwt.sign({userId}, SECRET, {expiresIn: EXPIRES_IN});
}

const verifyToken = (token)=>{
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        return null;
    }
}
module.exports = {generateToken, verifyToken};
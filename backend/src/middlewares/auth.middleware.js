const {verifyToken} = require("../utils");

const auth = async(req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({success: false, message: "Token is required"});
    }

    try{
        const decoded = await verifyToken(token);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch(error){
        return res.status(401).json({success: false, message: "Invalid token"});
    }
};

module.exports = {auth};

const {hashPassword, comparePassword} = require("./password");
const {generateToken, verifyToken} = require("./token");

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};
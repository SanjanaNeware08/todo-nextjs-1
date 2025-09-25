const bcrypt = require("bcryptjs");

const SALT = Number(process.env.BCRYPT_SALT) || 10;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
}

//comparing the normal password with hashed password
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};
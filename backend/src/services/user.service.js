const {UserDao} = require("../daos");
const {hashPassword, generateToken, comparePassword} = require("../utils");

class UserService{
    static async register(userData){
        const {username, email, password, profilePicture} = userData;

        //checking user exist or not
        const existUser = await UserDao.getByEmail(email);
        if(existUser){
            throw new Error("User already exists");
        }

        const hashedpassword = await hashPassword(password);
        const user = await UserDao.create({ username, email, hashedpassword, profilePicture });
        const token = generateToken(user.id);
        return {
            user:{ userId: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture },
            token
        };
    }

    static async login(loginData){
        const {email, password} = loginData;
        const user = await UserDao.getByEmail(email);
        if(!user){
            throw new Error("User does not exist");
        }
        const isPasswordValid = await comparePassword(password, user.hashedpassword);
        if(!isPasswordValid){
            throw new Error("Invalid email or password");
        }
        const token = generateToken(user.id);
        return {
            user:{ userId: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture },
            token
        };
    }

    static async getAll(){
        return UserDao.getAll();
    }

    static async getById(id){
        const user = await UserDao.getById(id);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    static async updateById(id, update){
        if(update.password){
            update.hashedpassword = await hashPassword(update.password);
            delete update.password;
        }
        const user = await UserDao.updateById(id, update);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }

    static async deleteById(id){
        const user = await UserDao.deleteById(id);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
}

module.exports = UserService;
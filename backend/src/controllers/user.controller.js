const {UserService} = require("../services");

const register = async(req, res) => {
    const {username, email, password, profilePicture} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({success:false, message: "username, email, and password are required"});
    }
    try {
        const user = await UserService.register({username, email, password, profilePicture});
        res.status(201).json({success: true, data: user});
    } catch (error) {
        if(error.message === "User already exists"){
            return res.status(400).json({ success:false, message:error.message });
        }
        res.status(500).json({success: false, message: error.message});
    }
};

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Email and password are required"});
    }
    try{
        const result = await UserService.login({email, password});
        res.json({success: true, data: result});
    } catch (error) {
        if(error.message === "Invalid email or password"){
            res.status(401).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: error.message});
        }
    }
}

const getAll = async (req, res) => {
    try{
        const users = await UserService.getAll();
        res.json({ success: true, data: users });
    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try{
        const user = await UserService.getById(req.params.id);
        res.json({ success: true, data: user });
    }catch(error){
        if(error.message === "User not found"){
            return res.status(404).json({ success:false, message: error.message});
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateById = async (req, res) => {
    try{
        const user = await UserService.updateById(req.params.id, req.body);
        res.json({ success: true, data: user });
    }catch(error){
        if(error.message === "User not found"){
            return res.status(404).json({ success:false, message: error.message});
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteById = async (req, res) => {
    try{
        const user = await UserService.deleteById(req.params.id);
        res.json({ success: true, data: user });
    }catch(error){
        if(error.message === "User not found"){
            return res.status(404).json({ success:false, message: error.message});
        }
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    register,
    login,
    getAll,
    getById,
    updateById,
    deleteById
}
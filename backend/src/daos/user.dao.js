const {User} = require("../models");

class UserDao {
  static async create(userData) {
    const user = await User.create(userData);
    return user;
  }

  static async getAll() {
    return User.find({});
  }

  static async getById(id) {
    return User.findById(id);
  }

  static async getByEmail(email) {
    return User.findOne({ email });
  }

  static async updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true });
  }

  static async deleteById(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = UserDao;

const {Task} = require("../models");

class TaskDao {
    //create a new task
    static async createTask(taskData) {
        const task = await Task.create(taskData);
        if (task && task.isDeleted !== undefined) {
            task.isDeleted = undefined;
        }
        return task;
    }

    //get all tasks for a user by id and filters
    static async getAllTasks(userId, { status, page = 1, limit = 10, search, dueFrom, dueTo } = {}) {
        const filter = { userId, isDeleted: false };
        if (status) filter.status = status;
        if (search) filter.title = { $regex: search, $options: "i" };
        if (dueFrom || dueTo) {
            filter.dueDate = {};
            if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
            if (dueTo) filter.dueDate.$lte = new Date(dueTo);
        }

        const skip = (page - 1) * limit;
        return Task.find(filter)
            .sort({ dueDate: 1, createdAt: -1 })
            .limit(limit)
            .skip(skip);
    }

    // Count tasks for a user filters(optional)
    static async countTasks(userId, { status, search, dueFrom, dueTo } = {}) {
        const filter = { userId, isDeleted: false };
        if (status) filter.status = status;
        if (search) filter.title = { $regex: search, $options: "i" };
        if (dueFrom || dueTo) {
            filter.dueDate = {};
            if (dueFrom) filter.dueDate.$gte = new Date(dueFrom);
            if (dueTo) filter.dueDate.$lte = new Date(dueTo);
        }
        return Task.countDocuments(filter);
    }

    // Get a single task by id and userId
    static async getTaskById(id, userId) {
        return Task.findOne({ _id: id, userId, isDeleted: false });
    }

    // Update a task by id and userId
    static async updateTask(id, userId, taskData) {
        const task = await Task.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            taskData,
            { new: true }
        );
        return task;
    }

    // Soft delete a task by id and userId
    static async deleteTask(id, userId) {
        return Task.findOneAndUpdate(
            { _id: id, userId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
    }
}

module.exports = TaskDao;


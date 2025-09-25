const {TaskDao} = require("../daos");

class TaskService{
    //new task for user
    static async createTask(userId, {title, description, status, dueDate }) {
        try {
            const task = await TaskDao.createTask({
                userId,
                title,
                description : description || "",
                status :  "todo",
                ...(dueDate ? { dueDate: new Date(dueDate) } : {})
            });
            return task;
        }catch(error){
            console.log("Error creating task:", error);
            throw error;
        }
    }

    //get all tasks for a user withh id and pagination and filters
    static async getTasks(userId, options = {}) {
        console.log("Fetching tasks for userId:", userId, "with options:", options);
        const {status, page = 1, limit = 10, search, dueFrom, dueTo} = options;
        const tasks = await TaskDao.getAllTasks(userId, {status, page, limit, search, dueFrom, dueTo});

        const totalTasks = await TaskDao.countTasks(userId, {status, search, dueFrom, dueTo});
        //calculate total number of the pages to move next or previous
        const totalPages = Math.ceil(totalTasks / limit);
        return {
            tasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        };
    }
    //get a single task by user id and it task id
    static async getTaskById(id, userId) {
        try {
            const task = await TaskDao.getTaskById(id, userId);
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        } catch (error) {
            throw error;
        }
    }

    //update a task by user id and its task id
    static async updateTask(id, userId, TaskData) {
        try {
            const update = { ...TaskData };
            if (TaskData?.dueDate) {
                update.dueDate = new Date(TaskData.dueDate);
            }
            const task = await TaskDao.updateTask(id, userId, update);
            if (!task) {
                throw new Error("Task not found");
            }
            return task;
        } catch (error) {
            throw error;
        }
    }

    //delete a task by user id and its task id
    static async deleteTask(id, userId) {
        try {
            await TaskDao.deleteTask(id, userId);
        } catch (error) {
            console.log("Error deleting task:", error);
            throw error;
        }
    }
}

module.exports = TaskService;

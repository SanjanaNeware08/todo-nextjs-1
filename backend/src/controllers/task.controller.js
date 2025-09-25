const { TaskService } = require("../services");

//create task
const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const userId = req.user.userId;

  try {
    const task = await TaskService.createTask(userId,{ 
      title,
      description,
      dueDate
    });
    return res
      .status(201)
      .json({ success: true, message: "Task Created Successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create task" });
  }
};

//get all tasks for the user
const getTasks = async(req, res) => {
    try{
        const userId =  req.user.userId;
        const {status, page = 1, limit = 10, search, dueFrom, dueTo} = req.query;

        console.log("Received query params:", req.query);
        console.log("userId:", userId);

        const result = await TaskService.getTasks(userId, {status, page, limit, search, dueFrom, dueTo});

        res.json({
            success:true,
            message:"tasks retrieved successfully", 
            tasks:result.tasks,
            pagination:result.pagination
        });
    } catch(error){
        res.status(500).json({
            success:false,
            message:"error retreiving taks"
        });
    }
};

//get single task for a user
const getTaskById = async(req, res)=>{
    try{
        const {id} = req.params;
        const userId = req.user.userId;
        // get task from the task service
        const task = await TaskService.getTaskById(id, userId);

        res.json({
            success:true,
            message:"Task Retrieved Successfully",
            task,
        });
    } catch(error){
        if(error.message === "Task not found"){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        res.status(500).json({
            success:false,
            message:"Error retrieving task",
        })
    }
};

const updateTask= async(req,res)=>{
    try{
        const{id} = req.params;
        const userId = req.user.userId;
        const {title, description, status, dueDate} = req.body;

        const task = await TaskService.updateTask(id, userId, {title, description, status, dueDate});

        res.json({
            success:true,
            message:"updated task successfully",
            task,
        });
    } catch(error){
        if(error.message === "Task not found"){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        res.status(500).json({
            success:false,
            message:"Error updating task",
        })
    }
};

//delete task by id (soft delete);
const deleteTask = async(req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user.userId;
        const task = await TaskService.getTaskById(id, userId);
        await TaskService.deleteTask(id, userId);

        res.json({
            success:true,
            message:"Task deleted successfully",
        });
    } catch(error){
        if(error.message === "Task not found"){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        res.status(500).json({
            success:false,
            message:"Error deleting task",
        })
    }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

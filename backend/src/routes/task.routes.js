const express = require("express");
const {auth} = require("../middlewares");
const {TaskController} = require("../controllers");

const router = express.Router();

//protects all routes below requires token for authentication
router.use(auth);

module.exports = router;

//routes for tasks
router.post("/", TaskController.createTask);
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
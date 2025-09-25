const express = require("express");
const controllers = require("../controllers");
const { register, login, getAll, getById, updateById, deleteById } = controllers.UserController;

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Users CRUD (no pagination)
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;
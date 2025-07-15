import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  restoreTodo,
  softDeleteTodo,
  getDeleteTodos,
  updateTodo,
} from "../controllers/todoController";

const router = express.Router();

router.get("/", getTodos);
router.post("/new", addTodo);
router.patch("/:id/delete", softDeleteTodo);
router.patch("/:id/restore", restoreTodo);
router.delete("/:id", deleteTodo);
router.get("/deleted", getDeleteTodos);
router.put("/:id", updateTodo);

export default router;

import express from "express";
import {
  getTodos,
  addTodo,
  deleteTodo,
  restoreTodo,
  softDeleteTodo,
  getDeleteTodos,
} from "../controllers/todoController";

const router = express.Router();

router.get("/", getTodos);
router.post("/new", addTodo);
router.patch("/todo/:id/delete", softDeleteTodo);
router.patch("/todo/:id/restore", restoreTodo);
router.delete("/todo/:id", deleteTodo);
router.get("/deleted", getDeleteTodos);

export default router;

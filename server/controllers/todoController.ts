import { Request, Response } from "express";
import { pool } from "../db";

export const getTodos = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM todo");
    res.status(200).json({ todos: rows });
  } catch (err) {
    console.error("データベースエラー:", err);
    res.status(500).json({ message: "データベースエラーが発生しました" });
  }
};

export const addTodo = async (req: Request, res: Response) => {
  const { todo, deadline } = req.body;
  if (!todo) {
    res.status(400).send("Todoが空です");
    return;
  }
  console.log(deadline);
  await pool.execute("INSERT INTO todo (todo,deadline) VALUES (?,?)", [
    todo,
    deadline || null,
  ]);
  res.status(201).send("追加成功");
};

export const softDeleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.execute("UPDATE todo SET deleted = true WHERE id = ?", [
      Number(id),
    ]);
    res.status(200).send("削除成功");
  } catch (err) {
    res.status(500).send("DBエラー");
  }
};

export const restoreTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.execute("UPDATE todo SET deleted = false WHERE id = ?", [
      Number(id),
    ]);
    res.status(200).send("復元成功");
  } catch (err) {
    res.status(500).send("DBエラー");
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.execute("DELETE FROM todo WHERE id = ?", [Number(id)]);
  res.status(200).send("物理削除成功");
};

export const getDeleteTodos = async (_: Request, res: Response) => {
  const [rows] = await pool.execute("SELECT * FROM todo WHERE deleted = true");
  res.status(200).json({ deletedTodos: rows });
};

export const updateTodo = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { todo, deadline } = req.body;
  try {
    await pool.execute("UPDATE todo SET todo = ?, deadline = ? WHERE id = ?", [
      todo,
      deadline || null,
      id,
    ]);
    res.status(200).send("更新成功");
  } catch (err) {
    console.error(err);
    res.status(500).send("更新失敗");
  }
};

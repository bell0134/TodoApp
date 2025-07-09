import { Request, Response } from "express";
import { pool } from "../db";

export const getTodos = async (_: Request, res: Response) => {
  //ここなに？
  const [rows] = await pool.execute("SELECT * FROM todo WHERE deleted = false");
  res.status(200).json({ todos: rows });
};

export const addTodo = async (req: Request, res: Response) => {
  const { todo } = req.body;
  if (!todo) {
    res.status(400).send("Todoが空です");
    return;
  }
  await pool.execute("INSERT INTO todo (todo) VALUES (?)", [todo]);
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

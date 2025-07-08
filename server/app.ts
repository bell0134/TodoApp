import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, Express } from "express";
import path from "path";
import mysql from "mysql2/promise";
import { ResultSetHeader } from "mysql2";
const app: Express = express();
import cors from "cors";

app.use(cors()); //このミドルウェア必須

// MySQL接続設定
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Todo一覧を取得
app.get("/", async (req, res) => {
  try {
    // console.log("getリクエストを受け付けました");
    const [rows] = await pool.execute(
      "SELECT * FROM todo WHERE deleted = false"
    );
    res.status(200).json({ todos: rows });
  } catch (err) {
    console.error("データベースエラー:", err);
    res.status(500).json({ message: "データベースエラーが発生しました" });
  }
});

// 新規Todo追加
app.post("/new", async (req: any, res: any) => {
  console.log("受け取ったデータ：", req.body);
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).send("Todoが空です");
  }
  await pool.execute("INSERT INTO todo (todo) VALUES (?)", [todo]);
  res.status(201).send("追加成功");
});

//削除用
// app.delete("/todo/:id", async (req: any, res: any) => {
//   const { id } = req.params;
//   try {
//     console.log("削除したデータ：", req.body);
//     const [result] = await pool.execute("DELETE FROM todo WHERE id =?", [id]);
//     res.status(200).send("削除成功");
//   } catch (err) {
//     console.log("削除エラー：", err);
//     res.status(500).send("DBエラー");
//   }
// });

// 削除時：物理削除じゃなく論理削除に変える
app.patch("/todo/:id/delete", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("UPDATE todo SET deleted = true WHERE id = ?", [
      Number(id),
    ]);
    res.status(200).send("削除成功");
  } catch (err) {
    res.status(500).send("DBエラー");
  }
});
app.patch("/todo/:id/delete", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE todo SET deleted = true WHERE id = ?",
      [Number(id)]
    );
    console.log("affectedRows:", result.affectedRows);
    if (result.affectedRows === 0) {
      return res.status(404).send("対象が見つかりません");
    }
    res.status(200).send("削除成功");
  } catch (err) {
    console.error("削除エラー:", err);
    res.status(500).send("DBエラー");
  }
});

//削除済み一覧の取得
app.get("/deleted", async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM todo WHERE deleted = true");
  res.status(200).json({ deletedTodos: rows });
});

//復元処理
app.patch("/todo/:id/restore", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("復元したリスト：", req.body);
    await pool.execute("UPDATE todo SET deleted = false WHERE id = ?", [
      Number(id),
    ]);
    res.status(200).send("復元成功");
  } catch (err) {
    res.status(500).send("DBエラー");
  }
});

app.listen(3000, () => {
  console.log("ポート3000で接続中");
});

import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";

const app = express();
app.use(cors()); //このミドルウェア必須
// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/todo", todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ポート${PORT}で接続中`);
});

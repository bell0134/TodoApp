"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const app = (0, express_1.default)();
// MySQL接続設定
const pool = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "todos",
});
// ビューエンジンの設定
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// ミドルウェアの設定
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ルートパスへのアクセスを/homeにリダイレクト
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("getリクエストを受け付けました");
        const [rows] = yield pool.execute("SELECT * FROM todo");
        res.render("home", { todos: rows });
    }
    catch (err) {
        console.error("データベースエラー:", err);
        res.status(500).json({ message: "データベースエラーが発生しました" });
    }
}));
app.get("/new", (req, res) => {
    res.render("new");
});
app.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).send("Todo内容が空です");
    }
    try {
        yield pool.execute("INSERT INTO todo (todo) VALUES (?)", [todo]);
        res.redirect("/");
    }
    catch (err) {
        console.error("INSERTエラー:", err);
        res.status(500).send("DBエラー");
    }
}));
app.listen(3000, () => {
    console.log("ポート3000で接続中");
});

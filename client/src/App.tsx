import { useEffect, useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

type Todo = {
  id: number;
  todo: string;
  completed: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [deleteTodos, setDeleteTodos] = useState<Todo[]>([]);

  // Todo一覧を取得
  useEffect(() => {
    fetch("http://localhost:3000/") // ← Expressサーバーのエンドポイント
      .then((res) => res.json())
      .then((data) => setTodos(data.todos));
  }, []);

  // 新規Todoを追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.trim()) return;

    await fetch("http://localhost:3000/new", {
      //serverに接続
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: newTask }),
    });

    setNewTask("");
    // 再取得
    const res = await fetch("http://localhost:3000/");
    const data = await res.json();
    setTodos(data.todos);
  };
  // 削除処理
  const handleDelete = async (id: number) => {
    const target = todos.find((todo) => todo.id === id); // 削除対象を先に取得

    // 削除API呼び出し
    await fetch(`http://localhost:3000/todo/${id}`, {
      // method: "DELETE",//削除じゃなく論理削除に変更
      method: "PATCH",
    });

    // 再取得して更新
    const res = await fetch("http://localhost:3000/");
    const data = await res.json();
    setTodos(data.todos);

    // 削除済みに追加
    if (target) {
      setDeleteTodos((prev) => [...prev, target]);
    }
  };

  const handleRestore = (id: number) => {
    const target = deleteTodos.find((todo) => todo.id === id);
    if (!target) return;

    //Todoに戻す
    setTodos((prev) => [...prev, target]);

    //削除リストから取り除く
    setDeleteTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Todo アプリ</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="新しいTodoを入力"
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </form>
      {/* <form onSubmit={handleSubmit} className="d-flex gap-2 my-3">
        <input
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="新しいTodoを入力"
        />
        <button className="btn btn-success" type="submit">
          追加
        </button>
      </form> */}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0.5rem 0",
              padding: "0.5rem",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>{todo.todo}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                marginLeft: "1rem",
                padding: "0.25rem 0.5rem",
                backgroundColor: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <h2>削除されたTodo</h2>
      <ul>
        {deleteTodos.map((todo) => (
          <li key={todo.id}>
            {todo.todo}
            <button
              onClick={() => handleRestore(todo.id)}
              style={{ marginLeft: "1rem" }}
            >
              戻す
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

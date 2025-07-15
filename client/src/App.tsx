import { useEffect, useState } from "react";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Todo } from "./types/Todo";
import {
  fetchTodos,
  createTodo,
  softDeleteTodo,
  restoreTodo,
  updateTodoAPI,
} from "./services/api";
import { TodoItem } from "./components/TodoItem";
import { DeleteTodoItem } from "./components/DeleteTodoItem";
import { EditTodoItem } from "./components/EditTodoItem";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [deleteTodos, setDeleteTodos] = useState<Todo[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const loadTodos = async () => {
    // const data = await fetchTodos();
    // const active = data.filter((t) => !t.deleted);
    // const deleted = data.filter((t) => t.deleted);
    // setTodos(active);
    // setDeleteTodos(deleted);

    try {
      const data = await fetchTodos();
      console.log("APIからのデータ:", data); // すべてのTodoを確認
      const active = data.filter((t) => !t.deleted);
      console.log("アクティブなTodo:", active); // 非削除のTodoを確認
      const deleted = data.filter((t) => t.deleted);
      console.log("削除済みTodo:", deleted); // 削除済みのTodoを確認
      setTodos(active);
      setDeleteTodos(deleted);
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };
  // Todo一覧を取得
  useEffect(() => {
    loadTodos(); // ← Expressサーバーのエンドポイント
  }, []);

  // 新規Todoを追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    await createTodo(newTask, dueDate);
    //serverに接続
    setNewTask("");
    loadTodos();
    setDueDate("");
  };
  // 削除処理
  const handleDelete = async (id: number) => {
    await softDeleteTodo(id); // restoreToDoをsoftDeleteTodoに修正
    loadTodos();
  };

  const handleRestore = async (id: number) => {
    await restoreTodo(id);
    loadTodos();
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Todo アプリ</h1>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
        <input
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="新しいTodoを入力"
        />
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button className="btn btn-primary">追加</button>
      </form>

      <h2>Todo一覧</h2>
      {/* <ul className="list-group mb-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={handleDelete} />
        ))}
      </ul> */}
      <ul className="list-group mb-4">
        {todos.map((todo) =>
          editTodoId === todo.id ? (
            <EditTodoItem
              key={todo.id}
              todo={todo}
              onUpdate={async (updated: any) => {
                await updateTodoAPI(updated.id, updated.todo, updated.deadline);
                setEditTodoId(null);
                loadTodos();
              }}
              onCancel={() => setEditTodoId(null)}
            />
          ) : (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onEdit={() => setEditTodoId(todo.id)}
            />
          )
        )}
      </ul>

      <h2>完了済みのTodo</h2>
      <ul className="list-group">
        {deleteTodos.map((todo) => (
          <DeleteTodoItem key={todo.id} todo={todo} onRestore={handleRestore} />
        ))}
      </ul>
    </div>
  );
}
export default App;

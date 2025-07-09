import { Todo } from "../types/Todo";

const API_URL = "http://localhost:3000";

export const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${API_URL}/`);
  const data = await res.json();
  return data.todos;
};

export const createTodo = async (todo: string) => {
  await fetch(`${API_URL}/new`, {
    //serverに接続
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo }),
  });
};

export const softDeleteTodo = async (id: number) => {
  await fetch(`${API_URL}/todo/${id}`, {
    method: "PATCH",
  });
};

export const restoreTodo = async (id: number) => {
  await fetch(`${API_URL}/todo/${id}/restore`, {
    method: "PATCH",
  });
};

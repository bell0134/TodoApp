import { Todo } from "../types/Todo";

const API_URL = "http://localhost:3000/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("APIレスポンス:", data);
    return data.todos || [];
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const createTodo = async (todo: string, deadline: string) => {
  await fetch(`${API_URL}/new`, {
    //serverに接続
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo, deadline }),
  });
};

export const softDeleteTodo = async (id: number) => {
  await fetch(`${API_URL}/${id}/delete`, {
    method: "PATCH",
  });
};

export const restoreTodo = async (id: number) => {
  await fetch(`${API_URL}/${id}/restore`, {
    method: "PATCH",
  });
};

export const updateTodoAPI = async (
  id: number,
  todo: string,
  deadline: string
) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todo, deadline }),
  });
};

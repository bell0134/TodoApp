import { useState } from "react";
import { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  onUpdate: (updated: Todo) => void;
  onCancel: () => void;
};

export const EditTodoItem = ({ todo, onUpdate, onCancel }: Props) => {
  const [newTask, setNewTask] = useState(todo.todo);
  const [dueDate, setDueDate] = useState(todo.deadline || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...todo, todo: newTask, deadline: dueDate });
  };

  return (
    <li className="d-flex align-items-center justify-content-between border-bottom py-2">
      <form onSubmit={handleSubmit} className="d-flex gap-2 flex-grow-1">
        <input
          className="form-control"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="編集内容"
        />
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          保存
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </form>
    </li>
  );
};

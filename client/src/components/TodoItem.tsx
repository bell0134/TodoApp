import { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
};

export const TodoItem = ({ todo, onDelete }: Props) => (
  <li className="d-flex align-items-center justify-content-between border-bottom py-2">
    <span>{todo.todo}</span>
    <button className="btn btn-danger btn-sm" onClick={() => onDelete(todo.id)}>
      削除
    </button>
  </li>
);

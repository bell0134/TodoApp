import { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  onRestore: (id: number) => void;
};

export const DeleteTodoItem = ({ todo, onRestore }: Props) => (
  <li className="d-flex justify-content-between py-1">
    {todo.todo}
    <button
      className="btn btn-outline-primary btn-sm"
      onClick={() => onRestore(todo.id)}
    >
      戻す
    </button>
  </li>
);

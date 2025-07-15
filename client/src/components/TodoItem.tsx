import { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  onEdit: () => void;
};

export const TodoItem = ({ todo, onDelete, onEdit }: Props) => (
  <li className="d-flex align-items-center justify-content-between border-bottom py-2">
    <div>
      <span>{todo.todo}</span>
      {todo.deadline && (
        <span className="text-muted ms-2">
          {todo.deadline.slice(0, 10)
            ? `期限: ${todo.deadline.slice(0, 10)}`
            : "期限なし"}
        </span>
      )}
    </div>
    <div className="d-flex gap-2">
      <button
        className="btn btn-success btn-sm"
        onClick={() => {
          console.log("編集クリック：", todo.id);
          onEdit();
        }}
      >
        編集
      </button>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          console.log("削除クリック", todo.id);
          onDelete(todo.id);
        }}
      >
        完了
      </button>
    </div>
  </li>
);

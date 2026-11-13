import { useState } from 'react';
import { useAppDispatch } from '@/store/index';
import { deleteTodo, toggleTodo, updateTodo } from '@/store/todoSlice';
import type { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleSave = () => {
    const trimmed = editText.trim();

    if (!trimmed) {
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    if (trimmed === todo.text) {
      setIsEditing(false);
      return;
    }

    dispatch(updateTodo({ id: todo.id, text: trimmed }));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
    >
      <div className="todo-item-content">
        <label className="todo-checkbox-container">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            aria-label={`Mark task "${todo.text}" as ${todo.completed ? 'not completed' : 'completed'}`}
          />
          <span className="todo-checkmark" />
        </label>

        {!isEditing ? (
          <>
            <span className="todo-text">{todo.text}</span>
            <button
              className="todo-edit-btn"
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(true);
              }}
              aria-label="Edit task"
              type="button"
            >
              Edit
            </button>
            <button
              className="todo-delete-btn"
              onClick={handleDelete}
              aria-label="Delete task"
              type="button"
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <input
              className="todo-edit-input"
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
            />
          </>
        )}
      </div>
    </li>
  );
};
import { useAppSelector } from '@/store/index';
import { selectFilteredTodos } from '@/store/todoSlice';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const todos = useAppSelector(selectFilteredTodos);

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks match this filter.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
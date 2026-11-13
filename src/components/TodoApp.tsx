import { useTodos } from '../hooks/useTodos';
import { TodoFilters } from './TodoFilters';
import { TodoHeader } from './TodoHeader';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoStats } from './TodoStats';

export const TodoApp = () => {
  const { stats, handleClearCompleted } = useTodos();

  return (
    <div className="todo-app">
      <TodoHeader />
      <TodoInput />
      <div className="todo-body">
        <TodoList />
        <aside className="todo-sidebar">
          <TodoStats />
          <TodoFilters />
          {stats.completed > 0 && (
            <button
              className="clear-completed-btn"
              onClick={handleClearCompleted}
            >
              Clear completed ({stats.completed})
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};
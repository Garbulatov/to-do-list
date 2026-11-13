import { useAppSelector } from '../store/index';
import { selectFilter } from '../store/todoSlice';
import { useTodos } from '../hooks/useTodos';
import type { TodoFilter } from '../types/todo';

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Open' },
  { value: 'completed', label: 'Done' },
];

export const TodoFilters = () => {
  const filter = useAppSelector(selectFilter);
  const { handleFilterChange } = useTodos();

  return (
    <div className="todo-filters">
      <span className="filters-label">Filter:</span>
      <div className="filters-group" role="radiogroup" aria-label="Task filter">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`filter-btn ${filter === value ? 'active' : ''}`}
            onClick={() => handleFilterChange(value)}
            role="radio"
            aria-checked={filter === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
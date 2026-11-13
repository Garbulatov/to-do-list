import { useAppSelector } from '@/store/index';
import { selectStats } from '@/store/todoSlice';

export const TodoStats = () => {
  const stats = useAppSelector(selectStats);

  return (
    <div className="todo-stats">
      <span className="stats-item">
        <span className="stats-label">Total</span>
        <strong>{stats.total}</strong>
      </span>
      <span className="stats-item">
        <span className="stats-label">Open</span>
        <strong>{stats.active}</strong>
      </span>
      <span className="stats-item">
        <span className="stats-label">Done</span>
        <strong>{stats.completed}</strong>
      </span>
    </div>
  );
};
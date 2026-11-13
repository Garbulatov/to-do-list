export const TodoHeader = () => {
  return (
    <header className="todo-header">
      <div className="header-badges">
        <span className="top-badge">Productivity</span>
        <span className="top-badge muted">Daily focus</span>
      </div>
      <h1 className="todo-title">Daily Focus</h1>
      <p className="todo-subtitle">Plan the day, ship the work, stay in motion.</p>
    </header>
  );
};
import { useTodos } from '@/hooks/useTodos';

export const TodoInput = () => {
  const {
    inputValue,
    localError,
    inputRef,
    handleAdd,
    handleInputChange,
    handleKeyDown,
  } = useTodos();

  return (
    <div className="todo-input-wrapper">
      <form className="todo-form" onSubmit={handleAdd}>
        <input
          ref={inputRef}
          className="todo-input"
          type="text"
          placeholder="Add a task for today..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-label="New task"
          maxLength={200}
        />
        <button
          type="submit"
          className="todo-add-btn"
          disabled={!inputValue.trim()}
          aria-label="Add task"
        >
          Add task
        </button>
      </form>
      {localError && (
        <p className="todo-error" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
};
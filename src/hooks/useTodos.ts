import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@/store/index';
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  fetchTodos,
  selectError,
  selectFilteredTodos,
  selectFilter,
  selectStats,
  selectStatus,
  setFilter,
  toggleTodo,
} from '@/store/todoSlice';
import type { TodoFilter } from '@/types/todo';

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectFilteredTodos);
  const stats = useAppSelector(selectStats);
  const filter = useAppSelector(selectFilter);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  const [inputValue, setInputValue] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const text = inputValue.trim();
      if (!text) {
        setLocalError('Введите текст задачи');
        return;
      }
      setLocalError(null);
      dispatch(addTodo({ text }));
      setInputValue('');
    },
    [dispatch, inputValue]
  );

  const handleToggle = useCallback(
    (id: string) => {
      dispatch(toggleTodo(id));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteTodo(id));
    },
    [dispatch]
  );

  const handleClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (next: TodoFilter) => {
      dispatch(setFilter(next));
    },
    [dispatch]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setLocalError(null);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleAdd(e as unknown as React.FormEvent);
      }
    },
    [handleAdd]
  );

  return {
    todos,
    stats,
    filter,
    status,
    error,
    inputValue,
    localError,
    inputRef,
    handleAdd,
    handleToggle,
    handleDelete,
    handleClearCompleted,
    handleFilterChange,
    handleInputChange,
    handleKeyDown,
    setInputValue,
  };
};
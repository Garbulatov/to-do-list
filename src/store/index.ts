import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import todoReducer, { selectAllTodos, selectFilter } from './todoSlice';

const persistTodos = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  if (
    typeof window !== 'undefined' &&
    typeof action?.type === 'string' &&
    !action.type.startsWith('todos/fetchTodos')
  ) {
    const state = store.getState();
    const items = selectAllTodos(state);
    const filter = selectFilter(state);

    window.localStorage.setItem(
      'todos-v1',
      JSON.stringify({ items, filter })
    );
  }

  return result;
};

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(persistTodos),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Todo, TodoFilter, NewTodoInput, TodoId } from '@/types/todo';

const STORAGE_KEY = 'todos-v1';

const loadPersistedTodos = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      filter: parsed.filter === 'active' || parsed.filter === 'completed' ? parsed.filter : 'all',
    };
  } catch {
    return null;
  }
};

export const todosAdapter = createEntityAdapter<Todo>({
  sortComparer: (a: Todo, b: Todo) => b.createdAt - a.createdAt,
});

export const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      return rejectWithValue('Не удалось загрузить задачи');
    }
  }
);

export const addTodo = createAsyncThunk<
  Todo,
  NewTodoInput,
  { rejectValue: string }
>('todos/addTodo', async (input, { rejectWithValue }) => {
  const text = input.text.trim();
  if (!text) return rejectWithValue('Текст задачи не может быть пустым');
  if (text.length > 200) return rejectWithValue('Задача слишком длинная (макс. 200 символов)');

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const now = Date.now();
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    return todo;
  } catch {
    return rejectWithValue('Не удалось создать задачу');
  }
});

export const toggleTodo = createAsyncThunk<
  Todo,
  TodoId,
  { rejectValue: string }
>('todos/toggleTodo', async (id, { rejectWithValue, getState }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const state = getState() as { todos: ReturnType<typeof todosAdapter.getInitialState> };
    const existing = state.todos.entities[id];
    if (!existing) return rejectWithValue('Задача не найдена');

    return {
      ...existing,
      completed: !existing.completed,
      updatedAt: Date.now(),
    };
  } catch {
    return rejectWithValue('Не удалось изменить статус задачи');
  }
});

export const updateTodo = createAsyncThunk<
  Todo,
  { id: TodoId; text: string },
  { rejectValue: string }
>('todos/updateTodo', async ({ id, text }, { rejectWithValue, getState }) => {
  const nextText = text.trim();

  if (!nextText) {
    return rejectWithValue('Текст задачи не может быть пустым');
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const state = getState() as { todos: ReturnType<typeof todosAdapter.getInitialState> };
    const existing = state.todos.entities[id];

    if (!existing) return rejectWithValue('Задача не найдена');

    return {
      ...existing,
      text: nextText,
      updatedAt: Date.now(),
    };
  } catch {
    return rejectWithValue('Не удалось обновить задачу');
  }
});

export const deleteTodo = createAsyncThunk<TodoId, TodoId, { rejectValue: string }>(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return id;
    } catch {
      return rejectWithValue('Не удалось удалить задачу');
    }
  }
);

export const clearCompleted = createAsyncThunk<TodoId[], void, { rejectValue: string }>(
  'todos/clearCompleted',
  async (_, { getState, rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const state = getState() as { todos: ReturnType<typeof todosAdapter.getInitialState> };
      const completedIds = Object.values(state.todos.entities)
        .filter((todo) => todo && todo.completed)
        .map((todo) => todo!.id);
      return completedIds;
    } catch {
      return rejectWithValue('Не удалось очистить выполненные задачи');
    }
  }
);

type TodoStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

const persistedState = loadPersistedTodos();

const initialState = todosAdapter.getInitialState({
  filter: (persistedState?.filter ?? 'all') as TodoFilter,
  status: 'idle' as TodoStatus,
  error: null as string | null,
});

if (persistedState?.items?.length) {
  todosAdapter.setAll(initialState, persistedState.items);
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        todosAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(addTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        todosAdapter.addOne(state, action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(toggleTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        todosAdapter.upsertOne(state, action.payload);
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(updateTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        todosAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        todosAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(clearCompleted.fulfilled, (state, action) => {
        state.status = 'succeeded';
        for (const id of action.payload) {
          todosAdapter.removeOne(state, id);
        }
      })
      .addCase(clearCompleted.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const { setFilter, clearError } = todoSlice.actions;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds,
  selectTotal: selectTodoTotal,
} = todosAdapter.getSelectors((state: { todos: typeof initialState }) => state.todos);

export const selectFilter = (state: { todos: typeof initialState }) => state.todos.filter;
export const selectStatus = (state: { todos: typeof initialState }) => state.todos.status;
export const selectError = (state: { todos: typeof initialState }) => state.todos.error;

export const selectFilteredTodos = (
  state: { todos: typeof initialState }
) => {
  const todos = selectAllTodos(state);
  const filter = selectFilter(state);
  if (filter === 'active') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos;
};

export const selectStats = (
  state: { todos: typeof initialState }
) => {
  const todos = selectAllTodos(state);
  return {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };
};

export default todoSlice.reducer;
export type TodoId = string;

export interface Todo {
  id: TodoId;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

export interface NewTodoInput {
  text: string;
}
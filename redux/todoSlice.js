
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { db, auth } from '../utils/firebase'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'

//  Fetch todos from Firestore 
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const user = auth.currentUser
  if (!user) return []

  const q = query(collection(db, 'todos'), where('userId', '==', user.uid))
  const querySnapshot = await getDocs(q)
  const todos = []
  querySnapshot.forEach((docSnap) => {
    todos.push({ id: docSnap.id, ...docSnap.data() });
  })
  return todos
})

//  Add new todo
export const addTodo = createAsyncThunk('todos/addTodo', async (todo) => {
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const docRef = await addDoc(collection(db, 'todos'), {
    ...todo,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  })

  return { id: docRef.id, ...todo, userId: user.uid }
})

// Update todo 
export const updateTodo = createAsyncThunk('todos/updateTodo', async (todo) => {
  const { id, ...data } = todo; // remove 'id' for Firestore update
  const todoRef = doc(db, 'todos', id);
  await updateDoc(todoRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
  return todo; // return full todo for Redux
})

//  Delete todo 
export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id) => {
  const todoRef = doc(db, 'todos', id)
  await deleteDoc(todoRef)
  return id
})

//  Slice
const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    status: 'idle',   // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Add Todo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload)
      })

      // Update Todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((n) => n.id === action.payload.id)
        if (index !== -1) {
          state.todos[index] = { ...state.todos[index], ...action.payload }
        }
      })

      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((n) => n.id !== action.payload)
      })
  }
})

export default todosSlice.reducer

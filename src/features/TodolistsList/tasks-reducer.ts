import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  TodolistType,
  UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {addTodolist, removeTodolist, setTodolists} from "./todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}
export const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    removeTask(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
    },
    addTask(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTask(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
      state[action.payload.todolistId] = state[action.payload.todolistId]
        .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
    },
    setTasks(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    }
  },
  extraReducers: {
    [addTodolist.type]: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state[action.payload.todolist.id] = []
    },
    [removeTodolist.type]: (state, action: PayloadAction<{ id: string }>) => {
      // debugger
      delete state[action.payload.id]
    },
    [setTodolists.type]: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      action.payload.todolists.forEach((tl: any) => {
        state[tl.id] = []
      })
    }
  }
})

export const {removeTask, setTasks, updateTask, addTask} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

// export const tasksReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
//   switch (action.type) {
//     case 'REMOVE-TASK':
//       return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//     case 'ADD-TASK':
//       return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//     case 'UPDATE-TASK':
//       return {
//         ...state,
//         [action.todolistId]: state[action.todolistId]
//           .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//       }
//     case addTodolist.type:
//       return {...state, [action.payload.todolist.id]: []}
//     case removeTodolist.type:
//       const copyState = {...state}
//       delete copyState[action.payload.id]
//       return copyState
//     case setTodolists.type: {
//       const copyState = {...state}
//       action.payload.todolists.forEach((tl: any) => {
//         copyState[tl.id] = []
//       })
//       return copyState
//     }
//     case 'SET-TASKS':
//       return {...state, [action.todolistId]: action.tasks}
//     default:
//       return state
//   }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId} as const)
// export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
//   type: 'UPDATE-TASK',
//   model,
//   todolistId,
//   taskId
// } as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
//   type: 'SET-TASKS',
//   tasks,
//   todolistId
// } as const)

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<any>) => {
  dispatch(setAppStatus({status: 'loading'}))
  todolistsAPI.getTasks(todolistId)
    .then((res) => {
      const tasks = res.data.items
      dispatch(setTasks({tasks, todolistId}))
      dispatch(setAppStatus({status: 'succeeded'}))
    })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<any>) => {
  todolistsAPI.deleteTask(todolistId, taskId)
    .then(res => {
      const action = removeTask({taskId, todolistId})
      dispatch(action)
    })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<any>) => {
  dispatch(setAppStatus({status: 'loading'}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        const action = addTask({task})
        dispatch(action)
        dispatch(setAppStatus({status: 'succeeded'}))
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn('task not found in the state')
      return
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel
    }

    todolistsAPI.updateTask(todolistId, taskId, apiModel)
      .then(res => {
        if (res.data.resultCode === 0) {
          const action = updateTask({taskId, model: domainModel, todolistId})
          dispatch(action)
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      })
  }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
type ThunkDispatch = Dispatch<any>

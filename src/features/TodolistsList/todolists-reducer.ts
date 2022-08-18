import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {appSlice, RequestStatusType, setAppStatus} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []
export const todolistSlice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    removeTodolist(state, action: PayloadAction<{ id: string }>) {
       debugger
      const index =  state.findIndex(todolist => todolist.id === action.payload.id)
      if(index > -1){
        state.splice(index)
      }
    },
    addTodolist(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    changeTodolistTitle(state, action: PayloadAction<{ id: string, title: string }>) {
      let el = state.find(todolist => todolist.id === action.payload.id)
      if (el) {
        el.title = action.payload.title
      }
    },
    changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      let el = state.find(todolist => todolist.id === action.payload.id)
      if (el) {
        el.filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      let el = state.find(todolist => todolist.id === action.payload.id)
      if (el) {
        el.entityStatus = action.payload.status
      }
    },
    setTodolists(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }
  }
})
export const {
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
  changeTodolistFilter,
  changeTodolistEntityStatus,
  setTodolists
} = todolistSlice.actions

export const todolistsReducer = todolistSlice.reducer
// export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case 'REMOVE-TODOLIST':
//       return state.filter(tl => tl.id !== action.id)
//     case 'ADD-TODOLIST':
//       return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
//
//     case 'CHANGE-TODOLIST-TITLE':
//       return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//     case 'CHANGE-TODOLIST-FILTER':
//       return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
//     case 'CHANGE-TODOLIST-ENTITY-STATUS':
//       return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
//     case 'SET-TODOLISTS':
//       return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
//     default:
//       return state
//   }
// }

// actions
// export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//   type: 'CHANGE-TODOLIST-TITLE',
//   id,
//   title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//   type: 'CHANGE-TODOLIST-FILTER',
//   id,
//   filter
// } as const)
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
//   type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status
// } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolists({todolists: res.data}))
        dispatch(setAppStatus({status: 'succeeded'}))

      })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus({status: 'loading'}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        dispatch(removeTodolist({id: todolistId}))
        //скажем глобально приложению, что асинхронная операция завершена
        dispatch(setAppStatus({status: 'succeeded'}))
      })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    todolistsAPI.createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTodolist({todolist: res.data.data.item}))
          dispatch(setAppStatus({status: 'succeeded'}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch(err => handleServerNetworkError(err, dispatch))
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<any>) => {
    todolistsAPI.updateTodolist(id, title)
      .then((res) => {
        dispatch(changeTodolistTitle({id: id, title: title}))
      })
  }
}

// types
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
// type ActionsType =
//   | RemoveTodolistActionType
//   | AddTodolistActionType
//   | ReturnType<typeof changeTodolistTitleAC>
//   | ReturnType<typeof changeTodolistFilterAC>
//   | SetTodolistsActionType
//   | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<any>

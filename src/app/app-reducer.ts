import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {authSlice, setInLogged} from "../features/Login/authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false,
}
export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>){
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{error: string | null}>){
      state.error = action.payload.error
    },
    setInitialized(state, action: PayloadAction<{value: boolean}>){
      state.isInitialized = action.payload.value
    }
  }
})
export const {setAppStatus, setAppError, setInitialized} = appSlice.actions
export const appReducer = appSlice.reducer

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case 'APP/SET-STATUS':
//       return {...state, status: action.status}
//     case 'APP/SET-ERROR':
//       return {...state, error: action.error}
//     case "APP/SET-INITIALIZED":
//       return {...state, isInitialized: action.value}
//     default:
//       return {...state}
//   }
// }
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me()
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setInLogged({value: true}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
    .finally(() => dispatch(setInitialized({value: true})))
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setInitializedAC = (value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const)

// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
// export type SetInitializedAT = ReturnType<typeof setInitializedAC>
//
// type ActionsType =
//   | SetAppErrorActionType
//   | SetAppStatusActionType
//   | SetInitializedAT
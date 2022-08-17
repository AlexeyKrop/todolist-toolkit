import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Dispatch} from "redux";
import {authAPI} from "../../api/todolists-api";
import {FormikErrorType} from "./Login";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setInLogged(state, action: PayloadAction<{value: true}>) {
      state.isLoggedIn = action.payload.value
    }
  }
})
export const {setInLogged} = authSlice.actions
export const authReducer = authSlice.reducer
export const loginTC = (data: FormikErrorType) => (dispatch: Dispatch<any>) => {
  authAPI.login(data)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(setInLogged({value: true}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch(err => handleServerNetworkError(err, dispatch))
}
import { createSlice } from '@reduxjs/toolkit'
import {Dispatch} from "redux";
import {authAPI} from "../../api/todolists-api";
import {FormikErrorType} from "./Login";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setInLogged(state, action: any){
      console.log(state)
      state.isLoggedIn = action.value
    }
  }
})
const {setInLogged} = authSlice.actions
export const loginTC = (data: FormikErrorType) => (dispatch: Dispatch<any>) => {
    authAPI.login(data)
      .then(res => {
        if(res.data.resultCode === 0){
          dispatch(setInLogged({value: true}))
        }
      })
}
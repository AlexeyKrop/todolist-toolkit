import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}
export const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }
      return errors
    },
    onSubmit: values => {
      alert(JSON.stringify(values));
    },
  })
  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>
            <p>To log in get registered
              <a href={'https://social-network.samuraijs.com/'}
                 target={'_blank'}> here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <FormGroup>
            <TextField type="email"
                       name="email"
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       value={formik.values.email} label="Email" margin="normal"/>
            <TextField name="password"
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       value={formik.values.password} type="password" label="Password"
                       margin="normal"
            />
            {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : ''}
            <FormControlLabel label={'Remember me'}
                              control={<Checkbox name={'rememberMe'} onChange={formik.handleChange}
                                                 onBlur={formik.handleBlur}
                                                 value={formik.values.rememberMe}/>}/>
            {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : ''}
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  </Grid>
}
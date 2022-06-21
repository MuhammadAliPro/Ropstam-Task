import { TextField, FormControlLabel, Checkbox, Button, Box, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useSendemailMutation } from '../../services/userAuthApi'
import { storeToken } from '../../services/LocalStorageService';

const Registration = () => {
  const [server_error, setServerError] = useState({})
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation()
  const [sendemail] = useSendemailMutation()




  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomPassword =
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const data = new FormData(e.currentTarget);
    const actualData = {
      name: data.get('name'),
      email: data.get('email'),
      password: randomPassword,
      password2: randomPassword,
      tc: data.get('tc'),
    }
    const res = await registerUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      storeToken(res.data.token)
      navigate('/dashboard')
      sendEmail(actualData)

    }
  }



  const sendEmail = async (emaildata) => {
    const res = await sendemail(emaildata)
    if (res.error) { 
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(res.data)

      
    }
  }
  return <>
    {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.name ? console.log(server_error.name[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    {server_error.password2 ? console.log(server_error.password2[0]) : ""}
    {server_error.tc ? console.log(server_error.tc[0]) : ""} */}
    <Box component='form' noValidate sx={{ mt: 1 }} id='registration-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='name' name='name' label='Name' />
      {server_error.name ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.name[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}
      <FormControlLabel control={<Checkbox value={true} color="primary" name="tc" id="tc" />} label="I agree to term and condition." />
      {server_error.tc ? <span style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.tc[0]}</span> : ""}
      <Box textAlign='center'>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Join</Button>
      </Box>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
    </Box>
  </>;
};

export default Registration;

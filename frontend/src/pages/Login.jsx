import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Login = () => {
  const [form,setForm] = useState({email:"",password:""});
  const navigate = useNavigate();

  const hc =e =>setForm({...form,[e.target.name]:e.target.value});

  const hs = async(e) =>{
    e.preventDefault();
    const res = await axios.post('http://localhost:6500/api/auth/login',form);
    localStorage.setItem('token',res.data.token);
    navigate('/view');
  }


  return <>
    <form onSubmit={hs}>
      <input 
      name='email'
      placeholder='email'
      onChange={hc}
      required
    />
    <br></br>
      <input 
      name='password'
      placeholder='password'
      onChange={hc}
      required
    />
    <br></br>
    <button>Login</button>

    </form>
  </>
}

export default Login
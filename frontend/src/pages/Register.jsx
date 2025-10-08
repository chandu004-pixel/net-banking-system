import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Register = () => {
  const [form,setForm] = useState({name:"",email:"",password:""});
  const navigate = useNavigate();

  const hc =e =>setForm({...form,[e.target.name]:e.target.value});

  const hs = async(e) =>{
    e.preventDefault();
    await axios.post('http://localhost:6500/api/auth/register',form);
    alert("registration successfully");
    navigate('/login');
  }


  return <>
    <form onSubmit={hs}>
    <input 
      name='name'
      placeholder='name'
      onChange={hc}
      required
    />
    <br></br>
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
    <button>Register</button>

    </form>
  </>
}

export default Register
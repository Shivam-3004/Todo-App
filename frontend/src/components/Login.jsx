import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigateTo = useNavigate();
  const BASE_URL = "http://localhost:4001";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/user/login`, {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      toast.success(data.message || "User Loggedin Successfully");
      localStorage.setItem("jwt", data.token);
      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "User Registration Failed");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-200'>
      <div className='w-full max-w-md p-10 bg-white rounded-lg shadow-lg '>
        <h1 className='text-center text-2xl font-semibold mb-5 '>Login</h1>
        <form onSubmit={handleLogin}>
          <div className='mb-4 '>
            <label className='block mb-2 font-semibold ' htmlFor="">Email</label>
            <input className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Enter your Email' />
          </div>
          <div className='mb-4 '>
            <label className='block mb-2 font-semibold ' htmlFor="">Password</label>
            <input className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Enter your Password' />
          </div>
          <button type='submit' className='w-full bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold p-3'>Login</button>
          <p className='mt-4 text-center text-gray-600 '>New User? <Link to="/signup" className='text-blue-600 hover:underline'>Signup</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login;
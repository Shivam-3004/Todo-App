import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function signup() { // signup page component

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigateTo = useNavigate();
  const BASE_URL = "http://localhost:4001";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/user/signup`, {
        username,
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      toast.success(data.message || "User Registered Successfully");
      localStorage.setItem("jwt", data.token);
      navigateTo("/login");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-200'>
      <div className='w-full max-w-md p-10 bg-white rounded-lg shadow-lg '>
        <h1 className='text-center text-2xl font-semibold mb-5 '>Signup</h1>
        <form onSubmit={handleRegister}>
          {/* username */}
          <div  className='mb-4 '>
            <label className='block mb-2 font-semibold ' htmlFor="">Username</label>
            <input className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='Enter your Username' />
          </div>
          {/* email */}
          <div className='mb-4 '>
            <label className='block mb-2 font-semibold ' htmlFor="">Email</label>
            <input className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={email} onChange={(e) =>setEmail(e.target.value)}  type="email" placeholder='Enter your Email' />
          </div>
          {/* password */}
          <div className='mb-4 '>
            <label className='block mb-2 font-semibold ' htmlFor="">Password</label>
            <input className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500' value={password} onChange={(e) =>setPassword(e.target.value)} type="password" placeholder='Create your Password' />
          </div>

          <button type='submit' className='w-full bg-blue-600 text-white hover:bg-blue-900 duration-300 rounded-xl font-semibold p-3'>Signup</button>
          <p className='mt-4 text-center text-gray-600 '>Already have an account? <Link to="/login" className='text-blue-600 hover:underline'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default signup;
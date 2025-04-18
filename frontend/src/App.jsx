import React from 'react';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageNotFound from './components/PageNotFound';
import  {Toaster } from 'react-hot-toast';

function App() {
  const token = localStorage.getItem("jwt");
  return (
    <div>
      <Routes>
        <Route path="/" element={token?<Home />:<Navigate to={"/login"}/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="*" element={<PageNotFound/>} />
      </Routes> 
      <Toaster />
    </div>
  );
}

export default App;
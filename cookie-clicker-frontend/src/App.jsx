import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import './App.css'
import './themes.css'
import axios from 'axios';

function App() {

  const [factories, setFactories] = useState('');

  useEffect(() => {
    const fetchFactoriesData = async () => {
      const res = await axios.get('http://localhost:3000/api/factories');
      setFactories(res.data);
    }

    fetchFactoriesData();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage factories={factories}/>} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App

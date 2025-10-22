import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css'
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
      </Routes>
    </>
  )
}

export default App

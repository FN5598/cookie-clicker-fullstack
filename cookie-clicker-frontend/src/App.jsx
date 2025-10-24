import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoutes } from './utils/ProtectedRoutes';
import './App.css'
import './themes.css'
import axios from 'axios';

function App() {

  const [factories, setFactories] = useState([]);
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const factoriesRes = await axios.get('http://localhost:3000/api/factories');
        setFactories(factoriesRes.data);

        const usersRes = await axios.get('http://localhost:3000/api/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Routes>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route element={<ProtectedRoutes users={users}/>}>
          <Route path="/home/:id" element={<HomePage factories={factories} users={users} />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App

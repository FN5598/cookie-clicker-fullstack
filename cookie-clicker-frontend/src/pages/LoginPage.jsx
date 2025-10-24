import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./LoginPage.css";
import axios from 'axios';

export function LoginPage() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    function saveInput(event) {
        const { name, value } = event.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    function handleSubmit() {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/login', loginData)
            .then((res) => {
                console.log(res.data);
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                alert("Failed to Log in")
            })
    }

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="email-container">
                        <p>Email</p>
                        <input
                            id="email-input"
                            placeholder="Write your Email here"
                            autoComplete="off"
                            name="email"
                            value={loginData.email}
                            onChange={saveInput}
                        />
                    </div>
                    <div className="password-container">
                        <p>Password</p>
                        <input
                            id="password-input"
                            placeholder="Write your Password here"
                            autoComplete="off"
                            name="password"
                            value={loginData.password}
                            onChange={saveInput}
                        />
                    </div>
                    <div className='login-button-container'>
                        <button id="login-button">LOGIN</button>
                    </div>
                </form>
                <div className="sign-in-link">
                    <p>Or Sign In Here</p>
                    <NavLink to="/register">SIGN IN</NavLink>
                </div>
            </div>
        </div>
    );
}
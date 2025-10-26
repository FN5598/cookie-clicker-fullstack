import { useState } from 'react';
import { NavLink } from "react-router-dom";
import "./RegisterPage.css";
import axios from 'axios';

export function RegisterPage() {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    function saveInput(event) {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/register', formData)
            .then((res) => {
                console.log(res.data);
                window.location.href = '/login';
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to register");
            })
    }

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="username-container">
                        <p>Username</p>
                        <input
                            name="username"
                            id="username-input"
                            placeholder="Write your Username here"
                            autoComplete="off"
                            onChange={saveInput}
                            value={formData.username}
                        />
                    </div>
                    <div className="email-container">
                        <p>Email</p>
                        <input
                            name="email"
                            id="email-input"
                            placeholder="Write your Email here"
                            autoComplete="off"
                            onChange={saveInput}
                            value={formData.email}
                        />
                    </div>
                    <div className="password-container">
                        <p>Password</p>
                        <input
                            name="password"
                            id="password-input"
                            placeholder="Write your Password here"
                            autoComplete="off"
                            onChange={saveInput}
                            value={formData.password}
                        />
                    </div>
                    <div className="signup-button-container">
                        <button id="signup-button">SIGN UP</button>
                    </div>
                </form>

                <div className="log-in-link">
                    <p>Or Log in In Here</p>
                    <NavLink to="/login">LOG IN</NavLink>
                </div>
            </div>
        </div>
    );
}
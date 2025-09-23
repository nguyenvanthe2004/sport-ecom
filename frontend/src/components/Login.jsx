import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/Login.css';
import {  useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/slices/currentUser';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(email, password);
            console.log("==========response", response)
            dispatch(setCurrentUser(response.user))
            if(response.user.role === 'admin'){
                navigate('/admin');
            } else if (response.user.role === 'user'){
                navigate('/home');
            } else {
                setError('Unknown user role');
            }

        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={5}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-btn" disabled={!email || !password}>
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}

export default Login;
import React from 'react';
import { useState } from 'react';
import { register } from '../services/api';
import '../styles/Register.css';
import { showToast } from '../../libs/utils';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const response = await register(email, password, fullname);
            console.log(response);
            showToast('Đăng ký thành công!');
            
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <div className="register-container">
            <div className='logo-img'>
                <img src="/public/logo.jpg" alt="" />
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullname">Họ tên:</label>
                    <input
                        type="text"
                        id="fullname"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="register-btn" disabled={!email || !password || !fullname}>
                    Đăng ký
                </button>
            </form>
        </div>
    );
}

export default Register;
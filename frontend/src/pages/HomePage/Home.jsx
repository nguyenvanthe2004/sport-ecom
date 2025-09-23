import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const currentUser = useSelector(state => state.auth.currentUser)
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/login');
    }
    return (
        <div>
            <h1>Welcome to the {currentUser.email}</h1>
            <button onClick={handleSubmit}>Login</button>
        </div>
    )
}

export default Home;
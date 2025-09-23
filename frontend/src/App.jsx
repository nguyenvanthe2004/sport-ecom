import React from 'react'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCurrentUser, clearCurrentUser } from './redux/slices/currentUser'
import { getCurrentUser } from './services/api'
import AuthPage from './pages/authPage'
import Home from './pages/HomePage/Home'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser()
        if(res.user) {
          dispatch(setCurrentUser(res.user));
        }
      } catch(error) {
        console.log("Error: ", error);
        
        dispatch(clearCurrentUser())
      }
    }
    fetchCurrentUser()
  }, [dispatch])
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<AuthPage formType="login" />} />
          <Route path="/register" element={<AuthPage formType="register" />} />
        </Routes>
      </BrowserRouter>
    </div>
  ) 
}

export default App

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DonorDashboard from './pages/DonorDashboard'
import RecipientMap from './pages/RecipientMap'
import Chat from './pages/Chat'

function App() {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/map" element={<RecipientMap />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

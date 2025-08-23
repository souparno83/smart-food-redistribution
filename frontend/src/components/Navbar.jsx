import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">🍲 FoodLoop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/signup">Signup</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/donor">Donor</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/map">Map</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/chat">Chat</Link></li>
            {/* ✅ Add Notifications link */}
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">Notifications</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

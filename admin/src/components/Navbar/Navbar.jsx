import React from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';

const Navbar = () => {
  return (
    <header className='navbar'>
      <div className='navbar-brand'>
        <img className='logo' src={assets.logo} alt="Admin logo" />
        <div className='navbar-title'>
          <h1>Fresh Eats Admin</h1>
          <p>Keep your menu, orders and operations in sync.</p>
        </div>
      </div>
      <div className='navbar-profile'>
        <span className='navbar-user'>Admin</span>
        <img src={assets.profile_image} alt="Admin profile" className="profile" />
      </div>
    </header>
  )
}

export default Navbar
import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from './../context/StoreContext';

const Navbar = ({setShowLogin}) => {

  const [menu, setMenu] = useState('home');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const {getTotalCartAmount, token, setToken, searchTerm, setSearchTerm} = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () =>{
    localStorage.removeItem("token");
    setToken("");
    setProfileOpen(false);
    navigate("/")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='navbar'>
       <Link to='/'> <img src={assets.logo} alt="" className='logo' /></Link>
        <ul className="navbar-menu">
            <Link to='/' onClick={()=> setMenu('home')} className={menu === 'home'?'active':''}>home</Link>
            <Link to='/about' onClick={()=> setMenu('about')} className={menu === 'about'?'active':''}>about us</Link>
            <a href='#explore-menu' onClick={()=> setMenu('menu')} className={menu === 'menu'?'active':''}>menu</a>
            <a href='#app-download' onClick={()=> setMenu('mobile-app')} className={menu === 'mobile-app'?'active':''}>mobile-app</a>
            <a href='#footer' onClick={()=> setMenu('contact-us')} className={menu === 'contact-us'?'active':''}>contact us</a>
        </ul>
        <div className="navbar-right">
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={assets.search_icon} alt="Search icon" />
            </div>
            <div className="navbar-search-icon-container">
                <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                <div className={getTotalCartAmount()===0?'':'dot'}></div>
            </div>
            {!token?<button onClick={()=> setShowLogin(true)}>sign in</button>
            :<div className='navbar-profile' ref={profileRef}>
              <div className="navbar-profile-name" onClick={() => setProfileOpen((prev) => !prev)}>
                <img src={assets.profile_icon} alt="" />
              </div>
              <ul className={`nav-profile-dropdown ${profileOpen ? 'open' : ''}`}>
                <li onClick={()=> { navigate('/myorders'); setProfileOpen(false); }}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                <hr />  
                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
              </ul>
            </div>
            }
              </div>
    </div>
  )
}

export default Navbar
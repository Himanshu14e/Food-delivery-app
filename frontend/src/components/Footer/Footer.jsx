import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p> Is your trusted food delivery platform,
            bringing delicious meals from your favorite restaurants straight to
            your doorstep. We are committed to fast delivery, fresh food, secure
            payments, and an exceptional customer experience. Whether you're
            craving breakfast, lunch, dinner, or a late-night snack, BiteGo is
            just a few clicks away.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+91 765489545</li>
                    <li>himanshukardam93@gmail.com</li>
                     <li> New Delhi, India</li>
                </ul>
            </div>
           
        </div>
        <hr />
        <p className="footer-copyright">
            © 2026 BiteGo. &copy; All Rights Reserved. Designed & Developed by Himanshu Kardam.
        </p>
    </div>
  )
}

export default Footer
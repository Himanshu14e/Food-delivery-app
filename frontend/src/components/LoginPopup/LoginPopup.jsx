import React, { useContext, useEffect, useRef, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from './../context/StoreContext';
import axios from 'axios'

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken} = useContext(StoreContext)
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const googleButtonRef = useRef(null);

    const [currentState, setCurrentState] = useState('Login')
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData((prev) => ({ ...prev, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url
        if (currentState === 'Login') {
            newUrl += '/api/user/login'
        } else {
            newUrl += '/api/user/register'
        }

        const response = await axios.post(newUrl, data)

        if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token', response.data.token)
            setShowLogin(false)
        } else {
            alert(response.data.message)
        }
    }

    const handleGoogleCredentialResponse = async (response) => {
        if (!response?.credential) return;

        try {
            const googleResponse = await axios.post(url + '/api/user/google', {
                idToken: response.credential,
            })

            if (googleResponse.data.success) {
                setToken(googleResponse.data.token)
                localStorage.setItem('token', googleResponse.data.token)
                setShowLogin(false)
            } else {
                alert(googleResponse.data.message || 'Google login failed.')
            }
        } catch (error) {
            console.error('Google login error:', error)
            alert('Google login failed.')
        }
    }

    useEffect(() => {
        if (!googleClientId || !googleButtonRef.current) return;

        const renderGoogleButton = () => {
            if (!window.google?.accounts?.id || !googleButtonRef.current) return;

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCredentialResponse,
            })
            window.google.accounts.id.renderButton(googleButtonRef.current, {
                theme: 'outline',
                size: 'large',
                width: '100%',
            })
        }

        const existingScript = document.getElementById('google-client-script')
        if (existingScript) {
            renderGoogleButton()
            return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.id = 'google-client-script'
        script.async = true
        script.defer = true
        script.onload = renderGoogleButton
        document.body.appendChild(script)

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script)
        }
    }, [googleClientId, url])

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="login-popup-inputs">
                    {currentState === 'Login' ? null : (
                        <input
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type='text'
                            placeholder='Your name'
                            required
                        />
                    )}
                    <input
                        name='email'
                        onChange={onChangeHandler}
                        value={data.email}
                        type='email'
                        placeholder='Your email'
                        required
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type='password'
                        placeholder='Password'
                        required
                    />
                </div>

                <button type='submit'>{currentState === 'Sign Up' ? 'Create account' : 'Login'}</button>

                <div className="google-separator">
                    <span />
                    <p>or continue with Google</p>
                    <span />
                </div>

                {googleClientId ? (
                    <div className="google-auth-section">
                        <div ref={googleButtonRef} className="google-button-container" />
                    </div>
                ) : (
                    <p className="google-auth-note">Google login requires VITE_GOOGLE_CLIENT_ID in your frontend .env file.</p>
                )}

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>

                {currentState === 'Login' ? (
                    <p>Create a new account? <span onClick={()=> setCurrentState('Sign Up')}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={()=> setCurrentState('Login')}>Login here</span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup
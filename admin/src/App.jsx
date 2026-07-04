import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  return (
    <div className='admin-shell'>
      <ToastContainer />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <main className="main-view">
          <Routes>
            <Route path='/' element={<Dashboard url={url} />} />
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
            <Route path='*' element={<Dashboard url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
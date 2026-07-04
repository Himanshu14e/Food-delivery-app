import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [foodResp, orderResp] = await Promise.all([
          axios.get(`${url}/api/food/list`),
          axios.get(`${url}/api/order/list`),
        ])

        const products = foodResp.data.success ? foodResp.data.data.length : 0
        const orders = orderResp.data.success ? orderResp.data.data.length : 0
        const revenue = orderResp.data.success
          ? orderResp.data.data.reduce((sum, order) => sum + Number(order.amount || 0), 0)
          : 0

        setStats({ products, orders, revenue })
      } catch (error) {
        console.error('Dashboard stats load failed:', error)
      }
    }

    fetchStats()
  }, [url])

  return (
    <div className='dashboard-page'>
      <section className='dashboard-hero card'>
        <div>
          <p className='dashboard-overline'>Admin Overview</p>
          <h1>Welcome back, Admin.</h1>
          <p className='dashboard-copy'>Manage products, view orders, and keep your kitchen running smoothly.</p>
        </div>
        <div className='dashboard-hero-panel'>
          <div className='dashboard-hero-visual'>
            <span className='hero-bar hero-bar-1'></span>
            <span className='hero-bar hero-bar-2'></span>
            <span className='hero-bar hero-bar-3'></span>
            <span className='hero-bar hero-bar-4'></span>
          </div>
          <div className='dashboard-actions'>
            <NavLink to='/add' className='dashboard-action-button'>Add Product</NavLink>
            <NavLink to='/list' className='dashboard-action-link'>View Products</NavLink>
          </div>
        </div>
      </section>

      <section className='dashboard-grid'>
        <article className='dashboard-card card'>
          <span>Total products</span>
          <h2>{stats.products}</h2>
          <p>Active menu items live in your store.</p>
          <div className='card-bars'>
            <span className='card-bar bar-a'></span>
            <span className='card-bar bar-b'></span>
            <span className='card-bar bar-c'></span>
          </div>
        </article>
        <article className='dashboard-card card'>
          <span>Open orders</span>
          <h2>{stats.orders}</h2>
          <p>Orders waiting for pickup, delivery, or processing.</p>
          <div className='card-bars'>
            <span className='card-bar bar-d'></span>
            <span className='card-bar bar-e'></span>
            <span className='card-bar bar-f'></span>
          </div>
        </article>
        <article className='dashboard-card card'>
          <span>Estimated revenue</span>
          <h2>₹{stats.revenue.toLocaleString()}</h2>
          <p>Revenue from completed and pending orders.</p>
          <div className='card-bars'>
            <span className='card-bar bar-g'></span>
            <span className='card-bar bar-h'></span>
            <span className='card-bar bar-i'></span>
          </div>
        </article>
      </section>
    </div>
  )
}

export default Dashboard

import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const Orders = ({url}) => {

  const [orders, setOrders] = useState([])
  const [sortOrder, setSortOrder] = useState('latest')

  const fetchAllOrders = async () =>{
    try {
      const response = await axios.get(`${url}/api/order/list?sort=${sortOrder}`);
      if(response.data.success){
        setOrders(response.data.data);
      } else {
        toast.error("Order fetch error")
      }
    } catch (error) {
      toast.error("Unable to load orders")
    }
  }

  const removeOrder = async (orderId) => {
    if (!window.confirm('Remove this order permanently?')) return;

    try {
      const response = await axios.post(`${url}/api/order/remove`, { orderId });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || 'Unable to remove order');
      }
    } catch (error) {
      toast.error('Unable to remove order');
    }
  }

  const statusHandler = async (event,orderId) =>{
    try {
      const response = await axios.post(`${url}/api/order/status`,{
        orderId,
        status:event.target.value
      })
      if(response.data.success){
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error('Unable to update status');
    }
  }

  useEffect(()=>{
    fetchAllOrders()
  },[sortOrder])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='order add'>
      <div className='order-header'>
        <div>
          <h3>Order Management</h3>
          <p className='order-subtitle'>Newest orders are shown first. Remove old entries or update delivery status instantly.</p>
        </div>
        <div className='order-controls'>
          <div className='order-chip'>Sort:</div>
          <div className='order-sort'>
            <button type='button' className={sortOrder === 'latest' ? 'active' : ''} onClick={() => setSortOrder('latest')}>Latest</button>
            <button type='button' className={sortOrder === 'oldest' ? 'active' : ''} onClick={() => setSortOrder('oldest')}>Oldest</button>
          </div>
        </div>
      </div>
      <div className="order-list">
        {orders.map((order)=>(
          <div key={order._id} className="order-item">
            <img src={assets.parcel_icon} alt="Order icon" />
            <div className='order-item-main'>
              <p className="order-item-food">{order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}</p>
              <p className="order-item-name">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <div className="order-item-address">
                <p>{`${order.address.city}, ${order.address.state}`}</p>
                <p>{`${order.address.country} • ${order.address.zipcode}`}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
              <p className='order-item-date'>{formatDate(order.date)}</p>
            </div>
            <div className='order-item-summary'>
              <p className='order-item-quantity'>Items: {order.items.length}</p>
              <p className='order-item-price'>₹{order.amount}</p>
            </div>
            <div className='order-item-status'>
              <span className={`status-badge ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span>
              <span className={`payment-badge ${order.payment ? 'paid' : 'pending'}`}>{order.payment ? 'Paid' : 'Pending'}</span>
            </div>
            <div className='order-actions'>
              <select onChange={(event)=> statusHandler(event,order._id)} value={order.status} >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button type='button' className='remove-btn' onClick={() => removeOrder(order._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';

const MyOrders = () => {
  const {url, token} = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } })
    setData(response.data.data || []);
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';

    return new Date(dateString).toLocaleString('en-GB', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderItems = (items) => {
    return items.map((item) => `${item.name} x ${item.quantity}`).join(', ');
  }

  const canCancelOrder = (status) => {
    const blockedStatuses = ['Out for delivery', 'Delivered'];
    return !blockedStatuses.includes(status);
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;

    try {
      await axios.post(`${url}/api/order/remove`, { orderId });
      fetchOrders();
    } catch (error) {
      console.error('Cancel order failed', error);
    }
  }

  return (
    <div className='my-orders'>
      <div className='my-orders-hero'>
        <div>
          <p className='my-orders-label'>Order history</p>
          <h2>Your recent orders</h2>
          <p className='my-orders-description'>Quickly review order status, payment, and delivery details in a clean responsive layout.</p>
        </div>
      </div>

      <div className='orders-grid'>
        {data.length === 0 ? (
          <div className='empty-state'>No orders found yet. Place an order to see it here.</div>
        ) : (
          data.map((order, index) => (
            <article key={order._id} className='order-card'>
              <div className='order-card-header'>
                <div className='order-card-identity'>
                  <div className='order-card-icon'>
                    <img src={assets.parcel_icon} alt='Order parcel' />
                  </div>
                  <div>
                    <p className='order-card-number'>Order #{String(index + 1).padStart(3, '0')}</p>
                    <p className='order-card-date'>{formatDate(order.date)}</p>
                  </div>
                </div>
                <div className='order-card-status'>
                  <span className={`status-pill ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span>
                  <span className={`status-pill payment ${order.payment ? 'paid' : 'pending'}`}>{order.payment ? 'Paid' : 'Pending'}</span>
                </div>
              </div>

              <div className='order-card-body'>
                <div className='order-card-section'>
                  <h4>Items</h4>
                  <p>{renderItems(order.items)}</p>
                </div>
                <div className='order-card-section'>
                  <h4>Delivery</h4>
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.country} · {order.address.zipcode}</p>
                </div>
              </div>

              <div className='order-card-footer'>
                <div className='order-card-summary'>
                  <div>
                    <span>Items</span>
                    <strong>{order.items.length}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>₹{order.amount}</strong>
                  </div>
                </div>
                <div className='order-card-actions'>
                  {canCancelOrder(order.status) && (
                    <button type='button' className='cancel-button' onClick={() => cancelOrder(order._id)}>
                      Cancel Order
                    </button>
                  )}
                  <button type='button' onClick={fetchOrders}>Track Order</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default MyOrders
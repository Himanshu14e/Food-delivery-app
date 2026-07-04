import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const loadRazorpayScript = () => new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const PlaceOrder = () => {
  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext);

  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data =>({...data,[name]:value}))
  }

  const placeOrder = async (event) =>{
    event.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if(cartItems[item._id] > 0){
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    })

    const orderAmount = getTotalCartAmount() + 2;
    const orderData = {
      address:data,
      items:orderItems,
      amount:orderAmount,
      paymentMethod,
    }

    try {
      const response = await axios.post(url+'/api/order/place', orderData,{headers:{token}})
      if(response.data.success){
        if(response.data.paymentMethod === 'razorpay'){
          const { order, orderId, razorpayKeyId } = response.data;
          const scriptLoaded = await loadRazorpayScript();

          if(!scriptLoaded){
            alert('Razorpay failed to load. Please try again.');
            return;
          }

          const options = {
            key: razorpayKeyId,
            amount: order.amount,
            currency: order.currency,
            name: 'Food Delivery',
            description: 'Order Payment',
            order_id: order.id,
            prefill: {
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
              contact: data.phone,
            },
            handler: async (rzpResponse) => {
              try {
                const verifyResponse = await axios.post(url+'/api/order/verify', {
                  orderId,
                  success: 'true',
                  paymentMethod: 'razorpay',
                  paymentId: rzpResponse.razorpay_payment_id,
                  signature: rzpResponse.razorpay_signature,
                  razorpayOrderId: rzpResponse.razorpay_order_id,
                });

                if(verifyResponse.data.success){
                  navigate('/myorders');
                } else {
                  alert('Payment verification failed. Please contact support.');
                }
              } catch (error) {
                console.error(error);
                alert('Payment verification failed. Please contact support.');
              }
            },
            theme: {
              color: '#ff4d4d',
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', async () => {
            try {
              await axios.post(url+'/api/order/verify', { orderId, success: 'false', paymentMethod: 'razorpay' });
            } catch (error) {
              console.error(error);
            }
            navigate('/cart');
          });
          rzp.open();
        }
        else if(response.data.session_url){
          window.location.replace(response.data.session_url);
        }
        else{
          alert('Payment could not be initiated');
        }
      }
      else{
        alert(response.data.message || 'Error')
      }
    } catch (error) {
      console.error(error);
      alert('Payment could not be initiated');
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city}  type="text" placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-left">
      <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
          <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div> 
          </div>
          <div className="payment-methods" style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type='radio'
                name='paymentMethod'
                value='stripe'
                checked={paymentMethod === 'stripe'}
                onChange={() => setPaymentMethod('stripe')}
              />
              Pay with Stripe
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type='radio'
                name='paymentMethod'
                value='razorpay'
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              Pay with Razorpay
            </label>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
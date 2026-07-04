import crypto from 'crypto';
import orderModel from './../models/orderModel.js';
import userModel from './../models/userModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('your_') || keySecret.includes('your_')) {
        return null;
    }

    return new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });
};

// Placing user order for frontend
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const paymentMethod = req.body.paymentMethod || 'stripe';

        if (paymentMethod === 'razorpay') {
            const razorpayClient = getRazorpayClient();
            if (!razorpayClient) {
                return res.json({
                    success: false,
                    message: 'Razorpay is not configured. Add your Razorpay key ID and secret to the backend environment.',
                });
            }

            const amountInPaise = Math.round(Number(req.body.amount) * 100);
            const razorpayOrder = await razorpayClient.orders.create({
                amount: amountInPaise,
                currency: 'INR',
                receipt: newOrder._id.toString(),
                notes: {
                    orderId: newOrder._id.toString(),
                },
            });

            return res.json({
                success: true,
                paymentMethod: 'razorpay',
                order: razorpayOrder,
                orderId: newOrder._id,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            });
        }

        if (!stripe) {
            return res.json({
                success: false,
                message: 'Stripe is not configured. Add your Stripe secret key to the backend environment.',
            });
        }

        const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5173';
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'lkr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100 * 300,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: 'lkr',
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: 2 * 100 * 80,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        return res.json({
            success: true,
            paymentMethod: 'stripe',
            session_url: session.url,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success, paymentId, signature, razorpayOrderId, paymentMethod } = req.body;

    try {
        if (success === 'false') {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: 'Not Paid' });
        }

        if (paymentMethod === 'razorpay') {
            if (paymentId && signature && razorpayOrderId) {
                const expectedSignature = crypto
                    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                    .update(`${razorpayOrderId}|${paymentId}`)
                    .digest('hex');

                const isValidSignature = (() => {
                    try {
                        return crypto.timingSafeEqual(
                            Buffer.from(signature),
                            Buffer.from(expectedSignature)
                        );
                    } catch (error) {
                        return false;
                    }
                })();

                if (!isValidSignature) {
                    await orderModel.findByIdAndDelete(orderId);
                    return res.json({ success: false, message: 'Invalid Payment Signature' });
                }
            }
        }

        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({ success: true, message: 'Paid' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error' });
    }
};

// user orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// listing orders for admin panel
const listOrders = async (req,res) =>{
   try {
    const sortDirection = req.query.sort === 'oldest' ? 1 : -1;
    const orders = await orderModel.find({}).sort({ date: sortDirection });
    res.json({success:true, data:orders})
   } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})  
   } 
}

const removeOrder = async (req, res) => {
    const orderId = req.params.orderId || req.body.orderId;
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    try {
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:true, message:"Order removed"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// api for updating order status
const updateStatus = async (req, res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})  
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, removeOrder, updateStatus}
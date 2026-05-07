import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId; // CheckOut page se bheja gaya ID

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-center mb-6">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            {orderId && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 w-full max-w-md text-center">
                    <span className="text-sm text-gray-500 uppercase tracking-widest block mb-1">Order ID</span>
                    <span className="font-mono text-lg font-bold text-blue-600">{orderId}</span>
                </div>
            )}

            <Link
                to="/"
                className="bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-900 transition-all font-semibold"
            >
                Continue Shopping
            </Link>
        </div>
    );
}

export default OrderSuccess;
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../index'
import { useCart } from '../Context/CartContext';
import { serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import configservice from '../Firebase/Config-services';
import { Icon } from '@iconify/react';
import authservice from '../Firebase/Auth-services';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { sendOrderEmail } from '../Components/Email Services/emailService';

function CheckOut() {


    // Stripe hooks -----------------------------------------------------------------------------------

    const stripe = useStripe();
    const elements = useElements();

    // ------------------------------------------------------------------------------------------------

    const { cartItems, clearCart } = useCart()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card'); // select shipping method
    const navigate = useNavigate();

    const submit = async (formData) => {

        const currentUser = await authservice.getCurrentUser()

        if (cartItems.length === 0) {
            alert('Your cart is empty')
            return
        }
        try {
            setLoading(true);
            setError(null);

            const orderData = {
                customerInfo: formData,
                orderItems: cartItems,
                userId: currentUser ? currentUser.uid : 'guest-user',
                paymentMethod: selectedMethod === "cod" ? "Cash on delivery" : "PrePaid(pending)",
                shippingFee: Number(shippingFee),
                totalPrice: Number(totalPrice),
                orderStatus: 'Pending',
                createdAt: serverTimestamp()  // current firebase time

            }

            let orderId = null;
            let finalOrderData = null;

            // if (selectedMethod === "cod") {
            //     const orderId = await configservice.saveOrderToDB(orderData)

            //     if (orderId) {

            //         clearCart()    // Empty cart when order is successfull
            //         toast.success("Order Placed via COD!");
            //         navigate('/order-success', {
            //             state: { orderId: orderId },
            //             replace: true // Taake user back button daba kar wapis checkout par na aa sakay
            //         });
            //         console.log(orderId)
            //     }

            if (selectedMethod === "cod") {
                finalOrderData = {
                    ...orderData,
                    paymentMethod: "Cash on delivery",
                    paymentStatus: "Unpaid"
                };
                orderId = await configservice.saveOrderToDB(finalOrderData);

            } else {

                // 2. Stripe Logic

                if (!stripe || !elements) {
                    toast.error("Stripe is loading... please wait.");
                    setLoading(false);
                    return;
                }

                const cardElement = elements.getElement(CardElement);

                const { error, paymentMethod: stripeMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: {
                        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.name,
                        email: formData.email,
                    },
                });

                if (error) {
                    toast.error(error.message);
                    setLoading(false);

                    // } else {
                    //     const stripeOrderData = {
                    //         ...orderData,
                    //         paymentMethod: "Card (Stripe)",
                    //         paymentStatus: "Pending Verification", // Testing ke liye 'Paid' ya 'Pending Verification'
                    //         stripePaymentId: stripeMethod.id, // Ye ID record ke liye zaroori hai
                    //     };

                } else {
                    finalOrderData = {
                        ...orderData,
                        paymentMethod: "Card (Stripe)",
                        paymentStatus: "Paid",
                        stripePaymentId: stripeMethod.id,
                    };
                    orderId = await configservice.saveOrderToDB(finalOrderData);
                }
            }




            // 4. Firebase mein save karein
            // const orderId = await configservice.saveOrderToDB(stripeOrderData);

            if (orderId) {
                sendOrderEmail(finalOrderData, orderId);
                clearCart();
                toast.success(selectedMethod === "cod" ? "Order Placed via COD!" : "Payment Successful & Order Placed!");
                navigate('/order-success', {
                    state: { orderId: orderId },
                    replace: true
                });
            }



        } catch (error) {
            console.error("CheckOut :: handleSubmit :: error", error);

        } finally {
            setLoading(false);
        }

    }


    const SubTotal = () => {
        return cartItems.reduce((total, item) => {
            const subTotalPrice = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
            return total + (subTotalPrice * item.quantity);

        }, 0);
    };

    const shippingFee = selectedMethod === "cod" ? 10 : 0;
    const totalPrice = (parseFloat(SubTotal()) + shippingFee).toFixed(2)


    return (
        <div>

            <nav
                className=' w-full fixed border-b border-gray-300 py-5 z-50 bg-white '
            >
                <Link to="/">
                    <img
                        src="/src/assets/logo/Logo TR.png"
                        alt=""
                        className="w-40 ml-35"
                    />
                </Link>
            </nav>

            <div className='h-screen flex '>

                <form
                    onSubmit={handleSubmit(submit)}
                    action=""
                    className='w-1/2 bg-white pr-14 pl-35  pt-35 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
                >

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Contect */}
                    <div className="relative pb-8" >

                        <Input
                            label="Contect"
                            placeholder="Email"
                            type="email"
                            labelClassName="font-semibold text-lg"
                            className="placeholder:text-[13px]"
                            {...register("email", {
                                required: true,
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Invalid email address"
                                }
                            })}
                        />

                        {errors.email && <p className='text-red-600 mt-8 text-center'>{errors.email.message}</p>}

                        < Link
                            to="/Login"
                            className='absolute top-0 right-0 text-md underline cursor-pointer text-blue-600 hover:text-blue-700'
                        >
                            Sign in
                        </ Link >
                    </div>

                    {/* Delivery */}
                    <div className=' pb-8'>
                        <Input
                            label="Delivery"
                            placeholder="Country/Region"
                            type="text"
                            labelClassName="font-semibold text-lg"
                            className="placeholder:text-[13px]"
                            {...register("country", { required: true })}
                        />

                        {errors.country && <p className='text-red-600 mt-8 text-center'>{errors.country.message}</p>}

                        <div className='flex gap-2'>

                            <Input
                                placeholder="First Name"
                                type="text"
                                className="placeholder:text-[13px] -mt-11 "
                                {...register("firstName", { required: true })}
                            />

                            {errors.firstName && <p className='text-red-600 mt-8 text-center'>{errors.firstName.message}</p>}


                            <Input
                                placeholder="Last Name"
                                type="text"
                                className="placeholder:text-[13px] -mt-11"
                                {...register("lastName", { required: true })}

                            />

                            {errors.lastName && <p className='text-red-600 mt-8 text-center'>{errors.lastName.message}</p>}


                        </div>

                        <Input
                            placeholder="Address"
                            type="text"
                            labelClassName="font-semibold text-lg"
                            className="placeholder:text-[13px] -mt-11"
                            {...register("address", { required: true })}
                        />

                        {errors.address && <p className='text-red-600 mt-8 text-center'>{errors.address.message}</p>}


                        <div className='flex gap-2'>

                            <Input
                                placeholder="City"
                                type="text"
                                className="placeholder:text-[13px] -mt-11 "
                                {...register("city", { required: true })}
                            />

                            {errors.city && <p className='text-red-600 mt-8 text-center'>{errors.city.message}</p>}

                            <Input
                                placeholder="Postal Code (optional)"
                                type="number"
                                style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                className="placeholder:text-[13px] -mt-11 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                {...register("postalCode", { required: false })}
                            />

                            {errors.postalCode && <p className='text-red-600 mt-8 text-center'>{errors.postalCode.message}</p>}


                        </div>

                        <Input
                            placeholder="Phone"
                            type="number"
                            labelClassName="font-semibold text-lg"
                            style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                            className="placeholder:text-[13px] -mt-11 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            {...register("phone", { required: true })}

                        />

                        {errors.phone && <p className='text-red-600 mt-8 text-center'>{errors.phone.message}</p>}

                    </div>

                    {/* Shipping method */}
                    <h2 className='font-semibold text-lg mb-3'>Shipping method</h2>

                    <div className="flex flex-col w-full mb-12">

                        {/* 1st Option: Cash on Delivery */}
                        <label
                            className={`relative flex items-center p-3 border border-gray-300 rounded-t-lg cursor-pointer transition-all
                         ${selectedMethod === 'cod'
                                    ? 'border-blue-500 bg-blue-50 z-10'
                                    : ''}`}
                        >

                            <input
                                type="radio"
                                name="payment_method"
                                value="cod"
                                checked={selectedMethod === 'cod'}
                                onChange={() => setSelectedMethod('cod')}
                                className="w-4 h-4"
                            />
                            <div className="ml-4">
                                <span className="block font-semibold text-sm">Cash on Delivery (COD)</span>
                                <span className="block text-xs text-gray-500">Pay with cash upon delivery</span>
                            </div>
                        </label>

                        {/* 2nd Option: Free Shipping (Pre-paid) */}
                        <label
                            className={`relative flex flex-col p-4 border border-gray-300 rounded-b-lg cursor-pointer transition-all
                         ${selectedMethod === 'card'
                                    ? 'border-blue-500 bg-blue-50 z-10'
                                    : ''}`}
                        >
                            <div className="flex items-center w-full">

                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="card"
                                    checked={selectedMethod === 'card'}
                                    onChange={() => setSelectedMethod('card')}
                                    className="w-4 h-4"
                                />

                                <div className="ml-4 flex-1">

                                    <div className="flex justify-between items-center">

                                        <span className="block font-semibold text-sm">Free Shipping (Pre-paid)</span>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">SAVE MORE</span>

                                    </div>

                                    <span className="block text-xs text-gray-500">Debit and Credit Cards (Visa, Mastercard)</span>

                                </div>
                            </div>

                            {/* STRIPE CARD ELEMENT: Sirf tab dikhega jab card selected ho */}
                            {selectedMethod === 'card' && (
                                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider font-bold">Secure Card Payment</p>
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': { color: '#aab7c4' },
                                                },
                                                invalid: { color: '#9e2146' },
                                            },
                                        }}
                                    />
                                </div>
                            )}
                        </label>
                    </div>

                    <div className=' mb-12'>
                        <button
                            className={`w-full text-white text-lg py-3 rounded-lg transition-all active:scale-[0.98] duration-100
                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900'}`}
                        >
                            {loading ? (
                                <>

                                    <span
                                        className="iconify animate-spin text-2xl"
                                        data-icon="line-md:loading-twotone-loop"
                                    ></span>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                "Pay Now"
                            )}
                        </button>
                    </div>

                </form>

                <div className='border-l border-gray-300 w-1/2 pr-35 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>

                    <div className='px-14 pt-35'>

                        {cartItems.map((item, index) => {

                            const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
                            const totalItemPrice = unitPrice * (item.quantity || 1);

                            return (

                                < div key={`${item.productId}-${index}`} className='flex pb-7' >

                                    <div className=' h-auto relative border border-gray-300 rounded-lg shrink-0'>
                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName}
                                            className='w-19 rounded-lg '
                                        />
                                        <span className='absolute top-0 right-0 bg-gray-600 text-white rounded-md w-5 h-5 flex items-center justify-center font-semibold'>{item.quantity || 1}</span>
                                    </div>

                                    <div className='flex-1 gap-2 flex justify-between overflow-hidden'>

                                        <div className='p-3 pl-5'>

                                            <h3 className='text-lg font-semibold'>{item.productName}</h3>

                                            <div className='flex gap-1'>
                                                <span
                                                    className="w-5 h-5 flex rounded-sm border border-black transition-all duration-200   mt-1"
                                                    style={{ backgroundColor: item.color.toLowerCase() }}
                                                    title={item.color}
                                                >

                                                </span> | <span>{item.size}</span>
                                            </div>
                                        </div>

                                        {/* Price */}

                                        <div className='p-4 text-md'>
                                            $ {totalItemPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className='pt-9 flex flex-col gap-1 '>
                            {/* <div className="">
                                <p className="text-[11px] text-gray-500 text-center mb-4 uppercase tracking-widest">
                                    Shipping & taxes free
                                </p>
                            </div> */}

                            {/* SubTotal */}
                            <div className="flex justify-between items-center ">
                                <span className=" text-md">Subtotal: </span>
                                <span className="text-md text-gray-900">$&nbsp;{SubTotal().toFixed(2)}</span>
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between items-center ">
                                <span className=" text-md">Shipping: </span>
                                <span className="text-md text-gray-900">
                                    {selectedMethod === "cod" ? `$ ${shippingFee.toFixed(2)}` : 'Free'}
                                </span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pb-13 pt-4">
                                <span className="font-bold text-xl">Total: </span>
                                <span className="text-xl font-medium text-gray-900">$&nbsp;{totalPrice}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CheckOut
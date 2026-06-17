import React, { useEffect, useState } from 'react';
import { useCart } from '../../Context/CartContext';
import { database } from '../../lib/fireBaseConfig';
import { doc, query, collection, where, getDocs, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'sonner';
import authservice from '../../Firebase/Auth-services';
import { useNavigate } from 'react-router-dom';
import { logout as sliceLogout } from '../../Store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authStatus = useSelector((state) => state.auth.status);
    const { currentUser } = useCart();

    // States
    const [fetchUserLoading, setFetchUserLoading] = useState(true);
    const [fetchOrdersLoading, setFetchOrdersLoading] = useState(true);
    const [selectedItemDetail, setSelectedItemDetail] = useState(null);
    const [viewItemsDetail, setViewItemsDetail] = useState('list');
    const [activeTab, setActiveTab] = useState('orders');
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState({
        firstname: '',
        email: '',
        address: ''
    });



    // --- 1. PROTECTED ROUTE LOGIC ---
    useEffect(() => {
        // When Redux and Context both are confirm that user is not exist then user move to login page
        const checkAuth = async () => {
            if (authStatus === false) {
                navigate('/Login');
            } else {
                setFetchUserLoading(false);
            }
        };
        checkAuth();
    }, [authStatus, navigate]);



    // --- 2. DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            const getUser = await authservice.getCurrentUser();

            if (!getUser || !getUser?.uid) {
                setFetchOrdersLoading(false);
                setFetchUserLoading(false)
                return;

            } else {

                try {
                    setFetchOrdersLoading(true);

                    // Orders Fetch
                    const q = query(
                        collection(database, "orders"),
                        where("userId", "==", getUser.uid)
                    );
                    const orderSnap = await getDocs(q);
                    const ordersList = orderSnap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setOrders(ordersList);



                } catch (error) {
                    console.error("Firestore Error:", error);
                } finally {
                    setFetchOrdersLoading(false)
                    setFetchUserLoading(false)
                }
            }
        };


        fetchData();

    }, []);



    // --- 3. PROFILE DATA FETCHING ---
    useEffect(() => {
        (async () => {
            setFetchUserLoading(true)
             const getUser = await authservice.getCurrentUser();


            if (!getUser?.uid) {
                setFetchUserLoading(false);
                return
            }
            try {
                setFetchUserLoading(true);

                const userDocRef = doc(database, "users", getUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const firebaseData = userDocSnap.data();

                    const saveAddress = firebaseData.shippingAddress?.address || ""

                    setUserData({
                        firstname: firebaseData.firstname || getUser.displayName || "",
                        email: firebaseData.email || getUser.email || "",
                        address: saveAddress

                    })
                } else {
                    setUserData({
                        firstname: getUser.displayName || "",
                        email: getUser.email || "",
                        address: ""
                    })
                }
            } catch (error) {
                console.error("Profile load error :", error);
            } finally {
                setFetchUserLoading(false)
            }
        })()
    }, [currentUser?.uid, authStatus])


    // --- 4. HANDLERS ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!currentUser?.uid) return;

        try {
            setFetchUserLoading(true)
            const userRef = doc(database, "users", currentUser.uid);

            const updatedPayload = {
                firstname: userData.firstname,
                email: userData.email,
                shippingAddress: {
                    address: userData.address.trim(),
                    updatedAt: new Date().toISOString()
                }
            };
            await setDoc(userRef, updatedPayload, { merge: true })

            setIsProfileEditing(false);
            toast.success("Profile Updated!");

        } catch (error) {
            console.log("Profile update error:", error)
            toast.error("Update failed");
        } finally {
            setFetchUserLoading(false)
        }
    };

    const handleLogout = async () => {
        try {
            await authservice.logout(); // Backend logout
            dispatch(sliceLogout());    // Redux state update (status -> false)
            toast.success("Logged out successfully!");
            navigate('/');

        } catch (error) {
            console.log("User logout error:", error)
            toast.error("Logout failed");
        }
    };

    // Jab tak auth resolve nahi hoti, blank ya spinner dikhayein
    if (fetchUserLoading && !currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Verifying Session</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white pt-10">
            <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">

                    {/* SIDEBAR */}
                    <div className="w-full md:w-64 flex flex-col gap-2">
                        <div className="mb-5 px-4">
                            <h1 className="text-2xl font-bold italic tracking-tighter text-slate-900 uppercase">My Account</h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-1">DASHBOARD</p>
                        </div>

                        <button
                            onClick={() => { setActiveTab('orders'); setViewItemsDetail('list'); }}
                            className={`text-left px-4 py-3 rounded-xl transition font-bold text-sm ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Order History
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`text-left px-4 py-3 rounded-xl transition font-bold text-sm ${activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Profile Details
                        </button>

                        <div className="border-t border-slate-100 mt-4 pt-4">
                            <button onClick={handleLogout} className="text-left px-4 py-2 text-red-500 hover:bg-red-50 w-full rounded-xl transition font-bold text-xs uppercase tracking-widest">
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1">
                        {activeTab === 'orders' && (
                            <div className="animate-in fade-in duration-500">
                                {viewItemsDetail === 'list' ? (
                                    <>
                                        <h2 className="text-xl font-bold mb-6">Past Orders</h2>

                                        {fetchOrdersLoading ? (

                                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                                <div className="flex h-screen w-full justify-center">
                                                    <Icon
                                                        icon="svg-spinners:bars-rotate-fade"
                                                        className="text-gray-700 size-10"
                                                    />
                                                </div>
                                            </div>

                                        ) : (
                                            <div className="space-y-4">
                                                {orders.length > 0 ? orders.map((order) => (
                                                    <div key={order.id} className="border border-slate-100 rounded-2xl p-6 flex justify-between items-center hover:border-slate-300 transition group">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                                                            <p className="font-bold text-lg">#{order.id.slice(0, 8)}</p>
                                                            <p className="text-sm text-slate-500">${order.totalPrice?.toFixed(2)} • {order.orderStatus}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItemDetail(order);
                                                                setViewItemsDetail('details');
                                                            }}
                                                            className="bg-slate-100 text-slate-900 px-6 py-2 rounded-full text-xs font-bold hover:bg-slate-900 hover:text-white transition"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                )) : <p className="text-slate-400 font-medium">No orders found.</p>}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="animate-in slide-in-from-right duration-500">
                                        <button onClick={() => setViewItemsDetail('list')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 mb-6 uppercase tracking-widest">← Back to list</button>

                                        <h2 className="text-3xl font-bold mb-8">Order Details</h2>

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">

                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detailed View</p>

                                                <h2 className="text-3xl font-bold tracking-tighter">
                                                    #{selectedItemDetail?.id?.slice(0, 10).toUpperCase()}
                                                </h2>
                                            </div>

                                            <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                                <p className="font-bold uppercase text-xs tracking-wide ">
                                                    {selectedItemDetail?.orderStatus || 'Processing'}
                                                </p>
                                            </div>
                                        </div>


                                        {/* Products in this Order */}
                                        <div className="space-y-6 border-t border-slate-100 pt-8">

                                            {selectedItemDetail.orderItems?.map((product, idx) => (

                                                <div key={idx} className="flex gap-6 items-center group">
                                                    {/* Product Image */}
                                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={product?.imageUrl}
                                                            alt={product.productName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-slate-900 leading-tight">{product?.productName}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            Size: {product.size} <span className="mx-2">|</span> Color: {product.color}
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-500 mt-1">Quantity: {product.quantity}</p>
                                                    </div>


                                                    {/* Individual Item Total */}

                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-900 text-lg">
                                                            ${product?.finalPrice}
                                                            {/* ${((selectedItemDetail?.totalPrice || 0) - (selectedItemDetail?.shippingFee || 0)).toFixed(2)} */}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>


                                        {/* Order Summary Footer */}

                                        {selectedItemDetail && (
                                            <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">


                                                {/* Shipping Address */}
                                                <div className="space-y-4">
                                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Shipping Address</h5>
                                                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                            {selectedItemDetail?.customerInfo?.address || "No address found"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Pricing Breakdown */}
                                                <div className="space-y-3 bg-slate-900 p-8 rounded-[2rem] text-white">

                                                    {/* SubTotal */}
                                                    <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                        <span>Subtotal</span>
                                                        <span>
                                                            ${(selectedItemDetail.orderItems?.reduce((total, item) => total + (item.finalPrice * (item.quantity || 1)), 0))?.toFixed(2)}
                                                        </span>
                                                    </div>

                                                    {/* Shipping fee */}
                                                    <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                        <span>Shipping</span>
                                                        <span>${selectedItemDetail?.shippingFee?.toFixed(2)}</span>
                                                        {/* <span>Free</span> */}
                                                    </div>

                                                    <div className="h-[1px] bg-slate-800 my-4"></div>
                                                    <div className="flex justify-between items-baseline">
                                                        <span className="text-lg font-bold italic tracking-tighter uppercase text-slate-400">Total Paid</span>
                                                        <span className="text-3xl font-bold">${selectedItemDetail?.totalPrice?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in duration-500 max-w-xl">

                                <h2 className="text-xl font-bold mb-8">My Details</h2>

                                {userData && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                            <div>
                                                <label
                                                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1"
                                                >
                                                    First Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={userData.firstname || ''}
                                                    onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                                                    disabled={!isProfileEditing}
                                                    className={`w-full p-4 rounded-2xl border ${isProfileEditing ? 'border-slate-200 bg-white' : 'border-transparent bg-slate-50'} transition-all  
                                                    ${isProfileEditing
                                                            ? 'border-slate-200 bg-white cursor-text '
                                                            : 'border-transparent bg-slate-50 cursor-not-allowed text-slate-400'
                                                        }`} />
                                            </div>

                                            <div>
                                                <label
                                                    className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={userData.email || ''}
                                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                    disabled={!isProfileEditing}
                                                    className={`w-full p-4 rounded-2xl border transition-all 
                                                        ${isProfileEditing
                                                            ? 'border-slate-200 bg-white cursor-text '
                                                            : 'border-transparent bg-slate-50 cursor-not-allowed text-slate-400'
                                                        }`} />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                className="text-[10px] font-bold uppercase tracking-widest block mb-2 ml-1 text-slate-400"
                                            >
                                                Shipping Address
                                            </label>

                                            <textarea
                                                value={userData.address || ''}
                                                disabled={!isProfileEditing}
                                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                                placeholder={isProfileEditing ? "Enter your permanent shipping address..." : "No address saved yet."}
                                                className={`w-full p-4 rounded-2xl border transition-all rows="3" 
                                                     ${isProfileEditing
                                                        ? 'border-slate-200 bg-white cursor-text '
                                                        : 'border-transparent bg-slate-50 cursor-not-allowed text-slate-400'
                                                    }`} />
                                        </div>

                                        <div className="pt-4 flex items-center gap-4">
                                            {isProfileEditing ? (
                                                <>
                                                    <button
                                                        onClick={handleProfileUpdate}
                                                        className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-sm shadow-lg shadow-slate-200"
                                                    >
                                                        Save Changes
                                                    </button>

                                                    <button
                                                        onClick={() => setIsProfileEditing(false)}
                                                        className="text-slate-400 font-bold text-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setIsProfileEditing(true)}
                                                    className="border-2 border-slate-900 px-10 py-4 rounded-full font-bold text-sm hover:bg-slate-900 hover:text-white transition-all duration-300"
                                                >
                                                    Edit Profile
                                                </button>

                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Account;
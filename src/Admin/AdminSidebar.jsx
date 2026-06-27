import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@iconify/react'

const AdminSidebar = () => {
    const location = useLocation();

    const [isEcommerceOpen, setIsEcommerceOpen] = useState(
        location.pathname.startsWith('/admin-dashboard/products') ||
        location.pathname.startsWith('/admin-dashboard/add-products')
    );

    return (
        <div className="w-[290px] min-w-[290px] border-r border-gray-200 h-screen overflow-y-auto bg-white flex flex-col">

            {/* Logo Section */}
            <div className="p-5 sticky top-0 z-10 bg-white">
                <Link to="/admin-dashboard" className="flex items-center justify-center">
                    <img
                        src="/src/assets/logo/Logo TR.png"
                        alt="Kindsole Logo"
                        className="h-8 w-auto object-contain"
                    />
                </Link>
            </div>


            {/* Menu Items */}
            <div className='px-8'>

                <div className='pt-6 uppercase opacity-40 text-[13px] font-bold tracking-wider'>
                    Menu
                </div>


                <div className='pt-4 w-full'>

                    {/* E-Commerce Header Button */}
                    <button
                        onClick={() => setIsEcommerceOpen(!isEcommerceOpen)}
                        className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 border-none transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Icon icon="lucide:shopping-bag" className="size-4 text-gray-500" />
                            <span>E-Commerce</span>
                        </div>

                        <Icon
                            icon="heroicons:chevron-down-20-solid"
                            className={`size-5 text-gray-400 transition-transform duration-200 ${isEcommerceOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                        />
                    </button>


                    <div className={`mt-1 pl-4 space-y-1 transition-all duration-200 overflow-hidden ${isEcommerceOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}>

                        {/* AllProducts  */}
                        <Link
                            to="/admin-dashboard/products"
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md 
                                ${location.pathname === '/admin-dashboard/products' ?
                                    'bg-gray-200 text-gray-900' :
                                    'text-gray-700'
                                }`}
                        >
                            <Icon icon="icon-park-outline:ad-product" className="size-4" />
                            <span>Products</span>
                        </Link>


                        {/* Add Product  */}
                        <Link
                            to="/admin-dashboard/add-products"
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md 
                                ${location.pathname === '/admin-dashboard/add-products'
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'text-gray-700'}`}
                        >
                            <Icon icon="mdi:cart" className="size-4" />
                            <span>Add Product</span>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar













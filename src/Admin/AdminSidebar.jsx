import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// Iconify import karein
import { Icon } from '@iconify/react'

const AdminSidebar = () => {
    return (
        <div className="w-[290px] min-w-[290px] border-r border-gray-200 h-screen overflow-y-auto bg-white flex flex-col ">

            <div className="p-5 sticky top-0 z-10 bg-white ">

                <Link
                    to="/admin-dashboard"
                    className="flex items-center justify-center  ">
                    <img
                        src="/src/assets/logo/Logo TR.png"
                        alt="Kindsole Logo"
                        className="h-8 w-auto object-contain" />
                </Link>

            </div>

            <div className='px-8 '>
                <div className='pt-6 uppercase opacity-40 text-[13px]'>
                    Menu
                </div>


                <div className='pt-6 w-full'>
                    <Menu as="div" className="relative">
                        {({ open }) => (
                            <>
                                <MenuButton className="inline-flex w-full items-center justify-center gap-x-2 rounded-md  px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 border-none">
                                    E-Commerce

                                    <Icon
                                        icon="heroicons:chevron-down-20-solid"
                                        className={`size-5 text-gray-400  transition-transform duration-200 ${open ? 'rotate-0' : ' rotate-180'
                                            }`}
                                    />
                                </MenuButton>



                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
                                >
                                    <div className="py-1">

                                        <MenuItem>
                                            {({ focus }) => (
                                                <a
                                                    href="/admin-dashboard/products"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                        }`}
                                                >
                                                    <Icon icon="icon-park-outline:ad-product" className="size-4" />
                                                    Products
                                                </a>
                                            )}
                                        </MenuItem>

                                        <MenuItem>
                                            {({ focus }) => (
                                                <Link to="/admin-dashboard/add-products"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                    <Icon icon="mdi:cart" className="size-4" />
                                                    Add Product
                                                </Link>

                                            )}
                                        </MenuItem>


                                    </div>
                                </MenuItems>
                            </>
                        )}
                    </Menu>
                </div>
            </div>

        </div>
    )
}

export default AdminSidebar
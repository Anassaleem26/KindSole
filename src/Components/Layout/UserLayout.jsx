import React, { useEffect, useState } from 'react'
import { Footer, Navbar } from '../../index'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authservice from '../../Firebase/Auth-services'
import { login, logout } from '../../Store/authSlice'
import { Icon } from '@iconify/react';

function UserLayout() {

    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        authservice.getCurrentUser().then(async (userData) => {
            if (userData) {

                const userRole = await authservice.getUserRole(userData.uid)

                const cleanUserData = {
                    uid: userData.uid,
                    email: userData.email,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL,
                    role: userRole,
                };
                dispatch(login(cleanUserData));

            } else {
                dispatch(logout())
            }
        })
            .finally(() => setLoading(false))
    }, [])


    return loading ?
       <div className="flex h-screen w-full items-center justify-center">
        <Icon
            icon="svg-spinners:blocks-shuffle-3"
            className="text-gray-700 size-12" // Increased size slightly for better visibility
        />
    </div>
        : (
            <div>
                <Navbar />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        )
}

export default UserLayout
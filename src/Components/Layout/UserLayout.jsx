import React, { useEffect, useState } from 'react'
import { Footer, Navbar } from '../../index'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authservice from '../../Firebase/Auth-services'
import { login, logout } from '../../Store/authSlice'

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
        <div className='container mx-auto py-19 text-center'>
            Loading.....
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
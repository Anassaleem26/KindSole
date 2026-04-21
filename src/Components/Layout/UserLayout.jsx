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
        authservice.getCurrentUser().then((userData) => {
            if (userData) {

                const cleanUserData = {
                    uid: userData.uid,
                    email: userData.email,
                    displayName: userData.displayName,
                    photoURL: userData.photoURL
                };
                dispatch(login(cleanUserData));

            } else {
                dispatch(logout())
            }
        })
            .finally(() => setLoading(false))
    }, [])


    return !loading ? (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    ) : null
}

export default UserLayout
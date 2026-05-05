import React, { useState } from 'react'
import CartDrawer from './CartDrawer'
import Navbar from '../Layout/Navbar'

function LinkNavbarCartDrawer() {
    const [isCartOpen, setIsCartOpen] = useState(false)
    
    return (
        <div>
            <Navbar onCartClick={() => setIsCartOpen(true)} />

            <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        </div>
    )
}

export default LinkNavbarCartDrawer
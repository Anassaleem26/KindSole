import React, { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        
        const saveCart = localStorage.getItem("my_cart_data");
        return saveCart ? JSON.parse(saveCart) : []
    });
    console.log(cartItems);

    useEffect(() => {
        localStorage.setItem("my_cart_data", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product) => {

        setCartItems((prev) => {

            const existingItem = prev.find(
                item => item.cartId === product.cartId
                    && item.selectedSize === product.selectedSize
                    && item.color === product.color
            )

            if (existingItem) {
                return prev.map((item) =>
                    item.cartId === product.cartId
                        && item.selectedSize === product.selectedSize
                        && item.color === product.color
                        ? { ...item, quantity: item.quantity + 1 }
                        : item)
            }
            return [...prev, { ...product, quantity: 1 }]
        })
    }
    

    const decreaseQty = (cartId) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.cartId === cartId
                    && item.quantity > 1

                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        )

    }

    const deleteFromCart = (cartId) => {
        setCartItems((prev) => prev.filter((item) => 
            item.cartId !== cartId
        ))
    }

    const cartCount = cartItems.length;

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem("my_cart_data")
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, decreaseQty, deleteFromCart, cartCount, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}
export const useCart = () => useContext(CartContext);
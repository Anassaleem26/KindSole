import React, { createContext, useContext, useEffect, useState } from "react"
import authservice from "../Firebase/Auth-services";
import configservice from "../Firebase/Config-services";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [cartItems, setCartItems] = useState(() => {

        const saveCart = localStorage.getItem("my_cart_data");
        return saveCart ? JSON.parse(saveCart) : []
    });

    useEffect(() => {
        localStorage.setItem("my_cart_data", JSON.stringify(cartItems))
    }, [cartItems])


    useEffect(() => {
        (async () => {
            try {
                const user = await authservice.getCurrentUser()
                setCurrentUser(user)

            } catch (error) {
                console.log("Context API :: getCurrentUser :: error", error);
            }
        })()
    }, [])

// console.log("Context currentuser", currentUser);


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
            } else {
                return [...prev, { ...product, quantity: 1 }]
            }
           
        })
    }


    const decreaseQty = (cartId) => {
        setCartItems((prev) => {
            return prev.map(item =>
                item.cartId === cartId
                    && item.quantity > 1

                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        })
    }

    const deleteFromCart = (cartId) => {

        setCartItems((prev) => {
           return prev.filter(item =>
                item.cartId !== cartId
            )

        })

    }

    const cartCount = cartItems.length;

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem("my_cart_data")
    }


    useEffect(() => {
        (async () => {
            if (currentUser?.uid && cartItems.length > 0) {
                try {
                    await configservice.transferCartItemToBackend(currentUser, cartItems)
                } catch (error) {
                    console.error("Cart sync failed:", error);
                }
            }
        })()
    }, [currentUser, cartItems])

    return (
        <CartContext.Provider value={{ cartItems, addToCart, decreaseQty, deleteFromCart, cartCount, clearCart, currentUser }}>
            {children}
        </CartContext.Provider>
    )
}
export const useCart = () => useContext(CartContext);
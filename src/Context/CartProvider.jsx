import React, { useEffect, useState } from "react"
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saveCart = localStorage.getItem("my_cart_data");
        return saveCart ? JSON.parse(saveCart) : []
    });

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

    const decreaseQty = (product) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.cartId === product.cartId
                    && item.selectedSize === product.selectedSize
                    && item.color === product.color && item.quantity > 1

                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        )

    }

    const deleteFromCart = (product) => {
        setCartItems((prev) => prev.filter((item) => !(
            item.cartId === product.cartId
            && item.selectedSize === product.selectedSize
            && item.color === product.color
        )))
    }

    const cartCount = cartItems.reduce((total, item) => {
        // console.log(total, item);
        // return total + (item.quantity || 0)
    }, 0)

    // console.log(cartItems);
    return (
        <CartContext.Provider value={{ cartItems, addToCart, decreaseQty, deleteFromCart, cartCount }}>
            {children}
        </CartContext.Provider>
    )
}
// export const useCart = () => useContext(CartContext);

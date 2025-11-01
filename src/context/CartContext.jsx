import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const raw = localStorage.getItem("cart:v1");
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("cart:v1", JSON.stringify(cart));
        } catch (e) { }
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existing = prev.find((p) => p._id === product._id);
            if (existing) return prev.map((p) => (p._id === product._id ? { ...p, qty: p.qty + quantity } : p));
            return [...prev, { ...product, qty: quantity }];
        });
    };

    const updateQty = (productId, qty) => {
        setCart((prev) => prev.map((p) => (p._id === productId ? { ...p, qty } : p)));
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((p) => p._id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;



import { createSlice } from "@reduxjs/toolkit";

const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
};

const getTotalCartFromLocalStorage = () => {
    const totalCart = localStorage.getItem("totalCart");
    return totalCart ? parseInt(totalCart) : 0;
};

const getTotalPriceFromLocalStorage = () => {
    const totalPrice = localStorage.getItem("totalPrice");
    return totalPrice ? parseFloat(totalPrice) : 0;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: getCartFromLocalStorage(),
        totalCart: getTotalCartFromLocalStorage(),
        totalPrice: getTotalPriceFromLocalStorage()
    },
    reducers: {
        addToCart: (state, action) => {
            const productToAdd = action.payload.product;
            const existingItem = state.cart.find(item => item.product.id === productToAdd.id);

            if (existingItem) {
                // Product exists, just update the quantity
                existingItem.quantity += 1; // Assuming you always add one product at a time
            } else {
                // New product, add to the cart
                state.cart.push({ product: productToAdd, quantity: 1 });
            }

            // Also, update total price and total cart count
            state.totalPrice += (productToAdd.price-productToAdd.price*(productToAdd.sale/100));
            state.totalCart += 1;

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(state.cart));
            localStorage.setItem("totalCart", state.totalCart.toString());
            localStorage.setItem("totalPrice", state.totalPrice.toString());
        },
        updateCart: (state, action) => {
            const { id, quantity } = action.payload;
            const updatedCart = state.cart.map(item => {
                if (item.product.id === id) {
                    return { ...item, quantity };
                }
                return item;
            });

            const updatedTotalPrice = updatedCart.reduce((total, item) => total + item.product.price * item.quantity, 0);
            const updatedTotalCart = updatedCart.reduce((total, item) => total + item.quantity, 0);

            // Update state
            state.cart = updatedCart;
            state.totalPrice = updatedTotalPrice;
            state.totalCart = updatedTotalCart;

            // Update localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            localStorage.setItem("totalCart", state.totalCart.toString());
            localStorage.setItem("totalPrice", state.totalPrice.toString());
        },

        removeFromCart: (state, action) => {
            const itemToRemove = state.cart.find(item => item.product.id === action.payload.id);

            if (itemToRemove) {
                const updatedCart = state.cart.filter(item => item.product.id !== action.payload.id);
                state.cart = updatedCart;
                state.totalPrice -= itemToRemove.product.price * itemToRemove.quantity;
                state.totalCart -= itemToRemove.quantity;

                // Update localStorage
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                localStorage.setItem("totalCart", state.totalCart.toString());
                localStorage.setItem("totalPrice", state.totalPrice.toString());
            }
        },
        clearCart: (state, action) => {
            // Clear cart and reset total price and total cart count to zero
            state.cart = [];
            state.totalCart = 0;
            state.totalPrice = 0;

            // Update localStorage
            localStorage.setItem("cart", "[]");
            localStorage.setItem("totalCart", "0");
            localStorage.setItem("totalPrice", "0");
        }
    }

});

export default cartSlice.reducer;
export const { addToCart, removeFromCart, clearCart, updateCart } = cartSlice.actions;

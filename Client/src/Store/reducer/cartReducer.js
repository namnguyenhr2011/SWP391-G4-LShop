import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    items: {},
    compareItems: {}
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { userId, item } = action.payload;

            if (!state.items[userId]) {
                state.items[userId] = [];
            }

            const existingItem = state.items[userId].find(cartItem => cartItem.productId === item.productId);

            if (existingItem) {
                const newQuantity = existingItem.quantity + (item.quantity || 1);
                if (newQuantity <= 10) {
                    existingItem.quantity = newQuantity;
                } else {
                    existingItem.quantity = 10;
                }
            } else {
                const newItem = {
                    ...item,
                    quantity: Math.min(item.quantity || 1, 10),
                    originalPrice: item.originalPrice || item.price,
                    isSale: item.isSale || false
                };

                state.items[userId].push(newItem);
            }
        },

        removeFromCart: (state, action) => {
            const { userId, productId } = action.payload;
            if (state.items[userId]) {
                state.items[userId] = state.items[userId].filter(item => item.productId !== productId);
            }
        },

        clearCart: (state, action) => {
            const { userId } = action.payload;
            if (state.items[userId]) {
                state.items[userId] = [];
            }
        },

        increaseQuantity: (state, action) => {
            const { userId, productId } = action.payload;
            const item = state.items[userId]?.find(item => item.productId === productId);
            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (state, action) => {
            const { userId, productId } = action.payload;
            const item = state.items[userId]?.find(item => item.productId === productId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
    },
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
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

        addToCompare: (state, action) => {
            const { userId, productId, product } = action.payload;

            if (!state.compareItems[userId]) {
                state.compareItems[userId] = [];
            }

            // Kiểm tra nếu sản phẩm đã có trong danh sách so sánh
            const existingCompareItem = state.compareItems[userId].find(item => item.productId === productId);

            if (!existingCompareItem) {
                state.compareItems[userId].push(product);
            }
        },

        // Loại bỏ sản phẩm khỏi danh sách so sánh
        removeFromCompare: (state, action) => {
            const { userId, productId } = action.payload;
            if (state.compareItems[userId]) {
                state.compareItems[userId] = state.compareItems[userId].filter(item => item.productId !== productId);
            }
        },

        // Xóa toàn bộ sản phẩm trong danh sách so sánh
        clearCompare: (state, action) => {
            const { userId } = action.payload;
            if (state.compareItems[userId]) {
                state.compareItems[userId] = [];
            }
        }

    },
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, addToCompare, removeFromCompare, clearCompare } = cartSlice.actions;
export default cartSlice.reducer;
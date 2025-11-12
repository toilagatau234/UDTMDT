// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'

const getInitialState = () => {
    const cart = localStorage.getItem('cartItems')
    return cart ? JSON.parse(cart) : { items: [], totalQuantity: 0 }
};

const initialState = getInitialState();

// Hàm trợ giúp để lưu state
const saveStateToLocalStorage = (state) => {
    localStorage.setItem('cartItems', JSON.stringify(state));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.product === newItem.product);
            
            if (!existingItem) {
                state.items.push({
                    product: newItem.product,
                    name: newItem.name,
                    image: newItem.image,
                    price: newItem.price,
                    originalPrice: newItem.originalPrice,
                    stockQuantity: newItem.stockQuantity,
                    quantity: newItem.quantity,
                    selected: true // Tự động chọn khi thêm
                });
            } else {
                existingItem.quantity += newItem.quantity;
            }

            state.totalQuantity += newItem.quantity;
            message.success('Đã thêm vào giỏ hàng!');
            saveStateToLocalStorage(state);
        },
        
        updateQuantity: (state, action) => {
            const { product, quantity } = action.payload;
            const itemToUpdate = state.items.find(item => item.product === product);
            
            if (itemToUpdate) {
                const diff = quantity - itemToUpdate.quantity;
                state.totalQuantity += diff;
                itemToUpdate.quantity = quantity;
                saveStateToLocalStorage(state);
            }
        },
        
        removeFromCart: (state, action) => {
            const productId = action.payload;
            const itemToRemove = state.items.find(item => item.product === productId);
            
            if (itemToRemove) {
                state.totalQuantity -= itemToRemove.quantity;
                state.items = state.items.filter(item => item.product !== productId);
                saveStateToLocalStorage(state);
            }
        },

        // === CÁC HÀM MỚI CHO LOGIC CHỌN ===
        toggleSelectItem: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.product === productId);
            if (item) {
                item.selected = !item.selected;
                saveStateToLocalStorage(state);
            }
        },

        toggleSelectAll: (state, action) => {
            const isSelected = action.payload; // true hoặc false
            state.items.forEach(item => {
                item.selected = isSelected;
            });
            saveStateToLocalStorage(state);
        }
    },
})

export const { 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    toggleSelectItem, 
    toggleSelectAll 
} = cartSlice.actions
export default cartSlice.reducer
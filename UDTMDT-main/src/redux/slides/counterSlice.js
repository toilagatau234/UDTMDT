import { createSlice } from '@reduxjs/toolkit'

// 🧩 initialState tương tự interface CounterState
const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// 🧩 Xuất action creators và reducer giống TypeScript
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer

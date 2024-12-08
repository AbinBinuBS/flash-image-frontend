import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: localStorage.getItem('token') || "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        accessToken: (state, action) => {
            state.value = action.payload;
            localStorage.setItem('token', action.payload); 
        },
        clearToken: (state) => {
            state.value = "";
            localStorage.removeItem('token'); 
        },
    },
});

export const { accessToken, clearToken } = userSlice.actions;

export default userSlice.reducer;

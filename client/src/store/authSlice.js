import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, 
    userAuth: false,
    token: null,
    isAdmin: false
  },

  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.userAuth = true;
      state.token = action.payload.accessToken || action.payload.token;
      state.isAdmin = action.payload.user?.role === 'admin';
      
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.accessToken || action.payload.token);
    },
    logout(state) {
      state.user = null; 
      state.userAuth = false;
      state.token = null;  
      state.isAdmin = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { login, logout, updateUser } = authSlice.actions;

export const selectUser = (state) => state.auth.user; 
export const selectUserAuth = (state) => state.auth.userAuth;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.isAdmin;

export default authSlice.reducer;

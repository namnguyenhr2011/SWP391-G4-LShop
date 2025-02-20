import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
    user: { _id: "", token: "" },
    notification: 0
};

export const doLogin = createAction('user/doLogin');
export const doLogout = createAction('user/doLogout');

const userReducer = createReducer(initialState, builder => {
    builder.addCase(doLogin, (state, action) => {
        state.user = action.payload;
    }).addCase(doLogout, (state) => {
        state.user = initialState.user;
    });
});

export default userReducer;
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; // Dùng sessionStorage
import userReducer from './reducer/userReducer';
import cartReducer from './reducer/cartReducer';

const persistConfig = {
    key: 'root',
    storage: storageSession, // Sử dụng sessionStorage thay vì localStorage
};

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { currencyConvReducer } from './reducers';

export const store = configureStore({
    reducer: {
      currency: currencyConvReducer, 
    },
  });
  

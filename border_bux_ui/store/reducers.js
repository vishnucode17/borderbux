// /store/reducers.js
import { SET_CURRENCY_CONV_DATA } from './actions';

const initialState = {
  apiData: null,
};

export const currencyConvReducer = (state = initialState, action) => {
    
  switch (action.type) {
    case SET_CURRENCY_CONV_DATA:
      return {
        ...state,
        apiData: action.payload,
      };
    default:
      return state;
  }
};

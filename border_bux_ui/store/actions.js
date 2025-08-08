// /store/actions.js
import { getCurrencyConversion } from '@/apis/currency';

// Action Types
export const SET_CURRENCY_CONV_DATA = 'SET_CURRENCY_CONV_DATA';

// Action Creator to fetch data
export const getCurrencyConversionAction = () => async (dispatch) => {
    console.log("getCurrencyConversionAction called"); // Add this to see if it's being called
    try {
      const data = await getCurrencyConversion();
      console.log("data received from API:", data); // This should log if the API call works
      dispatch({
        type: SET_CURRENCY_CONV_DATA,
        payload: data,
      });
    } catch (error) {
      console.error('Failed to fetch data', error); // This should catch any errors
    }
  };
  
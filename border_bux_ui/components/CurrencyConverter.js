import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/currencyConverter/CurrencyConverter.module.css';
import getCurrencyConversion from '@/apis/currency';
import US from 'country-flag-icons/react/3x2/US';
import IN from 'country-flag-icons/react/3x2/IN';  // Added flag for INR

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000); // Default USD amount
  const [exchangeRate, setExchangeRate] = useState(null); // Store the INR exchange rate
  const [fees] = useState(1600 * 0); // Fees can be adjusted as needed
  const [conversionAmount, setConversionAmount] = useState(0); // Store the final conversion amount
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [ rate, setRate] = useState(null);
  const [usdtAmount, setUsdtAmount] = useState(null);
  const [transactionDetails, setTranscationDetails] = useState(null);
  const createtransaction = async () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        router.push('/login'); // Redirect to login if token is not found
        return;
    }

    // try {
        const apiBody = {
            "transactionType": "onramp",
            "fromCurrency": "EUR",
            "toCurrency": "USDT",
            "fromAmount": String(amount),
            "chain": "matic20",
            "paymentMethodType": "SEPA_BANK_TRANSFER",
            "toAmount": String(usdtAmount),
            "rate": String(rate)
        };
        console.log(apiBody)
        const response = await fetch('http://127.0.0.1:8000/transactions/create-transaction', {  // Update the API URL
            method: 'POST', // Corrected to POST as you're sending a body
            headers: {
                'Authorization': `Bearer ${token}`, // Pass the token in the headers
                'Content-Type': 'application/json' // Ensure you're sending JSON data
            },
            body: JSON.stringify(apiBody) // Send the apiBody in the request
        });
        console.log(response)
        if (response.status === 401) {
            // If the response is 401 (Unauthorized), redirect to login page
            setError("Session expired. Please log in again.");
            localStorage.removeItem('token'); // Clear the expired token
            router.push('/login'); // Redirect to login page
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create transaction.');
        }

        const data = await response.json();
        setTranscationDetails(data); // Set KYC details to state
        // setKycUrl(data.kyc_url); // Store the KYC URL in the state
        alert(`Transaction ID: ${transactionDetails.transactionId}`)
        // If the status is 'complete', redirect to home page
        // if (data.status === 'complete') {
        //     router.push('/'); // Redirect to home page
        // }
    // } catch (err) {
    //     setError(err.message); // Handle any errors
    // } finally {
    //     setIsLoading(false); // Ensure loading state is reset after the request
    // }
};

  // When the component mounts, fetch the conversion data
  useEffect(() => {
    async function fetchCurrency() {
      // Pass the dynamic amount to the getCurrencyConversion function
      const conversionData = await getCurrencyConversion(amount);
      if (conversionData.error) {
        console.error(conversionData.error); 
      } else {
        setExchangeRate(conversionData.amount); // Set the exchange rate to INR
        setRate(conversionData.rate);
        setUsdtAmount(conversionData.usdtAmount);
      }
    }
    fetchCurrency();
  }, [amount, rate, usdtAmount]); // Fetch data again whenever the amount changes

  useEffect(() => {
    // Recalculate conversion amount whenever the exchangeRate or amount changes
    if (exchangeRate) {
      const calculatedAmount = (amount * exchangeRate - fees).toFixed(2);
      setConversionAmount(calculatedAmount);
    }
  }, [amount, exchangeRate, fees]); // Dependencies: amount, exchangeRate, and fees

  return (
    <div className={styles.converterContainer}>
      <div className={styles.converterBox}>
        <div className={styles.inputRow}>
          <div className={styles.amountInput}>
            <span className={styles.currencySymbol}>$</span>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))} 
            />
          </div>
          <div className={styles.currencyDropdown}>
            <button className={styles.currencyButton}>
              <US title="United States" className="..." />
              <img src="/path-to-flag-us.png" alt="US flag" className={styles.flagImage} /> US
            </button>
          </div>
        </div>

        <p className={styles.exchangeRate}>
          Exchange rate: 1 Dollar = {exchangeRate || 'Loading...'} INR
        </p>

        <div className={styles.paymentMethod}>
          <p>Payment by</p>
          <button className={styles.paymentButton}>Bank Transfer</button>
        </div>

        <div className={styles.outputRow}>
          <div className={styles.amountOutput}>
            <span className={styles.currencySymbol}>₹</span>
            <input 
              type="text" 
              value={exchangeRate} 
              readOnly 
            />
          </div>
          <div className={styles.currencyDropdown}>
            <button className={styles.currencyButton}>
              <IN title="India" className="..." />
              <img src="/path-to-flag-inr.png" alt="India flag" className={styles.flagImage} /> INR
            </button>
          </div>
        </div>

        <button className={styles.sendButton} onClick={createtransaction}>Send Now</button>
      </div>
    </div>
  );
}

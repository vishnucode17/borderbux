export default async function getCurrencyConversion(USD_AMOUNT) {
    const currencyConversionAPIURL = "http://localhost:8000/transactions/get-quote";
  
    const onrampRequest = {
      transactionType: "onramp",
      fromCurrency: "EUR",
      toCurrency: "USDT",
      fromAmount: String(USD_AMOUNT),  // Example: 1000 USD
      chain: "matic20",
      paymentMethodType: "SEPA_BANK_TRANSFER"
    };
  
    const offrampRequest = {
      transactionType: "offramp",
      fromCurrency: "USDT",
      toCurrency: "INR",
      fromAmount: "1000",  // This will be dynamically set after the onramp conversion
      chain: "matic20",
      paymentMethodType: "UPI"
    };
  
    try {
      // First, get the Onramp quote (USD -> USDT)
      const onrampResponse = await fetch(currencyConversionAPIURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onrampRequest),
      });
  
      if (!onrampResponse.ok) {
        throw new Error(`Onramp request failed: ${onrampResponse.status}`);
      }
  
      const onrampData = await onrampResponse.json();
  
      // Ensure the expected response structure for onramp
      if (onrampData &&  onrampData.toAmount) {
        const usdtAmount = onrampData.toAmount;
  
        // Now, use the USDT amount for the Offramp request (USDT -> INR)
        offrampRequest.fromAmount = String(usdtAmount);
        // console.log(offrampRequest)
        // Second, get the Offramp quote (USDT -> INR)
        const offrampResponse = await fetch(currencyConversionAPIURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(offrampRequest),
        });
  
        if (!offrampResponse.ok) {
          throw new Error(`Offramp request failed: ${offrampResponse.status}`);
        }
  
        const offrampData = await offrampResponse.json();
        console.log(offrampData);
        // Ensure the expected response structure for offramp
        if (offrampData) {
          return {
            amount: offrampData.toAmount,  // Return the INR rate
            rate: onrampData.rate,
            usdtAmount: usdtAmount
          };
        } else {
          throw new Error("Invalid offramp response structure");
        }
      } else {
        throw new Error("Invalid onramp response structure");
      }
  
    } catch (error) {
      console.error('Currency conversion failed:', error.message);
      return { error: error.message };  // Return error object for UI handling
    }
  }
  
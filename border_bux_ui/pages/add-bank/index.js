import { useState } from 'react';

export default function AddBankPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bankUrl, setBankUrl] = useState(null); // To store the bank URL returned by the API

    // Function to call the API and open the link in a new tab
    const addBank = async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); // Get the token from localStorage
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setIsLoading(false);
                router.push('/login'); // Redirect to login if token is not found
                return;
            }
        try {
            const response = await fetch('http://localhost:8000/transactions/add-bank', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Pass the token in the headers
                },
                body: JSON.stringify({ /* any data if needed */ }),
            });

            const data = await response.json();

            if (response.ok) {
                setBankUrl(data.bankUrl);
                // Open the link in a new tab
                window.open(data.bankUrl, '_blank');
            } else {
                setError(data.detail || 'Failed to add bank account');
            }
        } catch (error) {
            setError('An error occurred while adding the bank account.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Add Bank</h1>
            <button onClick={addBank} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Add Bank Account'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {bankUrl && !isLoading && (
                <div>
                    <p>Bank URL: <a href={bankUrl} target="_blank" rel="noopener noreferrer">Open Bank Link</a></p>
                </div>
            )}
        </div>
    );
}

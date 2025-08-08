import Input from "@/components/utils/input"; // Adjust the path based on your project structure
import Button from "@/components/utils/button"; // Adjust the path based on your project structure
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import styles from "@/styles/components/auth/kycForm.module.css"; // Uncomment and adjust path based on your styles

export default function KycForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phoneNumber: '',
        clientCustomerId: '', // Initialize as empty
        type: 'INDIVIDUAL' // Default type
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Use useEffect to access localStorage
    useEffect(() => {
        const storedPhone = localStorage.getItem('phone');
        const storedClientCustomerId = localStorage.getItem('clientCustomerId');
        
        if (storedPhone) {
            setFormData((prev) => ({ ...prev, phoneNumber: storedPhone }));
        }
        
        if (storedClientCustomerId) {
            setFormData((prev) => ({ ...prev, clientCustomerId: storedClientCustomerId }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/kycurl', { // Adjust the endpoint based on your API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'YOUR_API_KEY', // Replace with your API key
                    'payload': 'YOUR_PAYLOAD', // Generate and replace with the payload
                    'signature': 'YOUR_SIGNATURE' // Generate and replace with the signature
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'KYC submission failed. Please try again.');
            }

            const data = await response.json();
            // Handle successful KYC submission (e.g., show a success message or redirect)
            console.log("KYC submission successful:", data);
            router.push('/success'); // Redirect to a success page after submission
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="kyc_form_container">
            <div className="kyc_form_head">KYC Form</div>
            <form className="kyc_form" onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div className="input_box">
                    <Input
                        type="text"
                        name="phoneNumber"
                        label="Phone Number"
                        value={formData.phoneNumber} // Bind the input value
                        onChange={handleChange} // Handle input changes
                        required // Make it required
                    />
                </div>
                <div className="input_box">
                    <Input
                        type="hidden" // Make this hidden if you don't want to show the clientCustomerId
                        name="clientCustomerId"
                        value={formData.clientCustomerId}
                    />
                </div>
                <div className="input_box">
                    <Input
                        type="hidden" // Type is hidden for constant type
                        name="type"
                        value={formData.type}
                    />
                </div>
                <div className="kyc_form_bottom_section">
                    <Button content={<span>{isLoading ? 'Loading...' : 'Submit'}</span>} disabled={isLoading} />
                </div>
            </form>
        </section>
    );
}

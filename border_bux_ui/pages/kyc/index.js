import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/utils/button"; // Adjust the path based on your project structure
import styles from "@/styles/components/auth/kyc.module.css"; // Ensure this CSS file exists

export default function KYC() {
    const router = useRouter();
    const [kycDetails, setKycDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [kycUrl, setKycUrl] = useState(null); // Store kyc_url here

    // Fetch KYC details after component mounts
    useEffect(() => {
        const fetchKycDetails = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            if (!token) {
                setError("Authentication token not found. Please log in.");
                setIsLoading(false);
                router.push('/login'); // Redirect to login if token is not found
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/kyc/', {  // Update the API URL
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Pass the token in the headers
                    },
                });

                if (response.status === 401) {
                    // If the response is 401 (Unauthorized), redirect to login page
                    setError("Session expired. Please log in again.");
                    localStorage.removeItem('token'); // Clear the expired token
                    router.push('/login'); // Redirect to login page
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch KYC details.');
                }

                const data = await response.json();
                setKycDetails(data); // Set KYC details to state
                setKycUrl(data.kyc_url); // Store the KYC URL in the state

                // If the status is 'complete', redirect to home page
                if (data.status === 'complete') {
                    router.push('/'); // Redirect to home page
                }
            } catch (err) {
                setError(err.message); // Handle any errors
            } finally {
                setIsLoading(false); // Stop loading when the request is done
            }
        };

        fetchKycDetails();
    }, [router]);

    // Function to open the KYC URL in a new tab
    const openKycLink = () => {
        if (kycUrl) {
            window.open(kycUrl, "_blank");
        } else {
            setError("No KYC URL available.");
        }
    };
    return (
        <section className={styles.kyc_form_container}>
            <div className={styles.kyc_form_head}>KYC Details</div>
            {isLoading && <div>Loading KYC details...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {kycDetails && (
                <div>
                    <p>KYC Status: <strong>{kycDetails.status}</strong></p>
                    {kycDetails.status === 'pending' && (
                        <div>
                            <Button content="Complete KYC" onClick={openKycLink} />
                        </div>
                    )}
                </div>
            )}

            <div className={styles.kyc_form_bottom_section}>
                {kycDetails?.status === 'complete' && (
                    <p>Your KYC is complete. Redirecting to the home page...</p>
                )}
            </div>
        </section>
    );
}

import { useState } from 'react';
import Navbar from '@/components/navbar';
import styles from '@/styles/components/profile/user.module.css'; // Import the CSS module
import { MdVerified } from "react-icons/md"; // Import Verified Icon from react-icons

export default function Profile() {
    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);

    // Toggle modal visibility
    const handleAddBankDetailsClick = () => {
        setShowModal(!showModal);
        getQuote();
    };


    async function getQuote() {
        const kycData = { 
            fromAmount: '1000', 
            paymentMethodType: 'ACH'
         };

        try {
            const kycResponse = await fetch('http://127.0.0.1:5000/transaction/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kycData),
            });

            if (!kycResponse.ok) {
                const errorData = await kycResponse.json();
                throw new Error(errorData.message || 'KYC submission failed. Please try again.');
            }

            const kycDataResponse = await kycResponse.json();
            console.log('KYC status:', kycDataResponse);
        } catch (err) {
            console.log(err.message); // Set error message if KYC status fetch fails
        }
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.profileCard}>
                    <div className={styles.cardFront}>
                        <div className={styles.cardHeader}>
                            <h1>BorderBux</h1>
                            <div className={styles.verified}>
                                <MdVerified size={28} color="#4CAF50" />
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.cardNumber}>**** **** **** 1234</div>
                            <div className={styles.cardHolder}>John Doe</div>
                            <div className={styles.expiry}>12/24</div>
                        </div>
                    </div>
                </div>

                <div className={styles.userInfo}>
                    <h2>Profile Information</h2>
                    <p><strong>Name:</strong> John Doe</p>
                    <p><strong>Email:</strong> johndoe@example.com</p>
                    <p><strong>Phone Number:</strong> +1 234 567 890</p>
                </div>

                {/* Button to trigger modal */}
                <button onClick={handleAddBankDetailsClick} className={styles.addBankButton}>
                    {showModal ? 'Close' : 'Add Bank Details'}
                </button>

                {/* Modal for adding bank details */}
                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Add Bank Details</h3>
                            <form>
                                <label htmlFor="bankName">Bank Name:</label>
                                <input type="text" id="bankName" name="bankName" placeholder="Enter Bank Name" required />

                                <label htmlFor="accountNumber">Account Number:</label>
                                <input type="text" id="accountNumber" name="accountNumber" placeholder="Enter Account Number" required />

                                <label htmlFor="routingNumber">Routing Number:</label>
                                <input type="text" id="routingNumber" name="routingNumber" placeholder="Enter Routing Number" required />

                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.submitButton}>Submit</button>
                                    <button type="button" className={styles.closeButton} onClick={handleAddBankDetailsClick}>
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

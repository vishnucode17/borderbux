import { useState } from 'react';
import styles from '@/styles/components/auth/verify.module.css';
import { useRouter } from 'next/router';

export default function Verify() {
    const router = useRouter();
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(null);
    const { phone_number } = router.query;

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number, verificationCode }),
            });

            if (!response.ok) {
                throw new Error('Verification failed. Please try again.');
            }

            // Redirect to login or dashboard after successful verification
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className={styles.verifyContainer}>
            <div className={styles.header}>Verify Your Phone Number</div>
            <p className={styles.instruction}>Enter the code sent to {phone_number}</p>
            <form className={styles.verifyForm} onSubmit={handleSubmit}>
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>
                    Verification Code
                    <input
                        type="text"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <button type="submit" className={styles.submitButton}>
                    Verify
                </button>
            </form>
        </section>
    );
}

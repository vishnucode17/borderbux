import { useState } from 'react';
import styles from '@/styles/components/auth/signup.module.css';
import { useRouter } from 'next/router';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        country_code: '',  // Correctly initialize 'country_code'
        password: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userID, setUserID] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Send signup request
            const signupResponse = await fetch('http://127.0.0.1:8000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                throw new Error(errorData.message || 'Signup failed. Please try again.');
            }

            const signupData = await signupResponse.json();
            setUserID(signupData.uuid); // Assuming 'uuid' is part of the response

            // Redirect to the login page after signup
            router.push('/login'); // Redirect to the login page

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.signupContainer}>
            <div className={styles.header}>Create Your Account</div>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>
                    Full Name
                    <input
                        type="text"
                        name="full_name" // Match the name field with formData
                        value={formData.full_name} // Bind with the formData
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Phone Number
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Country Code
                    <input
                        type="text"
                        name="country_code" // Match the name field with formData
                        value={formData.country_code}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </section>
    );
}

import Input from "@/components/utils/input";
import styles from "@/styles/components/auth/login.module.css";
import Button from "@/components/utils/button";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({}); // For form validation errors
    const [isClient, setIsClient] = useState(false); // Flag to check if we're on the client side

    // Define form fields
    const fields = [
        {
            label: "Email",
            name: "email",
            type: "text",
            placeholder: "Enter your email"
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            placeholder: "Enter your password"
        }
    ];

    // Check if user is already logged in and redirect if necessary
    useEffect(() => {
        // Set the client-side flag after component mounts
        setIsClient(true);

        // Redirect to the home page if already logged in
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, [router]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' })); // Clear any existing error
    };

    // Validate the form before submitting
    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = "Email is required";
        if (!formData.password) errors.password = "Password is required";
        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setFormErrors(validationErrors);

        // If there are validation errors, don't submit the form
        if (Object.keys(validationErrors).length > 0) return;

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 400) {
                    throw new Error(errorData.message || 'Invalid login credentials. Please check your details.');
                } else {
                    throw new Error('An unexpected error occurred. Please try again later.');
                }
            }

            const data = await response.json();
            // Store the token and clientCustomerId in localStorage
            console.log(data)
            localStorage.setItem('token', data.access_token); // Store the Bearer token

            // Redirect to dashboard on successful login
            router.push('/');
        } catch (err) {
            setError(err.message); // Set error message to display in the UI
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    if (!isClient) {
        // Prevent rendering until we are on the client side
        return null;
    }

    return (
        <section className={styles.login_container}>
            <div className={styles.auth_head}>Enter Your Details</div>
            <div className={styles.auth_subhead}>
                Please provide your email and password to login.
            </div>
            <form className={styles.auth_form} onSubmit={handleSubmit}>
                {error && <p className={styles.error}>{error}</p>}

                {/* Loop over the fields and display each input */}
                {fields.map((field, index) => (
                    <div key={index} className={styles.input_box}>
                        <Input
                            type={field.type}
                            name={field.name}
                            label={field.label}
                            value={formData[field.name]} // Bind the input value
                            onChange={handleChange} // Handle input changes
                            required
                            placeholder={field.placeholder} // Optional placeholder text
                            error={formErrors[field.name]} // Display validation errors
                        />
                        {formErrors[field.name] && <div className={styles.input_error}>{formErrors[field.name]}</div>}
                    </div>
                ))}

                <div className={styles.auth_bottom_section}>
                    <div id={styles.back} onClick={() => router.back()}>
                        <FaLessThan /> Back
                    </div>
                    <Button
                        content={
                            <>
                                <span>{isLoading ? 'Loading...' : 'Submit'}</span>
                                <FaGreaterThan />
                            </>
                        }
                        disabled={isLoading}
                    />
                </div>
            </form>
        </section>
    );
}

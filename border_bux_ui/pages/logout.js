import { useRouter } from 'next/router';
import React from 'react';
const Logout = () => {
    const router = useRouter();

    // Clear sensitive data from localStorage
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('clientCustomerId');
        localStorage.removeItem('phone');

        // Redirect to login page or home
        router.push('/login'); // You can redirect to any page (e.g., home or login page)
    };

    // Trigger logout when the component mounts
    React.useEffect(() => {
        handleLogout();
    }, []);

    return null; // This component doesn't need to render anything
};

export default Logout;

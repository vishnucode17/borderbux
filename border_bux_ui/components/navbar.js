import { useState, useEffect } from 'react';

const NavLink = ({ label, selectedOption, setSelectedOption }) => (
    <li
        className={`nav-link ${selectedOption === label ? "selected" : ""}`}
        onClick={() => setSelectedOption(label)}
    >
        {label}
    </li>
);

export default function Navbar() {
    const [selectedOption, setSelectedOption] = useState("Personal");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the client is on the browser
        if (typeof window !== "undefined") {
            // Access localStorage only in the browser
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token); // Set login state based on the existence of clientCustomerId
        }
    }, []); // Empty dependency array means it runs only once on mount

    return (
        <nav className="root-nav">
            <div className="brand-name">BorderBux</div>
            <ul className="nav-menu">
                {["Personal", "Business", "Platform"].map((option) => (
                    <NavLink
                        key={option}
                        label={option}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                    />
                ))}
            </ul>

            {/* Conditional rendering based on isLoggedIn state */}
            {isLoggedIn ? (
                <a href="/logout" className="auth">Log Out</a>
            ) : (
                <a href="/login" className="auth">Log In</a>
            )}
        </nav>
    );
}

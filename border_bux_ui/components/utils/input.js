// components/utils/input.js
import styles from "@/styles/components/utils/input.module.css";

const Input = ({ type, name, label, value, onChange, required }) => {
    return (
        <div className={styles.inputContainer}>
            <label htmlFor={name} className={styles.label}>
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className={styles.input}
                required={required}
            />
        </div>
    );
};

export default Input;

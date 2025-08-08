import styles from '@/styles/components/utils/button.module.css';

export default function Button(props) {
    return (
        <button className={styles.btn} onClick={props.onClick}> {/* Pass the onClick handler to the button */}
            {props.content}
        </button>
    );
}

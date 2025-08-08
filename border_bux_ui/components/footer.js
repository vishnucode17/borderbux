import React from 'react';
import styles from '@/styles/components/footer/Footer.module.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerSection}>
                <h2 className={styles.footerTitle}>BorderBux</h2>
                <p className={styles.footerDescription}>
                    Fast, secure, and affordable remittances for Indian expatriates
                </p>
                <address className={styles.footerAddress}>
                    2972 Westheimer Rd. Santa Ana, Illinois 85486
                </address>
            </div>
            <div className={styles.footerSection}>
                <h2 className={styles.footerTitle}>Company</h2>
                <ul className={styles.footerLinks}>
                    <li>Home</li>
                    <li>Features</li>
                    <li>Careers</li>
                    <li>FAQ</li>
                </ul>
            </div>
            <div className={styles.footerSection}>
                <h2 className={styles.footerTitle}>Follow us</h2>
                <div className={styles.footerSocial}>
                    <FaFacebookF className={styles.socialIcon} />
                    <FaInstagram className={styles.socialIcon} />
                    <FaLinkedinIn className={styles.socialIcon} />
                    <FaTwitter className={styles.socialIcon} />
                </div>
            </div>
        </footer>
    );
}

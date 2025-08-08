import React from 'react';
import styles from '@/styles/components/ratingsbanner/RatingsBanner.module.css';
import Feature_Grid from "@/static/images/feature-grid.svg"
import Image from 'next/image';
import Cart from '@/static/images/cart.png';
import EcoSystem from '@/static/images/ecosystem.png';
import Request from '@/static/images/request.png';
import Send from '@/static/images/send.png';
import VAT from '@/static/images/vat.png';
import Withdraw from '@/static/images/withdraw.png';

const FeaturesSection = () => {
    const features = [
        {
            icon: Send,
            title: 'Get paid to local accounts',
            description: 'Receive bank account numbers in EUR, USD, GBP & more and get paid as easily as having a local bank account.',
        },
        {
            icon: Cart,
            title: 'Expand into new marketplaces',
            description: 'Connect with thousands of marketplaces and start getting paid within a couple of clicks.',
        },
        {
            icon: Request,
            title: 'Request a payment',
            description: 'Offer your international clients a simple way to pay you with our Billing Service.',
        },
        {
            icon: Withdraw,
            title: 'Withdraw your earnings',
            description: 'Transfer your earnings to your local bank account at low rates or via ATM.',
        },
        {
            icon: VAT,
            title: 'Pay your VAT',
            description: 'Pay the VAT authorities in the EU and UK with the GBP and EUR funds in your Payoneer account, for zero fees.',
        },
        {
            icon: EcoSystem,
            title: 'Connect with ecosystem',
            description: 'Leverage our network of integrated service providers to simplify your business, help you grow globally.',
        },
    ];

    return (
        <div className={styles.features_grid}>
            <div className={styles.ratings_banner}>

            </div>
            <section className={styles.featuresSection}>
                <div className={styles.header}>
                    <span className={styles.tagline}>Packed with powerful features</span>
                    <h1 className={styles.title}>
                        A whole lot more than just sending <span className={styles.highlight}>money.</span> We’re on steroids!
                    </h1>
                    <p className={styles.description}>
                    Unlock a world of possibilities. Dive into a realm where every transaction transcends the norm. Discover the power of seamless connections, innovative solutions, and boundless opportunities.
                    </p>
                </div>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div className={styles.feature_container} key={index}>
                            <div className={styles.side_line}>
                                <span className={styles.side_line_span}></span>
                            </div>
                            <div key={index} className={styles.feature}>
                            <div className={styles.iconWrapper}>
                                <span className={styles.icon}>
                                    <Image
                                        src={feature.icon}
                                    />
                                </span>
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                        </div>
                    ))}
                </div>
                <Image
                    src={Feature_Grid}
                    className={styles.feature_grid}
                />
            </section>
        </div>
    );
};

export default FeaturesSection;

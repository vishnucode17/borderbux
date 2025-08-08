import DropDown from "./utils/drop_down";
import styles from '@/styles/components/faqs/faq.module.css';
import Image from "next/image";
import Banner from "@/static/images/banner.png";
export default function FAQ() {
    const faqs = [
        {
            "id": 1,
            "question": "What is Border Bux?",
            "answer": "Border Bux is a remittance portal which allows users to send money effortlessly, securely to other countries."
        },
        {
            "id": 2,
            "question": "How does Border Bux work?",
            "answer": "Border Bux works on blockchain which makes the transactions so secure and affordable."
        },
        {
            "id": 3,
            "question": "How secure is Border Bux?",
            "answer": "Border Bux runs on a blockchain network which doesn't have single point storage/processing. So, it is safe for users and tough for hackers!"
        },
        {
            "id": 4,
            "question": "Are there any fees for using Border Bux?",
            "answer": "Border Bux has a very minimal fee and is very less compared to the current market."
        },
        {
            "id": 5,
            "question": "How can I contact customer support?",
            "answer": "Mail Us at contact@borderbux.com. Our team will get back to you in 24 hours."
        },
    ];

    return (
        <>
            <section className={styles.faq_section}>
                <Image className={styles.banner_img}
                    src={Banner} />
                <p className={styles.faq_head}>Frequently Asked Questions</p>
                {faqs.map(faq => (
                    <div key={faq.id} className={styles.faq_item}>
                        <DropDown head={faq.question} content={faq.answer} width="100%" />
                    </div>
                ))}
            </section>
        </>
    );
}

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import arrowDropDown from '@/static/images/arrow_drop_down.svg';
import styles from '@/styles/components/utils/drop_down.module.css';

export default function DropDown(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <section
            className={styles.drop_outer}
            style={{ width: props.width }}
        >
            <div className={styles.drop_head} onClick={toggleDropDown}>
                <p className={styles.drop_down_head}>
                    {props.head}
                </p>
                <Image
                    src={arrowDropDown}
                    className={`${styles.drop_arrow} ${isOpen ? styles.drop_arrow_open : ''}`}
                />
            </div>
            <div
                ref={contentRef}
                className={`${styles.drop_down_content} ${isOpen ? styles.drop_down_content_open : ''}`}
                style={{ height: `${height}px` }}
            >
                <p>{props.content}</p>
            </div>
        </section>
    );
}

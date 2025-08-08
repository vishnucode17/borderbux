import Image from "next/image"
import Hero_Image from "@/static/images/hero.svg"
import Hero_Grid from "@/static/images/hero-grid.svg"
import { FaArrowRight } from "react-icons/fa";
import getCurrencyConversion from "@/apis/currency"
import React, { useEffect, useState } from 'react';
import CurrencyConverter from "./CurrencyConverter";
// import { useDispatch, useSelector } from 'react-redux';
// import { getCurrencyConversionAction } from '@/store/actions';

export default function HeroSection() {
    // const dispatch = useDispatch();

    // // Dispatch the action when the component mounts
    // useEffect(() => {
    //     console.log("useEffect called, dispatching action");
    //     dispatch(getCurrencyConversionAction()); // Dispatching action here
    // }, [dispatch]);

    // // Accessing state using useSelector
    // const currencyData = useSelector((state) => state.currency.apiData);

    // console.log("currencyData from Redux store:", currencyData); // Log the state
    return (
        <>
            <section className="hero-section">
                <div className="hero-main">
                    <div className="hero-left">
                        <div className="hero-left-1-content">
                            <div className="hero-left-1">Send Money to with Ease and Confidence</div>
                            <p className="hero-left-2">Fast, secure, and affordable remittances for Indian expatriates</p>
                        </div>
                        <div className="hero-left-3-btn"><FaArrowRight /> Make a Payment Now</div>

                    </div>
                    <div className="hero-right">
                        {/* <Image
                            className="hero-img"
                            src={Hero_Image}
                            alt=""
                        /> */}

                        <CurrencyConverter />
                    </div>
                </div>
            </section>
            <Image className="hero-grid" src={Hero_Grid} alt="" />
        </>
    )
}
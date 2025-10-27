import { CookieContainer } from "../components/CookieContainer";
import { FactoriesContainer } from "../components/FactoriesContainer";
import { FactoriesDisplayContainer } from "../components/FactoriesDisplayContainer";
import { useOutletContext } from "react-router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Seperator } from "../components/Seperator";
import "./HomePage.css";


export function HomePage({ factories }) {

    const currentUser = useOutletContext();
    const [cookiesCount, setCookiesCount] = useState(0);

    useEffect(() => {
        async function fetchUserCookies() {
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${currentUser._id}`,
                    { withCredentials: true }
                );
                setCookiesCount(res.data.totalCookies);
            } catch (err) {
                console.log("Error fetching user cookies: ", err);
            }
        }
        fetchUserCookies();
    }, [currentUser._id]);

    return (
        <div className='home-page-grid'>

            <CookieContainer currentUser={currentUser} cookiesCount={cookiesCount} setCookiesCount={setCookiesCount} />

            <Seperator />

            <FactoriesDisplayContainer factories={factories} />

            <Seperator />

            <FactoriesContainer factories={factories} cookiesCount={cookiesCount} setCookiesCount={setCookiesCount} />
        </div>
    );
}
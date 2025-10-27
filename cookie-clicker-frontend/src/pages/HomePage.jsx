import { CookieContainer } from "../components/CookieContainer";
import { FactoriesContainer } from "../components/FactoriesContainer";
import { FactoriesDisplayContainer } from "../components/FactoriesDisplayContainer";
import { useOutletContext } from "react-router";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Seperator } from "../components/Seperator";
import "./HomePage.css";


export function HomePage({ factories }) {

    const currentUser = useOutletContext();
    const [cookiesCount, setCookiesCount] = useState(0);
    const [cookiesPerSecond, setCookiesPerSecond] = useState(0);
    const userCookiesRef = useRef(0);
    const cookiesPerSecondRef = useRef(0);

    useEffect(() => {
        async function fetchUserCookies() {
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${currentUser._id}`,
                    { withCredentials: true }
                );
                setCookiesCount(res.data.totalCookies);
                setCookiesPerSecond(res.data.cookiesPerSecond);
            } catch (err) {
                console.log("Error fetching user cookies: ", err);
            }
        }
        fetchUserCookies();
    }, [currentUser._id]);

    useEffect(() => {
        userCookiesRef.current = cookiesCount;
    }, [cookiesCount]);

    useEffect(() => {
        cookiesPerSecondRef.current = cookiesPerSecond
    }, [cookiesPerSecond]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCookiesCount(prev => prev + cookiesPerSecondRef.current);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await axios.put(`http://localhost:3000/api/users/${currentUser._id}`,
                    {
                        totalCookies: userCookiesRef.current,
                        cookiesPerSecond: cookiesPerSecondRef.current
                    },
                    {
                        withCredentials: true
                    });
                console.log("auto saved cookies to backend");
            } catch (err) {
                console.log("Failed to auto save cookies ", err);
            }
        }, 60000); // Every 60 seconds

        return () => clearInterval(interval);
    }, [currentUser._id]);



    return (
        <div className='home-page-grid'>

            <CookieContainer
                currentUser={currentUser}
                cookiesCount={cookiesCount}
                setCookiesCount={setCookiesCount}
                cookiesPerSecond={cookiesPerSecond}
                userCookiesRef={userCookiesRef}
            />

            <Seperator />

            <FactoriesDisplayContainer factories={factories} />

            <Seperator />

            <FactoriesContainer
                factories={factories}
                cookiesCount={cookiesCount}
                setCookiesCount={setCookiesCount}
                setCookiesPerSecond={setCookiesPerSecond}
            />
        </div>
    );
}
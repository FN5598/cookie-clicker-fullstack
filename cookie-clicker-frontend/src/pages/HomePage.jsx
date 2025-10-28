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
    const [userFactories, setUserFactories] = useState([]);
    const userCookiesRef = useRef(0);
    const cookiesPerSecondRef = useRef(0);

    async function fetchUserCookies(userId) {
        try {
            const res = await axios.get(`http://localhost:3000/api/users/${userId}`,
                { withCredentials: true }
            );
            setCookiesCount(res.data.totalCookies);
            setCookiesPerSecond(res.data.cookiesPerSecond);
        } catch (err) {
            console.log("Error fetching user cookies: ", err);
        }
    }

    useEffect(() => {
        fetchUserCookies(currentUser._id);
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
        const saveUserData = async () => {
            try {
                const res = await axios.put(`http://localhost:3000/api/users/auto-save/${currentUser._id}`,
                    {
                        totalCookies: cookiesCount,
                        cookiesPerSecond: cookiesPerSecond,
                        factories: userFactories
                    },
                    {
                        withCredentials: true
                    });
                console.log(res.data);
                setCookiesCount(res.data.totalCookies);
            } catch (err) {
                console.log("Failed to save user data", err);
            }
        };

        const handleUnload = () => {
            fetch(`http://localhost:3000/api/users/auto-save/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    totalCookies: cookiesCount,
                    cookiesPerSecond,
                    factories: userFactories,
                }),
                credentials: "include",
                keepalive: true,
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveUserData();
            }
        };

        window.addEventListener('pagehide', handleUnload);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('pagehide', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, [currentUser._id, userFactories, cookiesCount, cookiesPerSecond]);

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
                userFactories={userFactories}
                setUserFactories={setUserFactories}
            />
        </div>
    );
}
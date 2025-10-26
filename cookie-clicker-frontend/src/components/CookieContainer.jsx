import { Wave } from "./Wave";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import "./CookieContainer.css";
import { useOutletContext } from "react-router";
import bigCookie from '/Big-cookie.png';
import useDebounce from "../utils/hooks/useDebounce";

export function CookieContainer() {
    const currentUser = useOutletContext();
    const [cookiesCount, setCookiesCount] = useState(0);
    const localClicksRef = useRef(0);

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
    }, [currentUser._id, currentUser.totalCookies]);

    const debounce = useDebounce();

    function handleClick() {
        localClicksRef.current += 1;
        setCookiesCount(prev => prev + 1);

        debounce( async () => {
            try {
                const res = await axios.put(`http://localhost:3000/api/users/cookies/${currentUser._id}`, 
                    { cookies: localClicksRef.current },
                    { withCredentials: true }
                );
                localClicksRef.current = 0;
                setCookiesCount(res.data.totalCookies);
            } catch (err) {
                console.error("Error updating user cookies: ", err.message);
            }
        }, 300)
    }

    return (
        <div className='cookie-container'>

            <div className="cookie-production-container">
                <div className="cookie-factory-name">
                    <p>{currentUser.username}'s bakery</p>
                </div>
                <div className="cookie-production">
                    <p>Total cookies: {Number(cookiesCount).toFixed(2)}</p>
                    <p>cookies per second</p>
                </div>
            </div>

            <button onClick={handleClick}>
                <img src={bigCookie} className="big-cookie" />
            </button>

            <div className="wave-container">
                <Wave fill="#6c63ff" height={100} amplitude={30} speed={0.2} points={3} />
            </div>
        </div>
    );
}
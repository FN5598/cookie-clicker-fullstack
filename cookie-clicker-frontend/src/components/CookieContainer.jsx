import { Wave } from "./Wave";
import "./CookieContainer.css";
import { useOutletContext } from "react-router";
import bigCookie from '/Big-cookie.png';

export function CookieContainer() {
    const currentUser = useOutletContext();
    return (
        <div className='cookie-container'>

            <div className="cookie-production-container">
                <div className="cookie-factory-name"> 
                    <p>{currentUser.username}'s bakery</p>
                </div>
                <div className="cookie-production">
                    <p>Total cookies: {currentUser.totalCookies}</p>
                    <p>cookies per second</p>
                </div>
            </div>

            <img src={bigCookie} className="big-cookie" />

            <div className="wave-container">
                <Wave fill="#6c63ff" height={100} amplitude={30} speed={0.2} points={3} />
            </div>
        </div>
    );
}
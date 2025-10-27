import { Wave } from "./Wave";
import "./CookieContainer.css";
import { useOutletContext } from "react-router";
import bigCookie from '/Big-cookie.png';

export function CookieContainer({ setCookiesCount, cookiesCount, cookiesPerSecond, userCookiesRef }) {
    const currentUser = useOutletContext();

    function handleClick() {
        userCookiesRef.currentUser += 1;
        setCookiesCount(prev => prev + 1);
    }

    return (
        <div className='cookie-container'>

            <div className="cookie-production-container">
                <div className="cookie-factory-name">
                    <p>{currentUser.username}'s bakery</p>
                </div>
                <div className="cookie-production">
                    <p>Total cookies: {Number(cookiesCount).toFixed(2)}</p>
                    <p>cookies per second {Number(cookiesPerSecond).toFixed(2)}</p>
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
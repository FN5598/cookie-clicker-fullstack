import { Wave } from "./Wave";
import "./CookieContainer.css";

export function CookieContainer() {
    return (
        <div className='cookie-container'>

            <div className="cookie-production-container">
                <div className="cookie-factory-name"> 
                    <p>User's bakery</p>
                </div>
                <div className="cookie-production">
                    <p>Total cookies</p>
                    <p>cookies per second</p>
                </div>
            </div>

            <img src="http://localhost:3000/images/Big-cookie.png" className="big-cookie" />

            <div className="wave-container">
                <Wave fill="#6c63ff" height={100} amplitude={30} speed={0.2} points={3} />
            </div>
        </div>
    );
}
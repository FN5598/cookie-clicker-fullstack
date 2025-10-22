import { CookieContainer } from "../components/CookieContainer";
import { FactoriesContainer } from "../components/FactoriesContainer";
import { FactoriesDisplayContainer } from "../components/FactoriesDisplayContainer";
import { Seperator } from "../components/Seperator";
import "./HomePage.css";


export function HomePage({ factories }) {
    return (
        <div className='home-page-grid'>

            <CookieContainer />

            <Seperator />

            <FactoriesDisplayContainer factories={factories} />

            <Seperator />

            <FactoriesContainer factories={factories} />
        </div>
    );
}
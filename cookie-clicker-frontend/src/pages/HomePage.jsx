import { CookieContainer } from "./CookieContainer";
import { FactoriesContainer } from "./FactoriesContainer";
import { FactoriesDisplayContainer } from "./FactoriesDisplayContainer";
import "./HomePage.css";


export function HomePage({ factories }) {
    return (
        <div className='home-page-grid'>

            <CookieContainer factories={factories}/>

            <FactoriesDisplayContainer factories={factories}/>

            <FactoriesContainer factories={factories} />
        </div>
    );
}
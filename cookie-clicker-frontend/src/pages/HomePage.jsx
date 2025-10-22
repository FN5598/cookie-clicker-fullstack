import { CookieContainer } from "../components/CookieContainer";
import { FactoriesContainer } from "../components/FactoriesContainer";
import { FactoriesDisplayContainer } from "../components/FactoriesDisplayContainer";
import "./HomePage.css";


export function HomePage({ factories }) {
    return (
        <div className='home-page-grid'>

            <CookieContainer />

            <FactoriesDisplayContainer factories={factories}/>

            <FactoriesContainer factories={factories} />
        </div>
    );
}
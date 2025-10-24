import { CookieContainer } from "../components/CookieContainer";
import { FactoriesContainer } from "../components/FactoriesContainer";
import { FactoriesDisplayContainer } from "../components/FactoriesDisplayContainer";
import { Seperator } from "../components/Seperator";
import "./HomePage.css";


export function HomePage({ factories, currentUser }) {
    return (
        <div className='home-page-grid'>

            <CookieContainer currentUser={currentUser}/>

            <Seperator />

            <FactoriesDisplayContainer factories={factories} />

            <Seperator />

            <FactoriesContainer factories={factories} />
        </div>
    );
}
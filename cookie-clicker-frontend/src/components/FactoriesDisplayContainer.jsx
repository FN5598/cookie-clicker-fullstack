import "./FactoriesDisplayContainer.css";
import { Seperator } from './Seperator';

export function FactoriesDisplayContainer({ factories }) {
    return (
        <div className="factories-display-container">
            <div className="settings-container">
                <div className="stats-options-container">
                    <button>Options</button>
                    <button>Stats</button>
                </div>
                <div className="info-legacy-container">
                    <button>Info</button>
                    <button>Legacy</button>
                </div>
            </div>
            <Seperator height={16} />

            <div className="owned-factories-container">
                {factories?.length > 0 && (
                    factories.map((factory) => {
                        return (
                            <div key={factory._id}>
                                <img src={`http://localhost:3000/${factory.image}`} className="owned-factories-image" />
                            </div>
                        );
                    })
                )}
            </div>

            <Seperator height={16}/>

            <div className="owned-factories-display-container">
            </div>
        </div>
    );
}
import './FactoriesContainer.css';

export function FactoriesContainer({ factories }) {
    return (
        <div className="factories-container">

            <h1>STORE</h1>


            <div className="factory-info">
                {factories?.length > 0 && (
                    factories.map((factory) => {
                        return (
                            <div key={factory._id} className="factory-container">
                                <div className="factory-wrapper">
                                    <div className="factory-image-container">
                                        <img src={`http://localhost:3000/${factory.image}`} alt={factory.name} className="factory-image" />
                                    </div>
                                    <div className="factory-name-container">
                                        <p className="factory-name">{factory.name}</p>
                                        <p className="factory-price">{factory.currentPrice}</p>
                                    </div>
                                </div>
                                <p className="factory-amount">{factory.amount}</p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
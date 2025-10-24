import './FactoriesContainer.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


export function FactoriesContainer({ factories }) {
    const navigate = useNavigate()

    async function logout() {

        try {
            const res = await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
            console.log(res.data);
            localStorage.clear();
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

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
            <button
                onClick={logout}
            >LOG OUT</button>
        </div>
    );
}
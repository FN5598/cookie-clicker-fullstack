import './FactoriesContainer.css';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../utils/hooks/useDebounce';


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



    const userId = localStorage.getItem('userId');
    const [userFactories, setUserFactories] = useState([]);
    const pendingClicksRef = useRef({});
    const debounce = useDebounce();

    useEffect(() => {
        async function fetchUserFactories() {
            try {
                const res = await axios.get(`http://localhost:3000/api/users/${userId}`, { withCredentials: true });

                const factoryData = res.data.factories.map(f => ({
                    _id: f.factory,
                    amount: f.amount || 0
                }));

                setUserFactories(factoryData);
            } catch (err) {
                console.log(err);
            }
        }



        fetchUserFactories();
    }, [userId]);



    const handleFactoryClick = (factoryId) => {
        setUserFactories((prev) =>
            prev.map((f) =>
                f._id === factoryId ? { ...f, amount: (f.amount || 0) + 1 } : f
            )
        );

        pendingClicksRef.current[factoryId] =
            (pendingClicksRef.current[factoryId] || 0) + 1;

        debounce(async () => {
            const clicksToSend = pendingClicksRef.current[factoryId];
            if (!clicksToSend) return;

            try {
                const res = await axios.put(
                    `http://localhost:3000/api/users/factories/${userId}`,
                    { factoryId, factoryAmount: clicksToSend },
                    { withCredentials: true }
                );

                const updatedFactory = res.data.find((f) => f.factory === factoryId);
                if (updatedFactory) {
                    setUserFactories((prev) =>
                        prev.map((f) =>
                            f._id === factoryId
                                ? { ...f, amount: updatedFactory.amount }
                                : f
                        )
                    );
                }

                pendingClicksRef.current[factoryId] = 0;
            } catch (err) {
                console.error("Error updating factory:", err);
                setUserFactories((prev) =>
                    prev.map((f) =>
                        f._id === factoryId
                            ? { ...f, amount: (f.amount || 0) - clicksToSend }
                            : f
                    )
                );

                pendingClicksRef.current[factoryId] = 0;
            }
        }, 300);
    };
    return (
        <div className="factories-container">

            <h1>STORE</h1>


            <div className="factory-info">
                {factories?.length > 0 && (
                    factories.map((factory) => {
                        return (
                            <div
                                key={factory._id}
                                className="factory-container"
                                onClick={() => handleFactoryClick(factory._id)}
                            >
                                <div className="factory-wrapper">
                                    <div className="factory-image-container">
                                        <img src={`http://localhost:3000/${factory.image}`} alt={factory.name} className="factory-image" />
                                    </div>
                                    <div className="factory-name-container">
                                        <p className="factory-name">{factory.name}</p>
                                        <p className="factory-price">{factory.currentPrice}</p>
                                    </div>
                                </div>
                                <p className="factory-amount">{userFactories.find(f => f._id === factory._id)?.amount || 0}</p>
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
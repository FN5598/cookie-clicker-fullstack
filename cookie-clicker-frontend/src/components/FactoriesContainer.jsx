import './FactoriesContainer.css';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../utils/hooks/useDebounce';
import { calculateFactoryPrice } from '../utils/calculateFactoryPrice';

export function FactoriesContainer({ factories, setCookiesCount, cookiesCount, setCookiesPerSecond }) {
    const navigate = useNavigate();

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

    const [userFactories, setUserFactories] = useState([]);
    const userFactoryRef = useRef(0);
    const userId = localStorage.getItem('userId');
    const debounce = useDebounce();


    async function fetchUserFactoriesData(userId) {
        const res = await axios.get(`http://localhost:3000/api/users/${userId}`,
            { withCredentials: true }
        );
        return res.data;
    }


    useEffect(() => {
        const loadUserData = async () => {
            const userData = await fetchUserFactoriesData(userId);
            setUserFactories(userData.factories);
        }

        loadUserData();
    }, [userId]);

    async function handleFactoryClick(factoryId) {
        try {
            const factory = userFactories.find(f => f._id === factoryId);
            if (!factory) return;

            let totalCost = 0;
            for (let i = 0; i < userFactoryRef.current + 1; i++) {
                const priceForThisFactory = calculateFactoryPrice(factory.startingPrice, factory.amount + i);
                totalCost += priceForThisFactory;
            }

            if (cookiesCount < totalCost) {
                alert(`Need ${Number(totalCost).toFixed(2)} cookies, but only have ${Number(cookiesCount).toFixed(2)}`);
                return;
            }
            setCookiesCount(cookiesCount - totalCost);
            setCookiesPerSecond(prev => prev + factory.productionRate);
            userFactoryRef.current += 1;

            setUserFactories(prev => prev.map(f => {
                if (f._id === factoryId) {
                    const factoryAmount = f.amount + 1;
                    const factoryPrice = calculateFactoryPrice(f.startingPrice, factoryAmount);

                    return {
                        ...f,
                        amount: factoryAmount,
                        currentPrice: factoryPrice
                    }
                }
                return f;
            }))

            debounce(async () => {
                const res = await axios.put(`http://localhost:3000/api/users/factories/${userId}`,
                    {
                        factoryId,
                        factoryAmount: userFactoryRef.current
                    },
                    {
                        withCredentials: true
                    });
                setCookiesCount(res.data.totalCookies);
                setCookiesPerSecond(res.data.cookiesPerSecond);
                userFactoryRef.current = 0;
            }, 300)
        } catch (err) {
            console.log(`Failed to update user factories data`, err);
        }
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
                                        <img
                                            src={`http://localhost:3000/${factory.image}`}
                                            alt={factory.name}
                                            className="factory-image"
                                        />
                                    </div>
                                    <div className="factory-name-container">
                                        <p className="factory-name">{factory.name}</p>
                                        <p className="factory-price">{Number((userFactories.find(f => f._id === factory._id))?.currentPrice).toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="factory-amount">{(userFactories.find(f => f._id === factory._id))?.amount}</p>
                            </div>
                        );
                    })
                )}
            </div>
            <button onClick={logout}>LOG OUT</button>
        </div>
    );
}
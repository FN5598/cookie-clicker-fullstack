import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function ProtectedRoutes({ users }) {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch('http://localhost:3000/auth/refresh', {
                    method: "POST",
                    credentials: 'include'
                });
                if (!res.ok) throw new Error("Not Authenticated");

                const data = await res.json();
                localStorage.setItem('userId', data.userId);

                if (users && users.length > 0) {
                    const user = users.find(u => u._id === data.userId);
                    setCurrentUser(user);
                } else {
                    const savedUserId = localStorage.getItem('userId');
                    if(savedUserId) {
                        setCurrentUser({ _id: savedUserId });
                    }
                }
            } catch (err) {
                console.log(err);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, [users]);


    useEffect(() => {
        if (users && users.length > 0 && !currentUser ) {
            const savedUserId = localStorage.getItem('userId');
            if(savedUserId) {
                const user = users.find(u => u._id === savedUserId);
                setCurrentUser(user);
            }
        }
    }, [users, currentUser]);


    if (loading) return <div>Loading ...</div>;

    if (!currentUser) return <Navigate to="/login" replace />

    return <Outlet context={currentUser} />;
}
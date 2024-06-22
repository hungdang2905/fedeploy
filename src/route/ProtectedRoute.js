import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import RootPathApi from "./RootPathApi";

const ProtectedRoute = ({component: Component, ...rest}) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const baseUrl = RootPathApi();

    useEffect(() => {
        const checkAdminPermission = async () => {
            try {
                await axios.get(`${baseUrl}/api/v1/auth/checkPermission`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(r => {
                    setIsAdmin(r.data);

                });
            } catch (error) {
                console.error('Error checking admin permission:', error);
                setIsAdmin(false);
            }
        };

        if (token) {
            checkAdminPermission()
        } else {
            setIsAdmin(false);
            navigate('/404');
        }
    }, [token]);

    return <Component {...rest} />;
};

export default ProtectedRoute;
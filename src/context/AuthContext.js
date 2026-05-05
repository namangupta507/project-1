import React, { createContext, useState, useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { logoutStateReset } from '../redux/slices/auth/LogoutSlice';
import { loginStateReset } from '../redux/slices/auth/LoginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { GetProfileApi } from '../redux/actions/profile/GetProfileAction';
import Swal from 'sweetalert2';
import { useJsApiLoader } from '@react-google-maps/api';
import { GetVehiclesApi } from '../redux/actions/vehicle/GetVehiclesAction';
import { GetParentTeamsApi } from '../redux/actions/teams/GetParentTeamsAction';
import { GetPlansApi } from '../redux/actions/subscription/GetPlansAction';
import { GetMembersDropdownApi } from '../redux/actions/teams/members/GetDropdownAction';
import { GetInvitationsApi } from '../redux/actions/auth/GetInvitationsAction';
import { set } from 'date-fns';

// Create AuthContext for managing authentication state globally
export const AuthContext = createContext();

// AuthProvider component that provides authentication-related functions to children components
export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const defaultCenter = {
        lat: 40.7128,
        lng: -74.006,
    };
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [parentTeamName, setParentTeamName] = useState('');
    const [parentTeamId, setParentTeamId] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [firstLogin, setFirstLogin] = useState(false);
    const { response: profileResponse, loading: profileLoading, error: profileError } = useSelector((state) => state.profile)
    // State to check if the user is authenticated based on a stored token
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem('authToken');// Retrieve authToken from localStorage
        return token ? true : false;// If token exists, set authenticated to true
    });

    console.log(profileResponse, "profileResponse")
    const libraries = ['places', 'marker']
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Function to log in the user and store the auth token in localStorage
    const login = (token) => {
        localStorage.setItem('authToken', token);
        setIsAuthenticated(true);
    };

    const logoutAfterAccountDeletion = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        dispatch(logoutStateReset());
        dispatch(loginStateReset());
    }

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        Swal.fire({
            title: 'Logged out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            confirmButtonColor: '#49a496'
        }
        );
        dispatch(logoutStateReset());
        dispatch(loginStateReset());
    };

    // Function to fetch the user's profile from the API
    const fetchProfile = async () => {
        try {
            await dispatch(GetProfileApi());
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    // Function to fetch the user's profile from the API
    const fetchVehicles = async () => {
        try {
            await dispatch(GetVehiclesApi({ isActive: true }));
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    const fetchParentTeams = async () => {
        try {
            await dispatch(GetParentTeamsApi())
        } catch (error) {
            showErrorToast(error)
        }
    }

    const fetchSubscriptionPlans = async (userId) => {
        try {

            await dispatch(GetPlansApi(userId))

        } catch (error) {
            showErrorToast(error)
        }
    }

    const fetchMembersDropdown = async () => {
        try {
            await dispatch(GetMembersDropdownApi())
        } catch (error) {
            showErrorToast(error)
        }
    }

    const fetchInvites = async () => {
        try {
            await dispatch(GetInvitationsApi())
        } catch (error) {
            showErrorToast(error)
        }
    }

    // Effect to fetch the profile if the user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
            fetchVehicles();
            fetchParentTeams();
            // fetchSubscriptionPlans();
            fetchMembersDropdown();
            fetchInvites();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (profileResponse) {
            setParentTeamId(profileResponse?.user?.teamName?._id);
            setParentTeamName(profileResponse?.user?.teamName?.name);
            setUserId(profileResponse?.user?._id);
            setFirstLogin(profileResponse?.user?.firstLogin);

            if (profileResponse?.user?.role) {
                switch (profileResponse?.user?.role) {
                    case 1:
                        setUserRole('Super Admin')
                        break;
                    case 2:
                        setUserRole('Owner')
                        break;
                    case 3:
                        setUserRole('Team Manager')
                        break;
                    case 4:
                        setUserRole('Manager Limited')
                        break;
                    case 5:
                        setUserRole('Member')
                        break;
                    default:
                        setUserRole('Owner')
                }
            }
        }
    }, [profileResponse])

    useEffect(() => {
        if (userId) {
            fetchSubscriptionPlans(userId)
        }
    }, [userId])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setMapCenter(userLocation);
                    //   Optionally, you can reverse-geocode this position to set fromAddress here if you want
                },
                (error) => {
                    console.warn("Error getting location, using default center", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        };
        checkAuth();// Run the checkAuth function when the component mounts
    }, []); // Empty dependency array means this runs only on component mount

    // Provide authentication state and functions to the rest of the app
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, fetchProfile, loadError, isLoaded, defaultCenter, firstLogin, setFirstLogin, userRole, fetchInvites, mapCenter, userId, setMapCenter, fetchMembersDropdown, fetchSubscriptionPlans, logoutAfterAccountDeletion, parentTeamName, fetchParentTeams, parentTeamId, setParentTeamName }}>
            {children}
        </AuthContext.Provider>
    );
};

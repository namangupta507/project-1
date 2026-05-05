import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LogoutApi } from '../redux/actions/auth/LogoutAction';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorToast } from '../helpers/toast';
import { logoutStateReset } from '../redux/slices/auth/LogoutSlice';
import { AuthContext } from '../context/AuthContext';
import { PulseLoader } from 'react-spinners';
import FullPageLoader from './FullPageLoader';
import { useProfileImage } from '../context/ProfileImageContext';

const Header = ({ isOpen, onToggleSidebar }) => {
    const dispatch = useDispatch(); // Hook for dispatching actions
    const location = useLocation()

    // Extracting logout response and error from Redux store
    const { response, loading, error } = useSelector((state) => state.logout);
    const { response: profileResponse, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);

    // Extracting functions from the AuthContext
    const { logout, fetchProfile, userRole } = useContext(AuthContext);
    const { profileImage } = useProfileImage();

    // State for toggling the profile dropdown menu
    const [showDropDown, setShowDropDown] = useState(false);

    const dropdownRef = useRef(null);// Reference to dropdown for detecting outside click
    const buttonRef = useRef(null);// Reference to the profile button

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Handle logout process with a confirmation dialog
    const handleLogout = (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to log out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#49a496',
            cancelButtonColor: '#ffffff',
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'No, cancel',
            customClass: {
                cancelButton: 'custom-cancel-btn'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(LogoutApi())
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'You are still logged in :)',
                    'info'
                );
            }
        });
    };

    const pageHeading = (path) => {
        if (path.startsWith('/dashboard/update-delete-odometer-reading')) {
            return 'Update-Delete Odometer Reading';
        }
        if (path.startsWith('/dashboard/reports/detail')) {
            return 'Report Detail';
        }

        switch (path) {
            case '/dashboard/trips':
                return 'Trips';
            case '/dashboard/expenses':
                return 'Expenses';
            case '/dashboard/odometer-reading':
                return 'Odometer-Reading';
            case '/dashboard/reports':
                return 'Reports';
            case '/dashboard/reporting/vehicle':
                return 'Vehicle';
            case '/dashboard/reporting/location':
                return 'Location';
            case '/dashboard/reporting/mileage-rates':
                return 'Mileage Rates';
            case '/dashboard/support/about':
                return 'About Us';
            case '/dashboard/support/privacy':
                return 'Privacy Policy';
            case '/dashboard/support/terms':
                return 'Terms & Conditions';
            default:
                return 'Home';
        }
    }

    // Effect to trigger logout when response from Redux is available
    useEffect(() => {
        if (response) {
            logout();
        }
    }, [response, logout, dispatch]);

    // Effect to show an error toast when logout fails
    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(logoutStateReset());
        }
    }, [error])

    useEffect(() => {
        if (loading) {
            <FullPageLoader />
        }
    }, [loading])

    return (
        <header>
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-5 col-md-5">
                        <div className="header-flex">
                            <button className={`opnBtn ${isOpen ? 'active' : ''}`} type="button" onClick={onToggleSidebar}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-colors"><g clip-path="url(#clip0_5791_1036)"><path d="M9.32373 15L1.32373 7.78788L9.32373 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M15.1533 15L7.15332 7.78788L15.1533 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></g><defs><clipPath id="clip0_5791_1036"><rect width="16" height="16" fill="white"></rect></clipPath></defs></svg></button>
                            <span className="page-heading">{pageHeading(location.pathname)}</span>
                        </div>
                    </div>
                    <div className="col-7 col-md-7">
                        <div className="header-menu">
                            <ul className="header-menu-list">
                                <li className="nav-item">
                                    <div className="profile-nav-wrapper position-relative">
                                        <button className="header-link-btn profile_btn" id="profilenavBtn" onClick={() => setShowDropDown(prev => !prev)} ref={buttonRef}>
                                            <img src={
                                                profileImage instanceof File || profileImage instanceof Blob
                                                    ? URL.createObjectURL(profileImage)
                                                    : profileImage
                                            } alt="user" />
                                            <span className='text-wrap'>{profileResponse?.user?.fullName || 'User'}</span>
                                        </button>
                                        <div className={`profile-list-dropdown ${showDropDown ? 'profile-drop' : ''}`} ref={dropdownRef}>
                                            {
                                                profileLoading
                                                    ? (
                                                        // Show loading spinner while data is being fetched
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                            <PulseLoader size={25} color="#49a496" />
                                                        </div >
                                                    ) : profileError ? (
                                                        // Display error message if there is an issue fetching data
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-danger'>Something went wrong</p>
                                                        </div>
                                                    ) :
                                                        <ul className="list-unstyled mb-0">
                                                            <li>
                                                                <div className="profile-list-preview">
                                                                    <span className="profile-img">
                                                                        <img src={profileImage} alt="Profile" />
                                                                    </span>
                                                                    <span className="profile-detail">
                                                                        <span className="profile-name">{profileResponse?.user?.fullName || ''}</span>
                                                                        <span className="profile-email">{profileResponse?.user?.email || '....'}</span>
                                                                    </span>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <Link to='/dashboard/profile' className="profile-links-list" onClick={() => setShowDropDown(false)}>
                                                                    <span className="navicon">
                                                                        <i className="fa-regular fa-user" />
                                                                    </span>
                                                                    Profile Details
                                                                </Link>
                                                                <Link to="/dashboard/change-password" className="profile-links-list" onClick={() => setShowDropDown(false)}>
                                                                    <span className="navicon">
                                                                        <i className="fa-solid fa-rotate" />
                                                                    </span>
                                                                    Reset Password
                                                                </Link>
                                                                <Link to="/dashboard/notifications" className="profile-links-list disabled" onClick={() => setShowDropDown(false)}>
                                                                    <span className="navicon">
                                                                        <i className="fa-regular fa-bell" />
                                                                    </span>
                                                                    Notifications
                                                                </Link>
                                                                {
                                                                    userRole === 'Owner' &&
                                                                    <Link to="/dashboard/subscriptions" className="profile-links-list disabled" onClick={() => setShowDropDown(false)}>
                                                                        <span className="navicon">
                                                                            <i class="fa-solid fa-dollar-sign"></i>
                                                                        </span>
                                                                        Subscriptions
                                                                    </Link>
                                                                }
                                                            </li>
                                                            <li>
                                                                <Link to="#" className="profile-links-list" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setShowDropDown(false);
                                                                    handleLogout(e);
                                                                }}>
                                                                    <span className="navicon">
                                                                        <i className="fa-solid fa-arrow-right-from-bracket" />
                                                                    </span>
                                                                    Logout
                                                                </Link>
                                                            </li>
                                                        </ul>
                                            }
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header
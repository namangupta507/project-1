import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import mailtoLink from './GetInTouchLink';
import GetInTouchLink from './GetInTouchLink';
import { useColorScheme } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {

    const location = useLocation();
    const [isReportingOpen, setIsReportingOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const { userRole } = useContext(AuthContext);

    const isActive = useCallback((paths, exact = false) => {
        if (exact) {
            return paths.includes(location.pathname) ? 'active' : '';
        } else {
            return paths?.some(path => location.pathname.startsWith(path)) ? 'active' : '';
        }
    }, [location.pathname]);

    useEffect(() => {
        const reportingPaths = [
            '/dashboard/reporting/vehicle',
            '/dashboard/reporting/location',
            '/dashboard/reporting/mileage-rates'
        ];

        setIsReportingOpen(reportingPaths.includes(location.pathname));

        const supportPaths = [
            '/dashboard/support/terms',
            '/dashboard/support/about',
            '/dashboard/support/privacy',
            '/dashboard/support/contact'
        ]

        setIsSupportOpen(supportPaths.includes(location.pathname));
    }, [location.pathname]);

    return (
        <div className={`side-navbar ${isOpen ? 'side-hide' : ''}`}>
            <button className="closeBtn"><i className="fa-solid fa-times" /></button>
            <div className="sidebar-logo">
                <Link className="logo" to=''>
                    <img src="/assets/images/savmor-white-logo.svg" alt="Logo" />
                </Link>
            </div>
            <div className="side_menu_wrapper">
                <div className="sidemenu_list">
                    <span className="nvx">
                        <span className="nvx_text">MAIN</span>
                        <span className="nvx_dots">...</span>
                    </span>
                    <ul className="nav flex-column position-relative" id="sidebar-nav">
                        <li className="sidebar-link">
                            <Link to='/dashboard' className={`nav-link ${isActive(['/dashboard'], true)}`}>
                                <span className="menu-icon">
                                    <img src="/assets/images/home-icon.svg" alt="Home" />
                                </span>
                                <span className="menu_text">Home</span>
                            </Link>
                        </li>
                    </ul>
                    <span className="nvx">
                        <span className="nvx_text">PAGES</span>
                        <span className="nvx_dots">...</span>
                    </span>
                    <ul className="nav flex-column position-relative" id="sidebar-nav">
                        <li className="sidebar-link">
                            <Link to='/dashboard/trips' className={`nav-link ${isActive(['/dashboard/trips'], true)}`}>
                                <span className="menu-icon">
                                    <img src="/assets/images/trips-icon.svg" alt="Trips" />
                                </span>
                                <span className="menu_text">Trips</span>
                            </Link>
                        </li>
                        <li className="sidebar-link">
                            <Link to='/dashboard/expenses' className={`nav-link ${isActive(['/dashboard/expenses'], true)}`}>
                                <span className="menu-icon">
                                    <img src="/assets/images/expenses-icon.svg" alt="Expenses" />
                                </span>
                                <span className="menu_text">Expenses</span>
                            </Link>
                        </li>
                        <li className="sidebar-link">
                            <Link to='/dashboard/odometer-reading' className={`nav-link ${isActive(['/dashboard/odometer-reading'], true)}`}>
                                <span className="menu-icon">
                                    <img src="/assets/images/odometer-icon.svg" alt="Odometer" />
                                </span><span className="menu_text">Odometer Reading</span>
                            </Link>
                        </li>
                        <li className="sidebar-link">
                            <Link to='/dashboard/reports' className={`nav-link ${isActive(['/dashboard/reports'], true)}`}>
                                <span className="menu-icon">
                                    <img src="/assets/images/reports-icon.svg" alt="Reports" />
                                </span>
                                <span className="menu_text">Reports</span>
                            </Link>
                        </li>
                        <li className="sidebar-link">
                            <Link className={`nav-link ${isReportingOpen ? 'active' : ''}`} data-bs-toggle="collapse" href="#navReporting" role="button" aria-expanded={isReportingOpen} aria-controls="collapseExample" onClick={(e) => {
                                e.preventDefault(); // Prevent jump
                                setIsReportingOpen(prev => !prev); // Toggle manually if needed
                            }}>
                                <span className="menu-icon">
                                    <img src="/assets/images/reporting-icon.svg" alt="Reporting" />
                                </span>
                                <span className="menu_text">Reporting</span>
                            </Link>
                            <div className={`collapse ${isReportingOpen ? 'show' : ''}`} id="navReporting" data-bs-parent="#sidebar-nav">
                                <ul className="sub-menu-list">
                                    <li>
                                        <Link to="/dashboard/reporting/vehicle" className={`submenu_link ${isActive(['/dashboard/reporting/vehicle'], true)}`}>Vehicle</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/reporting/mileage-rates" className={`submenu_link ${isActive(['/dashboard/reporting/mileage-rates'], true)}`}>Mileage Rates</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/reporting/location" className={`submenu_link ${isActive(['/dashboard/reporting/location'], true)}`}>Location</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="sidebar-link">
                            <Link className={`nav-link ${isSupportOpen ? 'active' : ''}`} data-bs-toggle="collapse" href="#navSupport" role="button" aria-expanded={isSupportOpen} aria-controls="collapseExample"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent jump
                                    setIsSupportOpen(prev => !prev); // Toggle manually if needed
                                }}>
                                <span className="menu-icon">
                                    <img src="/assets/images/support-icon.svg" alt="Support" />
                                </span>
                                <span className="menu_text">Support</span>
                            </Link>
                            <div className={`collapse ${isSupportOpen ? 'show' : ''}`} id="navSupport" data-bs-parent="#sidebar-nav">
                                <ul className="sub-menu-list">
                                    <li>
                                        <Link to="/dashboard/support/about" className={`submenu_link ${isActive(['/dashboard/support/about'], true)}`}>About us</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/support/privacy" className={`submenu_link ${isActive(['/dashboard/support/privacy'], true)}`}>Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/support/terms" className={`submenu_link ${isActive(['/dashboard/support/terms'], true)}`}>Terms and Conditions</Link>
                                    </li>
                                    {/* <li>
                                    .    <Link to={mailtoLink} className={`submenu_link ${isActive(['/dashboard/support/contact'], true)}`}>Get in Touch </Link>
                                    </li> */}
                                    <GetInTouchLink />
                                </ul>
                            </div>
                        </li>
                        {!(userRole === 'Member') &&
                            <li className="sidebar-link">
                                <Link to='/dashboard/teams' className={`nav-link ${isActive(['/dashboard/teams'], true)}`}>
                                    <span className="menu-icon">
                                        <img src="/assets/images/Team1.svg" alt="Teams" />
                                    </span>
                                    <span className="menu_text">Teams Dashboard</span>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div >

    )
}

export default Sidebar
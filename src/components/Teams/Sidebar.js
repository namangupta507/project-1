import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {

    const location = useLocation();
    const [isTeamSettingsOpen, setIsTeamSettingsOpen] = useState(false);
    const { parentTeamName, userRole } = useContext(AuthContext);
    // State for toggling the profile dropdown menu
    const [showDropDown, setShowDropDown] = useState(false);

    console.log(userRole, "userorle")
    const dropdownRef = useRef(null);// Reference to dropdown for detecting outside click
    const buttonRef = useRef(null);// Reference to the profile button

    const isActive = useCallback((paths, exact = false) => {
        if (exact) {
            return paths.includes(location.pathname) ? 'active' : '';
        } else {
            return paths?.some(path => location.pathname.startsWith(path)) ? 'active' : '';
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === '/dashboard/teams/profile' || location.pathname === '/dashboard/teams/categories' || location.pathname === '/dashboard/teams/places' || location.pathname === '/dashboard/teams/roles-permissions') {
            setIsTeamSettingsOpen(true);
        } else {
            setIsTeamSettingsOpen(false);
        }
    }, [location.pathname]);

    return (
        <div className={`side-navbar ${isOpen ? 'side-hide' : ''}`}>
            <button className="closeBtn"><i className="fa-solid fa-times" /> </button>
            <div className="sidebar-logo">
                <Link className="logo" to=''>
                    <img src="/assets/images/savmor-white-logo.svg" alt="Logo" />
                </Link>
            </div>
            <div className="side_menu_wrapper">
                <div className="sidemenu_list">
                    <ul class="nav flex-column position-relative" id="sidebar-nav">
                        <li class="sidebar-link">
                            <button class={`dropnav-link dropdown-toggle ${showDropDown ? 'show' : ''}`} type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" onClick={() => {
                                setShowDropDown(prev => !prev);
                                setIsTeamSettingsOpen(false)
                            }} ref={buttonRef}>
                                <span className="menu-icon"><img alt="Home" src="/assets/images/dashboard.svg" />
                                </span>
                                <span className='menu_text'>
                                    <span class="dropnav_name">{parentTeamName || ''}</span>
                                    <span class="dropnav_text">Team Dashboard</span>
                                </span>
                            </button>
                            <ul class={`dropnav_menu dropdown-menu ${showDropDown ? 'show' : ''}`} ref={dropdownRef}>
                                {/* <li><a class="dropdown-item" href="#">Team Dashboard</a></li> */}
                                <Link className="dropdown-item" to="/dashboard"><span className="menu-icon">
                                    <img src="/assets/images/back-icon.svg" alt="Back" />
                                </span>
                                    <span className="menu_text">Personal Dashboard</span></Link>

                            </ul>
                        </li>
                    </ul>
                    <span className="nvx">
                        <span className="nvx_text">MAIN</span>
                        <span className="nvx_dots">...</span>
                    </span>

                    <ul className="nav flex-column position-relative" id="sidebar-nav">
                        <li className="sidebar-link">
                            <Link className={`nav-link ${isActive(['/dashboard/teams'], true)}`} to='/dashboard/teams'><span className="menu-icon"><img src="/assets/images/home-icon.svg" alt="Home" /></span><span className="menu_text">Home</span></Link>
                        </li>
                    </ul>
                    <span className="nvx">
                        <span className="nvx_text">PAGES</span>
                        <span className="nvx_dots">...</span>
                    </span>
                    <ul className="nav flex-column position-relative" id="sidebar-nav">
                        {
                            (userRole === 'Super Admin' || userRole === 'Owner') &&
                            <li className="sidebar-link">
                                <Link to='/dashboard/teams/reimbursement' className={`nav-link ${isActive(['/dashboard/teams/reimbursement'], true)}`}><span className="menu-icon"><img src="/assets/images/reimbursement-icon.svg" alt="Reimbursements" /></span><span className="menu_text">Reimbursements</span></Link>
                            </li>
                        }
                        <li className="sidebar-link">
                            <Link to='/dashboard/teams/members' className={`nav-link ${isActive(['/dashboard/teams/members'], false)}`}><span className="menu-icon"><img src="/assets/images/member-icon.svg" alt="Members" /></span><span className="menu_text">Members</span></Link>
                        </li>
                        {!(userRole === 'Manager Limited') &&
                            <li className="sidebar-link">
                                <Link to='/dashboard/teams/teams' className={`nav-link ${isActive(['/dashboard/teams/teams'], true)}`}><span className="menu-icon"><img src="/assets/images/team-icon.svg" alt="Teams" /></span><span className="menu_text">Teams</span></Link>
                            </li>
                        }
                        <li className="sidebar-link">
                            <Link to='/dashboard/teams/data-exports' className={`nav-link ${isActive(['/dashboard/teams/data-exports'], true)}`}><span className="menu-icon"><img src="/assets/images/reports-icon.svg" alt="Data" /></span><span className="menu_text">Data Exports</span></Link>
                        </li>

                        <li className="sidebar-link">
                            <Link to='/dashboard/teams/summary' className={`nav-link ${isActive(['/dashboard/teams/summary'], true)}`}><span className="menu-icon"><img src="/assets/images/reporting-icon.svg" alt="Summary" /></span><span className="menu_text">Summary</span></Link>
                        </li>
                        <li className="sidebar-link">
                            <a className={`nav-link ${isTeamSettingsOpen ? 'active' : ''}`} data-bs-toggle="collapse" href="#navSupport1" role="button" aria-expanded={isTeamSettingsOpen} aria-controls="collapseExample"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent jump
                                    setIsTeamSettingsOpen(prev => !prev); // Toggle manually if needed
                                }}
                            >
                                <span className="menu-icon">
                                    <img src="/assets/images/team-setting-icon.svg" alt="Support" />
                                </span>
                                <span className="menu_text">Team Settings</span>
                            </a>
                            <div className={`collapse ${isTeamSettingsOpen ? 'show' : ''}`} id="navSupport1" data-bs-parent="#sidebar-nav">
                                <ul className="sub-menu-list">

                                    <li className="sidebar-link">
                                        <Link to='/dashboard/teams/profile' className={`submenu_link ${isActive(['/dashboard/teams/profile'], true)}`}><span className="menu-icon"><img src="/assets/images/team-profile-icon.svg" alt="Team Profile" /></span><span className="menu_text">Team Profile</span></Link>
                                    </li>
                                    {
                                        !(userRole === 'Manager Limited') &&
                                        <li className="sidebar-link">
                                            <Link to='/dashboard/teams/categories' className={`submenu_link ${isActive(['/dashboard/teams/categories'], true)}`}><span className="menu-icon"><img src="/assets/images/categories-icon.svg" alt="Categories" /></span><span className="menu_text">Categories</span></Link>
                                        </li>
                                    }
                                    {
                                        !(userRole === 'Manager Limited') &&
                                        <li className="sidebar-link">
                                            <Link to='/dashboard/teams/places' className={`submenu_link ${isActive(['/dashboard/teams/places'], true)}`}><span className="menu-icon"><img src="/assets/images/team-place-icon.svg" alt="Team Places" /></span><span className="menu_text">Team Places</span></Link>
                                        </li>
                                    }
                                    <li className="sidebar-link">
                                        <Link to='/dashboard/teams/roles-permissions' className={`submenu_link ${isActive(['/dashboard/teams/roles-permissions'], true)}`}><span className="menu-icon"><img src="/assets/images/roles-per-icon.svg" alt="Roles & Permissions" /></span><span className="menu_text">Roles &amp; Permissions</span></Link>
                                    </li>
                                    {/* <li className="sidebar-link">
                                            <Link className="submenu_link" to="/dashboard"><span className="menu-icon"><img src="/assets/images/back-icon.svg" alt="Back" /></span><span className="menu_text">Back To Personal Dashboard</span></Link>

                                        </li> */}


                                </ul>
                            </div>
                        </li>
                        {/* <li>
                        </li> */}

                        {/* <li className="sidebar-link">
                            <a href="team-profile.html"><span className="menu-icon"><img src="/assets/images/team-setting-icon.svg" alt="Team Settings" /></span><span className="menu_text">Team Settings</span></a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </div >

    )
}

export default Sidebar
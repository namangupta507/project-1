import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useSideBarContext } from '../context/SidebarContext'

const Layout = () => {
    // const [sidebarOpen, setSidebarOpen] = useState(false);

    // const toggleSidebar = () => {
    //     setSidebarOpen(prev => !prev);
    // };
    const { isSidebarHidden, toggleSidebar } = useSideBarContext();
    return (
        <>
            {/* Sidebar component: This will be displayed on the left side of the screen */}
            {/* <Sidebar isOpen={sidebarOpen} /> */}
            <Sidebar isOpen={isSidebarHidden} />
            <div className={`main-wrapper ${isSidebarHidden ? 'main-width' : ''}`}>
                {/* Header component: This will be displayed at the top of the page */}
                <Header isOpen={isSidebarHidden} onToggleSidebar={toggleSidebar} />
                {/* Outlet: This is where the child routes (nested components) will be rendered */}
                <Outlet />
            </div>

        </>
    )
}


export default Layout
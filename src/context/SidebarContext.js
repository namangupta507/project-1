import React, { createContext, useContext, useEffect, useState } from "react";

const SideBarContext = createContext(null);

export const SideBarProvider = ({ children }) => {

    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarHidden((prev) => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 576) {
                setIsSidebarHidden(true);
            } else {
                setIsSidebarHidden(false);
            }
        };
        // Run once on mount to set initial state based on window size
        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <SideBarContext.Provider value={{ isSidebarHidden, toggleSidebar }}>
            {children}
        </SideBarContext.Provider>
    );
};

export const useSideBarContext = () => useContext(SideBarContext);

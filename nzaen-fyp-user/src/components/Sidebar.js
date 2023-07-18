import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';
import Avatar from "./Avatar";
import "./Sidebar.css";
import DashboardIcon from '../assets/dashboard_icon.svg';
import AddIcon from '../assets/add_icon.svg';

export default function Sidebar() {
    const { user } = useAuthContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>

            {isSidebarOpen && (
                <div className="sidebar">
                    <div className="sidebar-content">
                        <div className="user">
                            <Avatar src={user.photoURL} />
                            <p>Hey, {user.displayName}</p>
                        </div>
                        <nav className="links">
                            <ul>
                                <li>
                                    <NavLink exact to="/">
                                        <span>Assigned Surveys</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/surveyhistory">
                                        <span>Completed Surveys</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink exact to="/feedback">
                                        <span>Give Feedback</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

        </div>
    );
}

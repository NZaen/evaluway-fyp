import React from 'react'
import { NavLink } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import Avatar from "./Avatar"

// styles & images
import "./Sidebar.css"


export default function Sidebar() {
    const { user } = useAuthContext()

    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className="user">
                    <Avatar src={user.photoURL} />

                    <p>Hey, {user.displayName}</p>
                </div>
                <nav className="links">
                    <ul>
                        <li>
                            <NavLink exact to="/" links>
                                {/* <img src={DashboardIcon} alt="dashboard icon" /> */}
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/create">
                                {/* <img src={AddIcon} alt="add project icon" /> */}
                                <span>New Survey</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/usermanage">
                                {/* <img src={AddIcon} alt="add project icon" /> */}
                                <span>User Management</span>
                            </NavLink>
                        </li>


                    </ul>
                </nav>

            </div>
        </div>
    )
}
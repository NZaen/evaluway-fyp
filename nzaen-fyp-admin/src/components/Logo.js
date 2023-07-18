import React from 'react'
import { NavLink } from "react-router-dom"
// styles
import './Logo.css'
import logo from '../assets/12.svg'

export default function Logo() {
    return (
        <div className="logo">
            <NavLink to="/profile">
                <img src={logo} alt="Logo" />
            </NavLink>
        </div>

    )
}
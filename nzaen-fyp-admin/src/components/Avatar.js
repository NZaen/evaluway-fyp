import React from 'react'
import { NavLink } from "react-router-dom"
// styles
import './Avatar.css'

export default function Avatar({ src }) {
    return (
        <div className="avatar">

            <NavLink to="/profile">
                <img src={src} alt="user avatar" />
            </NavLink>
        </div>

    )
}
import React from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

// styles & images
import './Navbar.css'
import LogoPic from '../assets/logo.png'




export default function Navbar() {
    const { logout, isPending } = useLogout()
    const { user } = useAuthContext()

    return (
        <nav className="navbar">
            <ul>
                <li className="logo">
                    <img src={LogoPic}></img>
                    <h2>User</h2>
                    &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                    <p>   Real Time Evaluation System</p>
                </li>
                {!user && (
                    <>


                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                    </>
                )}

                {user && (
                    <li>
                        {!isPending && <button onClick={logout}>Logout</button>}
                        {isPending && <button disabled>Logging out...</button>}
                    </li>
                )}
            </ul>
        </nav>
    )
}
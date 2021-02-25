import React from 'react'
import {Link} from 'react-router-dom'

 const Navbar = () => {
    return (
        <div>
            <nav className="navbar">
                <ul>
                    <li><a href="!#">Itineraries</a></li>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar;
import { Link } from "react-router-dom"

import { Trees } from 'lucide-react'

// navber props
type NavbarProps = {
    isLoggedIn: string | null,
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    return (
        <nav className="navbar flex justify-between bg-card border-b border-border">
            <div className="logo flex justify-start items-center">
                <Trees />
                <h1>FamilyTree</h1>
            </div>
            <ul className="nav-list flex justify-end items-center">
                {!isLoggedIn && (
                    <>
                        <li className="nav-item bg-gradient-to-r text-black px-6 py-2 mr-4 text-lg shadow-lg rounded-2xl"><Link to="/auth" className="nav-link">Sign In</Link></li>
                        <li className="nav-item bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 py-2 mr-4 text-lg shadow-lg rounded-2xl"><Link to="/auth" className="nav-link">Get Started</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

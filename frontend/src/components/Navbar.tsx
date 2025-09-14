import { Link } from "react-router-dom"

import { Trees } from 'lucide-react'

// navber props
type NavbarProps = {
    isLoggedIn: string | null,
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    return (
        <nav className="navbar sticky top-0 z-50 flex justify-between bg-background border-b border-border px-4">
            <div className="logo flex items-center space-x-2">
                <Trees className="h-10 w-10 text-black-50" />
                <h1 className="text-2xl md:text-3xl font-bold">FamilyTree</h1>
            </div>
            <ul className="nav-list flex items-center space-x-4 ml-auto">
                {!isLoggedIn && (
                    <>
                        <li className="nav-item bg-background text-black px-5 py-1.5 text-lg shadow-lg rounded-2xl hover:scale-110"><Link to="/auth" className="nav-link">Sign In</Link></li>
                        <li className="nav-item bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-5 py-1.5 text-lg shadow-lg rounded-2xl hover:scale-110"><Link to="/auth" className="nav-link">Get Started</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

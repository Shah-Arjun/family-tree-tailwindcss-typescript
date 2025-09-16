import { Link } from "react-router-dom"
import { Trees, Menu, X } from 'lucide-react'
import { useState } from "react"



export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)




    return (
        <nav className="sticky top-0 z-50 p-3 flex justify-between bg-background border-b border-border px-4">

            {/* logo */}
            <div className="flex items-center space-x-2 relative">
                <Trees className="h-10 w-10 text-black/70" />
                <h1 className="text-2xl md:text-3xl font-bold">FamilyTree</h1>
            </div>

            {/* Desktop nav */}
            <ul className="hidden sm:flex items-center space-x-4 ml-auto">
                <li><Link to="/auth" className="bg-background text-black px-5 py-1.5 text-lg shadow-md rounded-2xl hover:border">Sign In</Link></li>
                <li><Link to="/auth" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-5 py-1.5 text-lg shadow-md rounded-2xl hover:scale-110">Get Started</Link></li>
            </ul>

            {/* mobile responsive--- shows menu bar */}
            {/* menu button */}
            <button className="sm:hidden p-2 rounded-md text-black focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* mobile nav--dropdown */}
            {isOpen && (
                <ul className={`absolute top-16 left-0 w-full bg-background border-t border-border flex flex-col space-y-2 pb-4 pl-4 pt-8 sm:hidden shadow-md transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    <li><Link to='/auth' onClick={() => setIsOpen(false)} className="block w-full bg-background text-black px-5 py-2 text-lg shadow-md border border-black/50 rounded-2xl text-center hover:scale-105 transition" >Sign In</Link></li>
                    <li><Link to='/auth' onClick={() => setIsOpen(false)} className="block w-full bg-gradient-to-r from-primary to-accent text-white px-5 py-2 text-lg shadow-md rounded-2xl text-center hover:scale-105 transition" >Get Started</Link></li>
                </ul>
            )}

        </nav>
    )
}
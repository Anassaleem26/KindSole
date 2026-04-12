import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="z-50 w-full flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-200 bg-white shadow-md fixed top-0 left-0 ">

            {/* 1. Left Side: Logo */}
            <div className="flex-shrink-0 z-30">
                <Link to="/">
                    <img src="/src/assets/logo/Logo TR.png" alt="Kindsole Logo" className="h-6 md:h-7 w-auto object-contain" />
                </Link>
            </div>

            {/* 2. Center: Navigation Links (Responsive) */}
            <ul className={`
                /* Mobile Styles: Full screen overlay */
                fixed inset-0 bg-white flex flex-col items-center justify-center space-y-8 z-20 transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                
                /* Desktop Styles: Reset for md screens and up */
               md:absolute md:left-1/2 md:-translate-x-1/2 md:flex md:flex-row md:space-y-0 md:space-x-10 md:inset-auto md:bg-transparent 
            `}>
                <li>
                    <Link
                        to="/men"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg md:text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                    >Men</Link>
                </li>
                <li>
                    <Link
                        to="/women"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg md:text-sm font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                    >Women</Link>
                </li>
                <li>
                    <Link
                        onClick={() => setIsMenuOpen(false)}
                        to="/sale"
                        className="text-lg md:text-sm font-bold uppercase tracking-widest text-red-600 hover:underline decoration-2 underline-offset-8"
                    >Sale</Link>
                </li>
                {/* About Link inside mobile menu */}
                <li className="lg:hidden">
                    <Link
                        onClick={() => setIsMenuOpen(false)}
                        to="/about"
                        className="text-lg font-bold uppercase tracking-widest"
                    >About</Link>
                </li>
            </ul>

            {/* 3. Right Side: Utilities & Icons */}
            <div className="flex items-center space-x-3 md:space-x-5 text-gray-700 z-30">

                <Link
                    to="/about"
                    className="hidden lg:block hover:text-black text-sm font-medium"
                >About</Link>

                {/* Search Toggle */}
                <Link
                    to="/search"
                    onClick={() => { setIsMenuOpen(false) }}
                    className="hover:text-black focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </Link>

                {/* Help Icon - Hidden on small mobile */}
                <Link
                    to="/help" title="Help"
                    className="hidden sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Link>

                {/* Account Icon */}
                <Link
                    to="/Signup"
                    title="Account">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </Link>

                {/* Shopping Cart Icon */}
                <Link
                to="/cart"
                    className="flex items-center cursor-pointer hover:text-black"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="ml-1 text-sm font-bold">0</span>
                </Link>

                {/* Mobile Menu Toggle (Hamburger) */}
                <button
                    className="md:hidden focus:outline-none z-40"
                    onClick={() => { setIsMenuOpen(!isMenuOpen); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;




import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        // Changed: bg-black, text-white, and border-gray-800 for a subtle line
        <footer className="bg-black text-white border-t border-gray-800">

            {/* 1. Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

                {/* Brand Section */}
                <aside className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
                    {/* Note: Ensure your logo is white/transparent or use a filter: invert class */}
                    <img src="/src/assets/logo/Logo TR.png" alt="Kindsole" className="h-8 w-auto object-contain self-start brightness-0 invert" />
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                        Crafting comfort for every journey. Kindsole provides sustainable, high-quality footwear for the modern explorer.
                    </p>
                </aside>

                {/* Shop Section */}
                <nav className="flex flex-col gap-3">
                    <h6 className="font-bold text-white uppercase tracking-widest text-xs mb-1">Shop</h6>
                    <Link to="/men" className="text-sm text-gray-400 hover:text-white transition-colors">Men's Shoes</Link>
                    <Link to="/women" className="text-sm text-gray-400 hover:text-white transition-colors">Women's Shoes</Link>
                    <Link to="/sale" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Sale</Link>
                    <Link to="/new-arrivals" className="text-sm text-gray-400 hover:text-white transition-colors">New Arrivals</Link>
                </nav>

                {/* Company Section */}
                <nav className="flex flex-col gap-3">
                    <h6 className="font-bold text-white uppercase tracking-widest text-xs mb-1">Company</h6>
                    <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">Our Story</Link>
                    <Link to="/stores" className="text-sm text-gray-400 hover:text-white transition-colors">Find a Store</Link>
                    <Link to="/sustainability" className="text-sm text-gray-400 hover:text-white transition-colors">Sustainability</Link>
                    <Link to="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
                </nav>

                {/* Support Section */}
                <nav className="flex flex-col gap-3">
                    <h6 className="font-bold text-white uppercase tracking-widest text-xs mb-1">Support</h6>
                    <Link to="/help" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link>
                    <Link to="/returns" className="text-sm text-gray-400 hover:text-white transition-colors">Returns & Exchanges</Link>
                    <Link to="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors">Shipping Info</Link>
                    <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                </nav>
            </div>

            {/* 2. Bottom Bar (Legal & Socials) */}
            {/* Changed: bg-[#0a0a0a] for a slightly different shade of black to separate segments */}
            <div className="bg-[#0a0a0a] border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-8 md:px-10 flex flex-col-reverse md:flex-row justify-between items-center gap-6">

                    <aside className="text-center md:text-left">
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Kindsole Industries Ltd.
                        </p>
                        <p className="text-xs text-gray-600 italic mt-1">
                            Better steps for a better planet.
                        </p>
                    </aside>

                    <nav>
                        <div className="flex items-center gap-6 text-gray-400">
                            <a href="#" className="hover:text-blue-400 transition-all hover:scale-110" aria-label="Twitter">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="hover:text-pink-500 transition-all hover:scale-110" aria-label="Instagram">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="hover:text-blue-600 transition-all hover:scale-110" aria-label="Facebook">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React, { useEffect, useState } from 'react'
import { FaBars, FaHeart, FaSearch, FaShoppingCart, FaTimes, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { FaUserGear } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import { fetchCartItemsRequest, fetchCartItemsSuccess, fetchCartItemsFailure } from '../redux/slices/cartSlice';
import ImageGallery from './ImageGallery';

function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const cartItems = useSelector(state => state.cart.cartItems);
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const searchString = encodeURIComponent(String(query).trim());
        if (searchString) {
            navigate(`/search?q=${searchString}`);
            setShowSearch(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchWishlist());
            
            const fetchCart = async () => {
                dispatch(fetchCartItemsRequest());
                try {
                    const response = await fetch(`${import.meta.env.VITE_PORT}/api/cart/getcart/${currentUser._id}`);
                    if (!response.ok) throw new Error('Failed to fetch items');
                    const data = await response.json();
                    dispatch(fetchCartItemsSuccess(Array.isArray(data) ? data : []));
                } catch (error) {
                    dispatch(fetchCartItemsFailure(error.message));
                }
            };
            fetchCart();
        }
    }, [currentUser, dispatch]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/getAllcategory`);
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : (data?.categories || []));
            } catch (err) {
                console.error("Error fetching categories for header:", err);
            }
        };
        fetchCategories();
    }, []);

    const navLinks = categories
        .filter(cat => cat && cat.name && cat.name.toLowerCase() !== 'demo')
        .map(cat => ({
            name: cat.name,
            path: `/category/${cat.name.toLowerCase().replace(/ /g, '-')}`
        }));

    return (
        <header className="w-full bg-white sticky top-0 z-50">
            {/* Top Banner - Slim and Premium */}
            <div className="w-full bg-pink-500 text-white py-1 text-center text-[8px] md:text-xs font-medium tracking-[0.2em] px-4 uppercase">
                SilverWale Lifetime Exchange & Buyback
            </div>

            {/* Main Nav Row */}
            <div className="container mx-auto px-4 md:px-8 py-2 md:py-4 flex items-center justify-between border-b border-gray-100">
                {/* Left: Mobile Menu & Desktop Info */}
                <div className="flex items-center space-x-4 flex-shrink-0 md:flex-1">
                    <button
                        className="text-gray-800 hover:text-black transition-colors md:mr-4 lg:hidden"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <FaBars className="h-4 w-4 md:h-6 md:w-6" />
                    </button>
                    <div className="hidden md:flex flex-col items-start bg-gray-50 px-2 lg:px-4 py-1 lg:py-2 rounded-md border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md hover:-translate-y-0.5 group">
                        <div className="flex items-center text-xs md:text-sm text-gray-700 space-x-1 lg:space-x-2 group-hover:text-black transition-colors">
                            <FaPhoneAlt className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-400 group-hover:text-black" />
                            <span className="tracking-[0.05em] lg:tracking-[0.1em] font-bold">+91-9924559125</span>
                        </div>
                        <p className="text-[7px] md:text-[8px] text-gray-400 uppercase tracking-widest font-bold mt-0.5 lg:mt-1 group-hover:text-gray-600 transition-colors">Inquiry & Support</p>
                    </div>
                </div>

                {/* Center: Logo & Name Side-by-Side */}
                <div className="flex-1 md:flex-[2] flex justify-center overflow-hidden px-1 md:px-4">
                    <Link to="/" className="flex items-center group space-x-2 md:space-x-3 lg:space-x-5">
                        <img 
                            src="/LOGO.png" 
                            alt="SilverWale Logo" 
                            className="h-5 min-w-[15px] md:h-10 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                        />
                        <span className="text-[12px] md:text-2xl lg:text-4xl font-serif tracking-widest md:tracking-[0.15em] lg:tracking-[0.25em] text-black font-light uppercase leading-none border-l border-gray-100 pl-1.5 md:pl-3 lg:pl-5 whitespace-nowrap">
                            SilverWale
                        </span>
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end space-x-1 md:space-x-4 lg:space-x-8 flex-shrink-0 md:flex-1">
                    {/* Desktop Integrated Search Bar */}
                    <form onSubmit={handleSearch} className="hidden lg:flex items-center border-b border-gray-200 py-2 focus-within:border-black transition-colors mr-2 h-10">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            className="bg-transparent text-[11px] tracking-[0.2em] outline-none w-16 lg:w-44 px-2 font-medium placeholder:text-gray-400 h-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="text-gray-400 hover:text-black transition-colors h-full flex items-center px-1">
                            <FaSearch className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                    </form>

                    {/* Mobile Only: Small Search Icon toggle */}
                    <button
                        className="lg:hidden text-gray-800 hover:text-black transition-colors flex items-center h-10"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <FaSearch className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-8 h-10">
                        {/* 1. Admin Case: Only Profile and Dashboard */}
                        {currentUser?.userType === "admin" ? (
                            <>
                                <Link to="/profile" className="text-gray-800 hover:text-black transition-all flex items-center h-full">
                                    <FaUser className="h-6 w-6" />
                                </Link>
                                <Link to="/dashboard" className="text-gray-800 hover:text-black transition-all flex items-center h-full">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </Link>
                            </>
                        ) : (
                            /* 2. Customer or Guest Case: Wishlist, Cart, and Account */
                            <>
                                <Link to="/wishlist" className="relative text-gray-800 hover:text-black transition-all flex items-center h-full">
                                    <FaHeart className="h-5 w-5 md:h-6 md:w-6" />
                                    {wishlistIds?.length > 0 && (
                                        <span className="absolute -top-1 -right-2.5 bg-black text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                            {wishlistIds.length}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/cart" className="relative text-gray-800 hover:text-black transition-all flex items-center h-full">
                                    <FaShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                                    {cartItems?.length > 0 && (
                                        <span className="absolute -top-1 -right-2.5 bg-black text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>

                                {!currentUser ? (
                                    <Link to="/signin" className="text-gray-800 hover:text-black transition-all flex items-center h-full">
                                        <FaUser className="h-5 w-5 md:h-6 md:w-6" />
                                    </Link>
                                ) : (
                                    <Link to="/profile" className="text-gray-800 hover:text-black transition-all flex items-center h-full">
                                        <FaUser className="h-5 w-5 md:h-6 md:w-6" />
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Visible below top row when search icon is clicked or by default on home? */}
            {/* Mobile Search Bar - Visible below top row when search icon is clicked and toggled */}
            {showSearch && (
                <div className="lg:hidden w-full px-4 py-2 bg-white border-b border-gray-50">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <FaSearch className="absolute left-3 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="SEARCH"
                            className="w-full bg-[#f9f9f9] border border-gray-200 py-2.5 pl-10 pr-4 text-xs tracking-widest outline-none focus:border-black transition-all rounded-sm uppercase font-medium"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                </div>
            )}

            {/* Bottom Nav Row (Desktop Only) */}
            <nav className="hidden lg:block w-full border-b border-gray-100">
                <ul className="container mx-auto px-4 flex justify-center space-x-4 lg:space-x-10 py-3 lg:py-5 text-[10px] lg:text-sm font-medium tracking-[0.2em] text-gray-700">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className="hover:text-black hover:border-b hover:border-black transition-all pb-1 uppercase whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
                <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                        <span className="text-xl font-serif tracking-[0.2em] uppercase font-light">SilverWale</span>
                        <button onClick={() => setIsMenuOpen(false)}>
                            <FaTimes className="h-6 w-6 text-gray-400 hover:text-black" />
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50/50">
                        <Link
                            to={currentUser ? "/profile" : "/signin"}
                            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 text-gray-400">
                                <FaUser className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold">Account</p>
                                <p className="text-xs font-semibold uppercase">{currentUser ? currentUser.username : "Sign In / Join"}</p>
                            </div>
                        </Link>
                    </div>

                    <ul className="py-2">
                        {navLinks.map((link) => (
                            <li key={link.name} className="border-b border-gray-50 last:border-0">
                                <Link
                                    to={link.path}
                                    className="flex items-center justify-between px-8 py-5 text-xs font-medium tracking-[0.2em] text-gray-800 hover:bg-gray-50 uppercase"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                    <span className="text-gray-300 text-lg">›</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="p-8 mt-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-[10px] tracking-widest text-gray-400 uppercase font-bold mb-4">Support</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 uppercase tracking-widest font-semibold hover:text-black cursor-pointer mb-4">
                            <FaPhoneAlt className="h-3 w-3" />
                            <span>+91-9924559125</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;



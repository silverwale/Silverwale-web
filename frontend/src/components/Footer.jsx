import React from 'react'
import { FaFacebook, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-100 py-16">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-serif tracking-[0.2em] uppercase text-black">
                            SilverWale
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Step into brilliance with SilverWale. Your ultimate destination for fine jewellery, accessories, and timeless pieces.
                        </p>
                        <div className="flex space-x-5">
                            <a href="https://instagram.com" className="text-gray-400 hover:text-black transition-colors">
                                <FaInstagram className="h-5 w-5" />
                            </a>
                            <a href="https://facebook.com" className="text-gray-400 hover:text-black transition-colors">
                                <FaFacebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-black">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/category/ring" className="hover:text-black transition-colors">Rings</Link></li>
                            <li><Link to="/category/earring" className="hover:text-black transition-colors">Earrings</Link></li>
                            <li><Link to="/category/necklace" className="hover:text-black transition-colors">Necklaces</Link></li>
                            <li><Link to="/explore" className="hover:text-black transition-colors">Collections</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-black">Information</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link to="/about" className="hover:text-black transition-colors">Our Story</Link></li>
                            <li><Link to="/faq" className="hover:text-black transition-colors">FAQS</Link></li>
                            <li><Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-6 text-black">Contact</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                                <span>Ahmedabad, India</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhoneAlt className="h-4 w-4 text-gray-400" />
                                <span>+91 9924559125</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="h-4 w-4 text-gray-400" />
                                <span>silverwale025@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest text-gray-400 uppercase">
                    <p>© 2026 SILVERWALE JEWELLERY. ALL RIGHTS RESERVED.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>BIS HALLMARKED</span>
                        <span>CERTIFIED DIAMONDS</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
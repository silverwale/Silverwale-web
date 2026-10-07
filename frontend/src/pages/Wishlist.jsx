import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';

function Wishlist() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, currentUser]);

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    const getImagePath = (product) => {
        const img = product?.image?.[product?.coverImageIndex ?? 0] || product?.image?.[0];
        if (!img) return '/ErrorImage.png';
        return img.includes('cloudinary.com') ? img : `/${img.split(/[\\/]/).pop()}`;
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-20">
                    <FaHeart className="h-10 w-10 text-gray-200" />
                    <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold">Please sign in to view your wishlist</p>
                    <Link to="/signin" className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all">
                        Sign In
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Page Header */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-10 pb-6 flex items-end justify-between border-b border-gray-100">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">My Collection</p>
                    <h1 className="text-3xl font-serif italic text-gray-900">Wishlist</h1>
                </div>
                {items.length > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </span>
                )}
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-10">
                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                    </div>
                ) : items.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <FaHeart className="h-7 w-7 text-gray-200" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Your wishlist is empty</p>
                            <p className="text-xs text-gray-300">Save pieces you love and come back to them anytime</p>
                        </div>
                        <Link
                            to="/"
                            className="bg-black text-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                        {items.map((product) => (
                            <div key={product._id} className="group relative flex flex-col space-y-3">
                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(product._id)}
                                    className="absolute top-3 right-3 z-10 w-6 h-6 bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                    title="Remove from Wishlist"
                                >
                                    <IoMdClose className="text-sm" />
                                </button>

                                {/* Product Image */}
                                <Link to={`/products/${product._id}`} className="block relative aspect-square bg-[#f9f9f9] overflow-hidden">
                                    <img
                                        src={getImagePath(product)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => e.target.src = '/ErrorImage.png'}
                                    />
                                    {/* View Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="w-full bg-black text-white text-[8px] tracking-[0.2em] font-bold py-2.5 text-center uppercase">
                                            View Details
                                        </div>
                                    </div>
                                </Link>

                                {/* Product Info */}
                                <div className="space-y-1.5 px-0.5">
                                    <p className="text-[8px] tracking-[0.2em] text-gray-400 uppercase font-bold">
                                        {product.categoryName || 'Jewellery'}
                                    </p>
                                    <Link to={`/products/${product._id}`}>
                                        <h3 className="text-[12px] font-medium text-gray-800 leading-snug line-clamp-2 hover:text-black transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center space-x-2 pt-1">
                                        <span className="text-sm font-bold text-black">
                                            ₹{Number(product.price).toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-[10px] text-gray-300 line-through">
                                            ₹{Math.round(product.price * 1.05).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Wishlist;

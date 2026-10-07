import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FaHeart, FaRegHeart, FaChevronRight } from 'react-icons/fa';

const ProductCard = ({ product, showWishlistButton = true }) => {
    const images = product?.image || [];
    const [currentImageIndex, setCurrentImageIndex] = useState(product?.coverImageIndex ?? 0);
    const dispatch = useDispatch();
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);

    const isWishlisted = wishlistIds?.includes(product._id);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            toast.error("Please login to add to wishlist");
            return;
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(product._id));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addToWishlist(product._id));
            toast.success("Added to wishlist");
        }
    };

    const handleNextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const currentImage = images[currentImageIndex] || images[0];
    const imagePath = currentImage ? (currentImage.includes('cloudinary.com') ? currentImage : `/${currentImage.split(/[\\/]/).pop()}`) : '/ErrorImage.png';

    return (
        <div className="group relative bg-white transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full border border-gray-50 rounded-sm">
            <Link to={`/products/${product._id}`} className="block flex-grow">
                {/* Image Container */}
                <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
                    <img
                        src={imagePath}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => (e.target.src = '/ErrorImage.png')}
                    />

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 hidden md:block">
                        <div className="w-full bg-black text-white text-[9px] tracking-[0.2em] font-bold py-3 text-center uppercase">
                            View Details
                        </div>
                    </div>

                    {/* Floating Wishlist Button */}
                    {showWishlistButton && (
                        <button
                            onClick={handleWishlistClick}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-sm"
                        >
                            {isWishlisted ? (
                                <FaHeart className="h-4 w-4 text-black" />
                            ) : (
                                <FaRegHeart className="h-4 w-4 text-gray-400 hover:text-black" />
                            )}
                        </button>
                    )}

                    {/* Image Navigation Arrow */}
                    {images.length > 1 && (
                        <button 
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white p-1.5 shadow-sm border border-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        >
                            <FaChevronRight className="h-2.5 w-2.5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Info Container */}
                <div className="p-4 md:p-6 space-y-3">
                    <div className="space-y-1">
                        <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold">
                            {product.categoryName || 'Jewellery'}
                        </p>
                        <h3 className="text-[12px] md:text-[13px] font-medium tracking-wide text-gray-900 leading-tight line-clamp-2 h-8 md:h-10 group-hover:text-black transition-colors uppercase">
                            {product.name}
                        </h3>
                    </div>

                    <div className="flex items-center space-x-3 pt-2">
                        <span className="text-sm md:text-base font-bold text-black tracking-wider">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through tracking-wider">
                            ₹{Number(product.price * 1.1).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;

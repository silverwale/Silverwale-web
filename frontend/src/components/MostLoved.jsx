import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';
import { useSwipe } from '../hooks/useSwipe';

const MostLoved = () => {
    const dispatch = useDispatch();
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const productsPerPage = isMobile ? 2 : 4;
    const totalSlides = Math.ceil(products.length / productsPerPage);

    useEffect(() => {
        if (currentSlide >= totalSlides && totalSlides > 0) {
            setCurrentSlide(totalSlides - 1);
        }
    }, [totalSlides, currentSlide, products.length]);

    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
        onSwipedLeft: () => setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : 0)),
        onSwipedRight: () => setCurrentSlide(prev => (prev > 0 ? prev - 1 : totalSlides - 1))
    });

    const getImagePath = (imageName) => {
        if (!imageName) return '/ring_1.jpeg';
        if (imageName.includes('cloudinary.com')) return imageName;
        return `/${imageName.split(/[\\/]/).pop()}`;
    };

    useEffect(() => {
        const fetchMostLoved = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/all?limit=12`);
                // DEMO ONLY: 7 seconds delay to showcase the skeleton loader. 
                // TO REVERT: Delete the following line or comment it out by adding // at the start of the line.
                // await new Promise(resolve => setTimeout(resolve, 7000));
                
                const data = await res.json();
                const fetched = Array.isArray(data) ? data : (data?.products || []);
                setProducts(fetched.map(p => ({
                    id: p._id,
                    name: p.name,
                    price: `₹${Number(p.price).toLocaleString()}`,
                    image: p.image?.[0] ? p.image[0] : '/ring_1.jpeg',
                    link: `/products/${p._id}`
                })));
            } catch (err) {
                console.error("Error fetching most loved:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMostLoved();
    }, []);


    const isWishlisted = (id) => wishlistIds?.includes(id);

    const toggleWishlist = (id) => {
        if (!currentUser) {
            toast.error("Please login to add to wishlist");
            return;
        }
        if (isWishlisted(id)) {
            dispatch(removeFromWishlist(id));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addToWishlist(id));
            toast.success("Added to wishlist");
        }
    };

    const visibleProducts = products.slice(
        currentSlide * productsPerPage,
        (currentSlide + 1) * productsPerPage
    );

    if (loading) {
        return (
            <section className="w-full py-16 md:py-24 bg-white animate-pulse">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="h-8 bg-gray-100 rounded w-64 mx-auto mb-16"></div>
                    <div className="flex overflow-hidden gap-4">
                        {[...Array(isMobile ? 2 : 4)].map((_, i) => (
                            <div key={i} className="flex-1 space-y-4">
                                <div className="aspect-square bg-[#f9f9f9] w-full"></div>
                                <div className="space-y-3 px-1 md:px-2">
                                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && products.length === 0) return null;

    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-center text-3xl font-serif tracking-widest text-black mb-16">
                    Most Loved on SilverWale
                </h2>

                {/* Product Grid / Slider */}
                <div className="relative overflow-hidden">
                    <div 
                        className="mobile-slider desktop-slider min-h-[350px] transition-transform duration-500"
                        style={{ 
                            "--slide-transform": `calc(-${currentSlide * 100}% - ${currentSlide * 1}rem)`,
                            "--desktop-slide-transform": `calc(-${currentSlide * 100}% - ${currentSlide * 2}rem)`,
                            width: '100%'
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="mobile-slider-item-half desktop-slider-item group relative animate-fadeIn">
                                {/* Wishlist Icon */}
                                <button 
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-3 right-3 z-10 text-gray-400 hover:text-black transition-colors"
                                >
                                    {isWishlisted(product.id) ? (
                                        <FaHeart className="h-4 w-4 md:h-5 md:w-5 text-black" />
                                    ) : (
                                        <FaRegHeart className="h-4 w-4 md:h-5 md:w-5" />
                                    )}
                                </button>

                                <Link to={product.link} className="block">
                                    {/* Image Container */}
                                    <div className="relative aspect-square bg-[#f9f9f9] flex items-center justify-center p-4 md:p-8 overflow-hidden mb-4 md:mb-6">
                                        <img 
                                            src={getImagePath(product.image)} 
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        />
                                        
                                        {/* Hover Customize Button */}
                                        <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                                            <div className="block w-full bg-black !text-white text-[10px] tracking-[0.2em] font-medium py-3 text-center uppercase">
                                                Customize
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1 md:space-y-2 text-left px-1 md:px-2">
                                        <h3 className="text-[9px] md:text-xs font-light tracking-wide text-gray-800 leading-relaxed h-8 md:h-10 line-clamp-2 uppercase">
                                            {product.name}
                                        </h3>
                                        <p className="text-[10px] md:text-sm font-semibold tracking-wider text-black">
                                            {product.price}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center space-x-2 mt-8 md:mt-12 mb-8 md:mb-10">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlide === index ? 'bg-black w-4' : 'bg-gray-200 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Discover Button */}
                <div className="flex justify-center">
                    <Link 
                        to="/explore"
                        className="border border-black px-12 py-3 text-[11px] tracking-[0.3em] font-medium text-black uppercase"
                    >
                        Discover
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MostLoved;


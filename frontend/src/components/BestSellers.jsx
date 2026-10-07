import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSwipe } from '../hooks/useSwipe';

const BestSellers = () => {
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
        onSwipedLeft: () => setCurrentSlide(prev => (prev < products.length - 1 ? prev + 1 : 0)),
        onSwipedRight: () => setCurrentSlide(prev => (prev > 0 ? prev - 1 : products.length - 1))
    });

    const getImagePath = (imageName) => {
        if (!imageName) return '/ring_1.jpeg';
        if (imageName.includes('cloudinary.com')) return imageName;
        return `/${imageName.split(/[\\/]/).pop()}`;
    };

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/all?limit=10`);
                // DEMO ONLY: 7 seconds delay to showcase the skeleton loader. 
                // TO REVERT: Delete the following line or comment it out by adding // at the start of the line.
                // await new Promise(resolve => setTimeout(resolve, 7000));
                
                const data = await res.json();
                const fetched = Array.isArray(data) ? data : (data?.products || []);
                setProducts(fetched.slice(0, 3));
            } catch (err) {
                console.error("Error fetching bestsellers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    useEffect(() => {
        if (hoveredProduct !== null) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => ({
                    ...prev,
                    [hoveredProduct]: (prev[hoveredProduct] || 0) >= (products.find(p => p._id === hoveredProduct)?.image?.length || 3) - 1 ? 0 : (prev[hoveredProduct] || 0) + 1
                }));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [hoveredProduct, products]);

    if (loading) {
        return (
            <section className='w-full py-16 md:py-24 bg-white animate-pulse'>
                <div className='container mx-auto max-w-7xl px-4'>
                    <div className="text-center mb-12 flex flex-col items-center">
                        <div className="h-8 bg-gray-100 rounded w-48 mb-4"></div>
                        <div className="w-12 h-[1px] bg-gray-100"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 overflow-hidden">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full space-y-4">
                                <div className="aspect-[4/5] bg-gray-100 w-full"></div>
                                <div className="pt-6 text-center md:text-left space-y-3">
                                    <div className="h-2 bg-gray-100 rounded w-16 mx-auto md:mx-0"></div>
                                    <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto md:mx-0"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto md:mx-0"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && products.length === 0) return null;

    const bestSellers = products.map(p => ({
        id: p._id,
        name: p.name,
        category: p.categoryName || 'Jewellery',
        price: `₹${Number(p.price).toLocaleString()}`,
        images: p.image?.length > 0 ? p.image : ["/ring_1.jpeg", "/ring_2.jpeg", "/ring_3.jpeg"],
        link: `/products/${p._id}`
    }));

    return (
        <section className='w-full py-16 md:py-24 bg-white'>
            <div className='container mx-auto max-w-7xl px-4'>
                <div className="text-center mb-12">
                    <h2 className='text-2xl md:text-3xl font-serif tracking-widest text-black uppercase mb-4'>Best Sellers</h2>
                    <div className="w-12 h-[1px] bg-black mx-auto"></div>
                </div>

                <div className="relative overflow-hidden">
                    <div 
                        className="mobile-slider md:grid md:grid-cols-3 gap-6 md:gap-12 transition-transform duration-500"
                        style={{ 
                            "--slide-transform": `calc(-${currentSlide * 80}% - ${currentSlide * 1}rem)`,
                            width: '100%',
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {bestSellers.map((product) => (
                            <div
                                key={product.id}
                                className="mobile-slider-item md:w-full group"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <Link to={product.link} className="block">
                                    <div className='relative overflow-hidden aspect-[4/5] bg-[#f9f9f9]'>
                                        {/* Product Images */}
                                        {product.images.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={getImagePath(image)}
                                                alt={product.name}
                                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                                    (hoveredProduct === product.id && (currentImageIndex[product.id] || 0) === imgIndex) || 
                                                    (hoveredProduct !== product.id && imgIndex === 0)
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                }`}
                                            />
                                        ))}
                                        
                                        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[8px] tracking-[0.2em] uppercase font-bold text-black border border-gray-100'>
                                            Trending
                                        </div>
                                    </div>

                                    <div className='pt-6 text-center md:text-left space-y-1 md:space-y-2'>
                                        <p className='text-[8px] md:text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium'>
                                            {product.category}
                                        </p>
                                        <h3 className='text-xs md:text-sm font-medium text-black tracking-wide group-hover:text-gray-600 transition-colors uppercase'>
                                            {product.name}
                                        </h3>
                                        <p className='text-xs md:text-sm font-bold text-black'>
                                            {product.price}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Slider Dots */}
                <div className="flex justify-center space-x-2 mt-8 md:hidden">
                    {bestSellers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlide === index ? 'bg-black w-4' : 'bg-gray-200 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;

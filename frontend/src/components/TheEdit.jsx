import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSwipe } from '../hooks/useSwipe';

const TheEdit = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const totalSlides = Math.ceil(latestProducts.length / 2);
    const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
        onSwipedLeft: () => setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : 0)),
        onSwipedRight: () => setCurrentSlide(prev => (prev > 0 ? prev - 1 : totalSlides - 1))
    });

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/all?sort=newest`);
                // DEMO ONLY: 7 seconds delay to showcase the skeleton loader. 
                // TO REVERT: Delete the following line or comment it out by adding // at the start of the line.
                // await new Promise(resolve => setTimeout(resolve, 7000));
                
                const data = await res.json();
                const products = Array.isArray(data) ? data : (data?.products || []);
                setLatestProducts(products.slice(0, 4));
            } catch (error) {
                console.error("Error fetching latest products for The Edit:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <section className='w-full py-12 md:py-24 bg-white overflow-hidden animate-pulse'>
                <div className='max-w-6xl mx-auto px-4'>
                    <div className='text-center mb-16'>
                        <div className="h-10 bg-gray-100 rounded w-64 mx-auto mb-4"></div>
                        <div className='w-12 h-[1px] bg-gray-100 mx-auto mt-4'></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-full border border-gray-50/50 p-0">
                                <div className="aspect-square bg-[#fbfbfb] w-full mix-blend-multiply"></div>
                                <div className="text-center px-4 py-8 space-y-4">
                                    <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                                    <div className="h-2 bg-gray-100 rounded w-1/4 mx-auto pt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && latestProducts.length === 0) return null;

    return (
        <section className='w-full py-12 md:py-24 bg-white overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-serif tracking-[0.3em] text-black uppercase section-title-premium'>The Edit</h2>
                    <div className='w-12 h-[1px] bg-black mx-auto mt-4'></div>
                </div>
 
                <div className="relative overflow-hidden">
                    <div 
                        className="mobile-slider md:grid md:grid-cols-4 gap-6 md:gap-12 transition-transform duration-500"
                        style={{ 
                            "--slide-transform": `calc(-${currentSlide * 100}%)`,
                            width: '100%',
                        }}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {latestProducts.map((product, idx) => (
                            <div key={product._id} className="mobile-slider-item-half md:w-full group bg-white border border-gray-50/50 hover:border-gray-200 transition-all duration-500">
                                <Link to={`/products/${product._id}`} className="block relative">
                                    <div className="aspect-square overflow-hidden bg-[#fbfbfb] p-8 relative flex items-center justify-center">
                                        <img 
                                            src={product.image?.[0] ? (product.image[0].includes('cloudinary.com') ? product.image[0] : `/${product.image[0].split(/[\\/]/).pop()}`) : '/ErrorImage.png'} 
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                                        />
                                        
                                        {/* Premium Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/90 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 flex-col space-y-4">
                                            <p className="text-white text-[10px] tracking-[0.4em] uppercase font-bold text-center px-4 leading-relaxed">
                                                {product.name}
                                            </p>
                                            <span className="text-white text-[8px] tracking-[0.3em] uppercase border-b border-white pb-1">
                                                View Details
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="py-8 text-center px-4">
                                        <h3 className="text-[12px] text-gray-800 tracking-wider uppercase font-medium mb-3 line-clamp-1 group-hover:text-black transition-colors">{product.name}</h3>
                                        <div className="pt-2">
                                            <span className="inline-block text-[10px] font-bold border-b border-black/20 pb-1 uppercase tracking-[0.3em] group-hover:border-black transition-all">
                                                Read & Shop
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Slider Dots */}
                <div className="flex justify-center space-x-2 mt-8 md:hidden">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlide === index ? 'bg-black w-4' : 'bg-gray-200 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link to="/explore" className="inline-block border border-black px-14 py-4 text-[10px] tracking-[0.4em] font-bold uppercase transition-all hover:bg-black hover:text-white">
                        Explore Collection
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TheEdit;

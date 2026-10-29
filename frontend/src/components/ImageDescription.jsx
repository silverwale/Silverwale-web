import React, { useRef, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

function ImageDescription({ images }) {
    const [slideIndex, setSlideIndex] = useState(0);
    // Filter out any empty strings or nulls to ensure dots are strictly dynamic based on actual images
    const prodimg = (images || []).filter(img => typeof img === 'string' && img.trim() !== '');
    const totalSlides = prodimg.length;

    // Touch swipe state
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchDeltaX = useRef(0);
    const isSwiping = useRef(false);

    const SWIPE_THRESHOLD = 50;

    const nextSlide = () => {
        if (!totalSlides) return;
        setSlideIndex((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        if (!totalSlides) return;
        setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        touchDeltaX.current = 0;
        isSwiping.current = false;
    };

    const handleTouchMove = (e) => {
        const deltaX = e.touches[0].clientX - touchStartX.current;
        const deltaY = e.touches[0].clientY - touchStartY.current;
        touchDeltaX.current = deltaX;

        // If horizontal movement is dominant, prevent vertical scroll and mark as swiping
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            isSwiping.current = true;
            e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        if (!isSwiping.current) return;

        if (touchDeltaX.current < -SWIPE_THRESHOLD) {
            nextSlide();
        } else if (touchDeltaX.current > SWIPE_THRESHOLD) {
            prevSlide();
        }

        touchDeltaX.current = 0;
        isSwiping.current = false;
    };

    return (
        <div className="relative w-full max-w-[600px] mx-auto group">
            <div
                className="relative overflow-hidden rounded-xl bg-gray-100"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-y pinch-zoom' }}
            >
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                >
                    {prodimg.map((prod, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                            <img
                                src={prod.includes('cloudinary.com') ? prod : `/${prod.split(/[\\/]/).pop()}`}
                                alt={`Slide ${index + 1}`}
                                onError={(e) => {
                                    e.target.src = '/ErrorImage.png';
                                }}
                                className="w-full h-[500px] object-cover"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows for Medium to Large Devices (Tablets, Laptops, Desktops) */}
                {totalSlides > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSlide();
                            }}
                            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 hover:text-black shadow-md border border-gray-100/50 items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
                            aria-label="Previous image"
                        >
                            <IoIosArrowBack className="h-5 w-5 -ml-0.5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSlide();
                            }}
                            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-gray-800 hover:text-black shadow-md border border-gray-100/50 items-center justify-center transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto hover:scale-110 active:scale-95 focus:outline-none cursor-pointer"
                            aria-label="Next image"
                        >
                            <IoIosArrowForward className="h-5 w-5 ml-0.5" />
                        </button>
                    </>
                )}
            </div>


            {/* Dots */}
            {totalSlides > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {prodimg.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSlideIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${slideIndex === index
                                ? 'bg-gray-800 w-6'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageDescription;


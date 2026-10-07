import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSwipe } from '../hooks/useSwipe';

function ImageGallery({ isCompact = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamically referencing the specific public folder assets requested
  const banners = [
    {
      image: '/ImageGallery_1.jpeg',
      title: 'Crafted For Brilliance',
      subtitle: 'Expertly designed lab-grown jewellery.',
      link: '/category/necklace',
    },
    {
      image: '/ImageGallery_2.jpeg',
      title: 'Pure Elegance',
      subtitle: 'Timeless designs for every occasion.',
      link: '/category/ring',
    },
    {
      image: '/ImageGallery_3.jpeg',
      title: 'The Modern Heirloom',
      subtitle: 'Luxury redefined for the contemporary woman.',
      link: '/category/earring',
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(goToNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
  });

  return (
    <div className={`relative w-full overflow-hidden bg-white ${isCompact ? 'h-full' : 'mx-auto'}`}>
      <div className={`relative w-full overflow-hidden group ${isCompact ? 'h-full' : 'aspect-[3/1]'}`}{...swipeHandlers}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="relative h-full w-full">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/ImageGallery_1.png'; }}
              />

              {/* Premium Overlay */}
              {!isCompact && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="animate-fadeIn mt-auto mb-10 md:mb-16">
                    <Link
                      to={banner.link}
                      className="inline-block bg-white/20 backdrop-blur-md border border-white text-white px-4 md:px-12 py-1.5 md:py-4 text-[8px] md:text-[10px] tracking-[0.3em] font-bold hover:bg-white hover:text-black transition-all duration-500 uppercase rounded-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              )}

              {/* Compact version for Sidebar */}
              {isCompact && (
                <div className="absolute inset-x-0 bottom-0 bg-black/20 p-2 text-center backdrop-blur-sm">
                  <p className="text-white text-[8px] tracking-widest uppercase font-medium">
                    {banner.title}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Global Controls */}
        <button
          onClick={(e) => { e.preventDefault(); goToPrevious(); }}
          className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaChevronLeft className="h-6 w-6 md:h-10 md:w-10 font-thin" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); goToNext(); }}
          className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaChevronRight className="h-6 w-6 md:h-10 md:w-10 font-thin" />
        </button>

        {/* Slider Dots */}
        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white w-6 md:w-10' : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;




import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Public assets should be referenced directly as strings in Vite/React
const collage1 = '/Selection1.jpg';
const collage2 = '/Selection.jpg';
const collage3 = '/Selection2.jpg';

const KGNSelections = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const selections = [
        { image: collage1, title: 'Silver Sleek', link: '/category/men' },
        { image: collage2, title: 'Golden Radiance', link: '/category/ring' },
        { image: collage3, title: 'Crystal Charm', link: '/category/earring' }
    ];

    return (
        <section className='w-full pt-16 pb-24 md:pt-20 md:pb-48 px-4 bg-white'>
            <div className='max-w-6xl mx-auto'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-serif tracking-[0.3em] text-black uppercase section-title-premium'>SilverWale Selections</h2>
                    <p className='text-gray-400 font-light tracking-[0.2em] text-[10px] md:text-xs uppercase mt-4'>A Curated Journey Through Excellence</p>
                </div>

                {/* Mobile Slider (1 at a time) */}
                <div className="md:hidden relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {selections.map((item, idx) => (
                            <div key={idx} className="w-full flex-shrink-0 px-2">
                                <Link to={item.link} className="block relative aspect-[4/5] overflow-hidden group rounded-sm shadow-lg">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                                    />
                                    <div className="absolute inset-x-4 bottom-6 glass-overlay p-4 text-center">
                                        <span className="text-black text-[9px] tracking-[0.3em] uppercase border-b border-black/30 pb-1">Shop Collection</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Grid Layout - Premium collage */}
                <div className='hidden md:grid grid-cols-12 gap-8 h-[500px] lg:h-[600px] mb-12 md:mb-24 mt-8'>
                    {/* Main Large Image */}
                    <div className='col-span-7 overflow-hidden group cursor-pointer relative card-hover-lift h-full'>
                        <Link to={selections[0].link} className="block h-full">
                            <img
                                src={collage1}
                                alt='SilverWale Selection 1'
                                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
                            <div className="absolute bottom-10 left-10 text-white z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <span className="text-[10px] tracking-[0.4em] uppercase border-b border-white pb-1">Shop Now</span>
                            </div>
                        </Link>
                    </div>

                    {/* Side Stack */}
                    <div className='col-span-5 flex flex-col gap-6 h-full'>
                        <div className='flex-1 overflow-hidden group cursor-pointer relative card-hover-lift'>
                            <Link to={selections[1].link} className="block h-full">
                                <img
                                    src={collage2}
                                    alt='SilverWale Selection 2'
                                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 text-center w-full px-4">
                                    <span className="text-[10px] tracking-[0.3em] uppercase border-b border-white pb-1">Shop Now</span>
                                </div>
                            </Link>
                        </div>
                        <div className='flex-1 overflow-hidden group cursor-pointer relative card-hover-lift'>
                            <Link to={selections[2].link} className="block h-full">
                                <img
                                    src={collage3}
                                    alt='SilverWale Selection 3'
                                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 text-center w-full px-4">
                                    <span className="text-[10px] tracking-[0.3em] uppercase border-b border-white pb-1">Shop Now</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KGNSelections;

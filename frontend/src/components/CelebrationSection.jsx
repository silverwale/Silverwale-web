import React from 'react';
import { Link } from 'react-router-dom';

const CelebrationSection = () => {
    const cards = [
        {
            title: "Engagement Rings",
            image: "/ring_1.jpeg",
            link: "/category/ring"
        },
        {
            title: "Men's Jewellery",
            image: "/ring_6.png",
            link: "/category/men"
        },
        {
            title: "Gardens at Twilight",
            image: "/ring_showcase_1.jpeg",
            link: "/category/garden"
        },
        {
            title: "Bridal Jewellery",
            image: "/Pendant_set_1.png",
            link: "/category/bridal"
        }
    ];

    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-black uppercase">
                        Celebrate With SilverWale
                    </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {cards.map((card, index) => (
                        <Link 
                            key={index}
                            to={card.link}
                            className="group relative block overflow-hidden shadow-sm"
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-[#f9f9f9]">
                                <img 
                                    src={card.image} 
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    onError={(e) => { e.target.src = '/ring_1.jpeg'; }}
                                />
                            </div>
                            <div className="bg-[#8E8D8D] py-3 text-center">
                                <span className="text-white text-[9px] md:text-[11px] font-medium tracking-[0.2em] uppercase">
                                    {card.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrationSection;

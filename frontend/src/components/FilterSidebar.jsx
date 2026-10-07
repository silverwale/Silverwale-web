import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import { GiBigDiamondRing, GiNecklace } from 'react-icons/gi'; // Example icons

const FilterSidebar = ({ selectedFilters, onFilterChange, onClearAll, currentCount }) => {
    const [openSections, setOpenSections] = useState({
        'Jewellery Types': true,
        'Price Range': true
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/getAllcategory`);
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : (data?.categories || []));
            } catch (err) {
                console.error("Error fetching categories for filter:", err);
            }
        };
        fetchCategories();
    }, []);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const priceRanges = [
        { id: 'p1', name: 'Under ₹5,000', min: 0, max: 5000 },
        { id: 'p2', name: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
        { id: 'p3', name: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
        { id: 'p4', name: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
        { id: 'p5', name: 'Over ₹50,000', min: 50000, max: 1000000 },
    ];

    const totalItems = categories.reduce((acc, cat) => acc + (Array.isArray(cat.products) ? cat.products.length : 0), 0);

    const filterSections = [
        { 
            name: 'Jewellery Types', 
            type: 'category', 
            data: [
                { id: 'all', name: 'All Collection', type: 'category', icon: <GiNecklace className="inline mr-2" />, count: totalItems },
                ...categories.filter(c => c && c.name).map(c => ({ 
                    id: c._id, 
                    name: c.name, 
                    type: 'category', 
                    icon: <GiBigDiamondRing className="inline mr-2" />, 
                    count: Array.isArray(c.products) ? c.products.length : 0 
                }))
            ] 
        },
        { name: 'Price Range', type: 'price', data: priceRanges.map(p => ({ ...p, type: 'price' })) }
    ];

    return (
        <aside className="w-full md:w-64 flex-shrink-0 bg-white pr-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-medium tracking-wide text-gray-800">Filters</h2>
                <button 
                    onClick={onClearAll}
                    className="text-xs text-gray-500 hover:text-black transition-colors underline uppercase tracking-widest font-semibold"
                >
                    Clear All
                </button>
            </div>

            <div className="mb-8 pl-0.5">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] font-bold">
                    Showing <span className="text-black font-extrabold">{currentCount || 0}</span> Results
                </p>
            </div>

            {/* Selected Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {selectedFilters.map(filter => (
                    <div 
                        key={filter.id} 
                        className="bg-gray-50 flex items-center px-3 py-1.5 rounded-sm border border-gray-100 group animate-fadeIn"
                    >
                        <span className="text-[11px] text-gray-700 font-medium">{filter.name}</span>
                        <button 
                            onClick={() => onFilterChange(filter)}
                            className="ml-2 text-gray-400 group-hover:text-black transition-colors"
                        >
                            <FaTimes className="h-2 w-2" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-1">
                {filterSections.map((section) => (
                    <div key={section.name} className="border-b border-gray-100 py-4">
                        <button 
                            onClick={() => toggleSection(section.name)}
                            className="flex justify-between items-center w-full group"
                        >
                            <span className="text-sm md:text-base font-light tracking-wide text-gray-800 group-hover:text-black transition-colors">
                                {section.name}
                            </span>
                            {openSections[section.name] ? (
                                <FaMinus className="h-3 w-3 text-gray-400" />
                            ) : (
                                <FaPlus className="h-3 w-3 text-gray-400" />
                            )}
                        </button>

                        {openSections[section.name] && (
                            <div className="mt-4 space-y-3 pl-1">
                                {section.data.map((item) => (
                                    <label key={item.id} className="flex items-center cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="peer sr-only"
                                                checked={selectedFilters.some(sf => sf.id === item.id)}
                                                onChange={() => onFilterChange(item)}
                                            />
                                            <div className="w-4 h-4 border border-gray-300 rounded-sm peer-checked:bg-black peer-checked:border-black transition-all"></div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-3 flex items-center text-[13px] md:text-sm text-gray-600 group-hover:text-black transition-colors">
                                            {item.icon}
                                            <span className="tracking-wide">{item.name}</span>
                                            {item.count !== undefined && <span className="ml-1 text-gray-400">({item.count})</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default FilterSidebar;

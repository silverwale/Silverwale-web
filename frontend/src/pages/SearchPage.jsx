import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchProductsFailure, searchProductsStart, searchProductsSuccess } from '../redux/slices/searchSlice';
import { trackCategoryVisit } from '../redux/slices/trendingSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

function SearchPage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchResults = useSelector((state) => state.search.searchResults);
    const loading = useSelector((state) => state.search.loading);
    const [sort, setSort] = useState('newest');
    const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(null);

    useEffect(() => {
        if (categoryFilter) {
            dispatch(trackCategoryVisit(categoryFilter));
        }
    }, [categoryFilter, dispatch]);

    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            dispatch(searchProductsStart());
            try {
                const response = await fetch(`${import.meta.env.VITE_PORT}/api/products/search/${query}?sort=${sort}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }
                const data = await response.json();
                dispatch(searchProductsSuccess(data));
            } catch (error) {
                console.error('Error in fetching results: ', error);
                dispatch(searchProductsFailure(error.message));
            }
        };

        fetchSearchResults();
    }, [query, sort, dispatch]);

    const handleFilterChange = (filter) => {
        if (filter.type === 'category') {
            if (filter.id === 'all') {
                setCategoryFilter(null);
            } else {
                setCategoryFilter(prev => prev === filter.id ? null : filter.id);
            }
        } else if (filter.type === 'price') {
            setSelectedPriceFilters(prev => {
                const exists = prev.find(f => f.id === filter.id);
                if (exists) return prev.filter(f => f.id !== filter.id);
                return [...prev, filter];
            });
        }
    };

    const handleClearAll = () => {
        setSelectedPriceFilters([]);
        setCategoryFilter(null);
    };

    const filteredResults = useMemo(() => {
        let results = searchResults || [];
        
        // Filter by category
        if (categoryFilter) {
            results = results.filter(p => p.categoryId?._id === categoryFilter || p.categoryId === categoryFilter);
        }
        
        // Filter by price
        if (selectedPriceFilters.length > 0) {
            results = results.filter(product => {
                return selectedPriceFilters.some(range => {
                    const price = Number(product.price);
                    return price >= range.min && price <= range.max;
                });
            });
        }
        
        return results;
    }, [searchResults, categoryFilter, selectedPriceFilters]);

    const selectedFilters = useMemo(() => {
        const filters = [...selectedPriceFilters];
        if (categoryFilter) {
            filters.push({ id: categoryFilter, name: 'Filtered Category', type: 'category' });
        } else {
            filters.push({ id: 'all', name: 'All Collection', type: 'category' });
        }
        return filters;
    }, [selectedPriceFilters, categoryFilter]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <FilterSidebar 
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={handleClearAll}
                            currentCount={filteredResults.length}
                        />
                    </div>

                    {/* Results Section */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-black uppercase">
                                    Search: {query}
                                </h1>
                                <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
                                    {filteredResults.length} Results Found
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Sort By:</span>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="border-b border-gray-200 text-xs py-2 px-1 focus:outline-none focus:border-black bg-transparent uppercase tracking-widest font-medium"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : (
                            <>
                                {filteredResults.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                        {filteredResults.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <p className="text-gray-500 uppercase tracking-widest text-sm">No products found for "{query}" with active filters</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}

export default SearchPage;

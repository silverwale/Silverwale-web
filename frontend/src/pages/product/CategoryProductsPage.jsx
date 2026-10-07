import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { trackCategoryVisit } from '../../redux/slices/trendingSlice';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import FilterSidebar from '../../components/FilterSidebar';

function CategoryProductsPage() {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ... (rest of the state and useMemo)

    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [sort, setSort] = useState('newest');
    const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    const slug = useMemo(() => {
        const raw = decodeURIComponent(String(categoryName || '')).trim().toLowerCase();
        return raw
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }, [categoryName]);

    const findCategory = (all) => {
        const match = (name) => {
            const s = String(name || '')
                .trim()
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            return s;
        };

        const altSlug = slug.endsWith('s') ? slug.slice(0, -1) : `${slug}s`;

        return (all || []).find((c) => {
            const nameSlug = match(c?.name);
            return (
                nameSlug === slug ||
                nameSlug === altSlug ||
                String(c?._id || '') === String(categoryName || '')
            );
        }) || null;
    };

    const selectedCategory = useMemo(() => findCategory(categories), [categories, slug]);

    useEffect(() => {
        if (selectedCategory?._id) {
            dispatch(trackCategoryVisit(selectedCategory._id));
        }
    }, [selectedCategory?._id, dispatch]);

    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            setError('');
            try {
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/categories/getAllcategory`);
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(Array.isArray(data) ? data : (data?.categories || []));
            } catch (e) {
                setError(e.message);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setProductsLoading(true);
            setError('');
            try {
                // Fetch all products to handle "Other Categories" section too
                const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/all?sort=${sort}`);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                const fetchedProducts = Array.isArray(data) ? data : (data?.products || []);
                setAllProducts(fetchedProducts);
                
                // Set main products (filtered by category initially)
                const catId = selectedCategory?._id;
                if (catId) {
                    setProducts(fetchedProducts.filter(p => (p.categoryId?._id === catId || p.categoryId === catId)));
                } else {
                    setProducts(fetchedProducts);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory?._id, sort, slug]);


    const handleFilterChange = (filter) => {
        if (filter.type === 'category') {
            if (filter.id === 'all') {
                navigate('/category/all');
            } else {
                const filterSlug = filter.name.toLowerCase().replace(/ /g, '-');
                navigate(`/category/${filterSlug}`);
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
        navigate('/category/all');
    };

    const filteredProducts = useMemo(() => {
        if (selectedPriceFilters.length === 0) return products;
        
        return products.filter(product => {
            return selectedPriceFilters.some(range => {
                const price = Number(product.price);
                return price >= range.min && price <= range.max;
            });
        });
    }, [products, selectedPriceFilters]);

    const otherCategoryProducts = useMemo(() => {
        const catId = selectedCategory?._id;
        if (!catId) return [];
        
        // Products from other categories
        let other = allProducts.filter(p => p.categoryId?._id !== catId && p.categoryId !== catId);
        
        // Filter by price if selected
        if (selectedPriceFilters.length > 0) {
            other = other.filter(product => {
                return selectedPriceFilters.some(range => {
                    const price = Number(product.price);
                    return price >= range.min && price <= range.max;
                });
            });
        }
        
        return other.slice(0, 10); // Show up to 10
    }, [allProducts, selectedCategory, selectedPriceFilters]);

    const selectedFilters = useMemo(() => {
        const catFilter = selectedCategory 
            ? [{ id: selectedCategory._id, name: selectedCategory.name, type: 'category' }] 
            : [{ id: 'all', name: 'All Collection', type: 'category' }];
        return [...catFilter, ...selectedPriceFilters];
    }, [selectedCategory, selectedPriceFilters]);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="w-full md:w-64">
                        <FilterSidebar 
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                            onClearAll={handleClearAll}
                            currentCount={filteredProducts.length}
                        />
                    </div>

                    {/* Product Listing Section */}
                    <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-black uppercase">
                                    {selectedCategory?.name || 'All Jewellery'}
                                </h1>
                                <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
                                    {filteredProducts.length} Products Found
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

                        {/* Status Messages */}
                        {(categoriesLoading || productsLoading) && (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        )}
                        
                        {!!error && !categoriesLoading && !productsLoading && (
                            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">{error}</div>
                        )}

                        {!categoriesLoading && !productsLoading && !error && filteredProducts.length === 0 && (
                            <div className="text-center py-20 text-gray-500 uppercase tracking-widest text-sm">No products found matching your filters</div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12 mb-20">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {/* Other Categories Section - only show if on a specific category */}
                        {selectedCategory && otherCategoryProducts.length > 0 && (
                            <div className="border-t border-gray-100 pt-20">
                                <div className="text-center space-y-12">
                                    <h2 className="text-2xl font-medium tracking-tight text-gray-900 font-serif uppercase tracking-[0.2em]">Explore Other Categories</h2>
                                    
                                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12 pt-10">
                                        {otherCategoryProducts.map((p) => (
                                            <div key={p._id} className="group relative flex flex-col space-y-4 text-left">
                                                <Link to={`/products/${p._id}`} className="block relative aspect-square bg-white overflow-hidden border border-gray-50">
                                                    <img 
                                                        src={p.image?.[0] ? (p.image[0].includes('cloudinary.com') ? p.image[0] : `/${p.image[0].split(/[\\/]/).pop()}`) : '/ErrorImage.png'} 
                                                        alt={p.name} 
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </Link>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">{p.categoryName || 'Jewellery'}</p>
                                                    <Link to={`/products/${p._id}`}>
                                                        <h3 className="text-[13px] text-gray-800 font-light leading-relaxed line-clamp-2 hover:text-black transition-colors">{p.name}</h3>
                                                    </Link>
                                                    <p className="text-sm font-bold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="pt-10">
                                        <button 
                                            onClick={() => navigate('/category/all')}
                                            className="px-8 py-3 bg-black text-white text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-colors"
                                        >
                                            View All Products
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
export default CategoryProductsPage;

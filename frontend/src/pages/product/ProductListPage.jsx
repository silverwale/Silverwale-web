import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';

function ProductListPage() {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sort, setSort] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_PORT}/api/products/getProductsByCategory/${categoryId}?sort=${sort}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }
                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId, sort]);

    return (
        <>
            <Header />
            <div className="container mx-auto mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Products in this Category</h1>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="oldest">Oldest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
                {loading && <div>Loading...</div>}
                {!loading && products.length === 0 && (
                    <div>No products available in this category</div>
                )}
                <div className='flex flex-wrap gap-8 justify-center'>
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProductListPage;

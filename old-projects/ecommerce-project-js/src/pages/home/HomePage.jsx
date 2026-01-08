import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Header } from '../../components/Header';
import { ProductsGrid } from './Products.Grid';
import './HomePage.css'

export function HomePage({ cart, loadCart }) {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search');


    // fetch('http://localhost:3000/api/products')
    //     .then((response) => {
    //         return response.json();
    //     }).then((data) => {
    //         console.log(data);
    //     });

    // useEffect(() => {
    //     axios.get('/api/products')
    //         .then((response) => {
    //             setProducts(response.data);
    //         });
    // }, []);

    //using async await
    useEffect(() => {
        const getHomeData = async () => {
            const urlPath = search ? `/api/products?search=${search}` : '/api/products';
            const response = await axios.get(urlPath);
            setProducts(response.data);
        }
        getHomeData();
    }, [search]);

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
            <Header cart={cart} />


            <div className="home-page">
                <ProductsGrid products={products} loadCart={loadCart} />
            </div></>

    )
}
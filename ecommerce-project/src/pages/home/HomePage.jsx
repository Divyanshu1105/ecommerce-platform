import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProductsGrid } from './Products.Grid';
import './HomePage.css'

export function HomePage({ cart }) {
    const [products, setProducts] = useState([]);


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
            const response = await axios.get('/api/products')
            setProducts(response.data);
        }
        getHomeData();
    }, []);

    return (
        <>
            <title>Ecommerce Project</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />
            <Header cart={cart} />


            <div className="home-page">
                <ProductsGrid products={products} />
            </div></>

    )
}
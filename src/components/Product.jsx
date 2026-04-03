import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const Product = () => {
	const { id } = useParams();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await axios.get(`https://dummyjson.com/products/${id}`);
				setProduct(res.data);
			} catch (err) {
				setError("Failed to fetch product");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	if (loading) return <Loader></Loader>;
	if (error) return <h2>{error}</h2>;

	return (
		<div className="product-container">
			<img className="product-image" src={product.thumbnail} alt={product.title} />
			<div className="product-details">
				<h2 className="product-title">{product.title}</h2>
				<p className="product-desc">{product.description}</p>
				<h3 className="product-price">Price: ${product.price}</h3>
				<p className="product-info">Rating: {product.rating}</p>
				<p className="product-info">Brand: {product.brand}</p>
				<p className="product-info">
					Warranty: {product.warrantyInformation || "Not Available"}
				</p>
				<button className="back-button" onClick={() => navigate(-1)}>
					Back to Products
				</button>
			</div>
		</div>
	);
};

export default Product;

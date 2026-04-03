import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Loader from "./Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState("all");
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("none");

	async function fetchProducts(params) {
		try {
			const res = await axios.get("https://dummyjson.com/products");
			setProducts(res.data.products);
		} catch (err) {
			setError("Failed to fetch Data");
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		fetchProducts();
	}, []);

	const categories = ["all", ...new Set(products.map((ele) => ele.category))];

	let filteredProducts = products.filter(
		(ele) =>
			ele.title.toLowerCase().includes(search.toLowerCase()) &&
			(category === "all" ? true : ele.category === category),
	);

	filteredProducts = [...filteredProducts];

	if (sort === "low") {
		filteredProducts.sort((a, b) => a.price - b.price);
	} else if (sort === "high") {
		filteredProducts.sort((a, b) => b.price - a.price);
	}

	const columns = [
		{
			field: "thumbnail",
			headerName: "Image",
			flex: 0.8,
			renderCell: (params) => (
				<img
					src={params.row.thumbnail}
					alt={params.row.title}
					style={{
						width: "100%",
						height: "auto",
						borderRadius: 8,
						objectFit: "cover",
						boxShadow: "2px 2px 10px gray",
					}}
				/>
			),
		},
		{
			field: "title",
			headerName: "Product Name",
			flex: 1,
		},
		{
			field: "price",
			headerName: "Price",
			flex: 0.5,
			renderCell: (params) => <b>${params.row.price}</b>,
		},
		{
			field: "category",
			headerName: "Category",
			flex: 0.7,
		},
		{
			field: "action",
			headerName: "",
			flex: 0.7,
			renderCell: (params) => (
				<Link to={`/product/${params.row.id}`} style={{ padding: "10px" }}>
					More Details
				</Link>
			),
		},
	];
	if (loading) return <Loader></Loader>;

	if (error) return <h2>{error}</h2>;

	return (
		<div className="products-container">
			<div className="filters">
				<input
					type="text"
					placeholder="Search product"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<label>Category:</label>
				<select value={category} onChange={(e) => setCategory(e.target.value)}>
					{categories.map((ele, ind) => (
						<option key={ind} value={ele}>
							{ele}
						</option>
					))}
				</select>
				<label>Price:</label>
				<select value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value="none">None</option>
					<option value="low">Price: Low to High</option>
					<option value="high">Price: High to Low</option>
				</select>
			</div>

			<DataGrid
				rows={filteredProducts}
				columns={columns}
				pagination
				pageSizeOptions={[5, 10]}
				autoHeight
				rowHeight={280}
				initialState={{
					pagination: {
						paginationModel: {
							page: 0,
							pageSize: 5,
						},
					},
				}}
			/>
		</div>
	);
}

export default Products;

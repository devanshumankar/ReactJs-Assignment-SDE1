import React, { useState, useEffect } from "react";
import axios from "axios";
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

	useEffect(() => {
		async function fetchProducts() {
			try {
				const res = await axios.get("https://dummyjson.com/products");
				setProducts(res.data.products);
			} catch (err) {
				setError("Failed to fetch Data");
			} finally {
				setLoading(false);
			}
		}
		fetchProducts();
	}, []);

	const isMobile = window.innerWidth <= 768;
	const categories = ["all", ...new Set(products.map((p) => p.category))];

	let filteredProducts = products.filter(
		(p) =>
			p.title.toLowerCase().includes(search.toLowerCase()) &&
			(category === "all" ? true : p.category === category),
	);
	filteredProducts = [...filteredProducts];

	if (sort === "low") filteredProducts.sort((a, b) => a.price - b.price);
	else if (sort === "high") filteredProducts.sort((a, b) => b.price - a.price);

	const columns = [
		{
			field: "thumbnail",
			headerName: "Image",
			width: isMobile ? 70 : 150,
			renderCell: (params) => (
				<img
					src={params.row.thumbnail}
					alt={params.row.title}
					style={{
						width: isMobile ? 50 : "100%",
						height: isMobile ? 50 : 100,
						borderRadius: 6,
						objectFit: "cover",
					}}
				/>
			),
		},
		{
			field: "title",
			headerName: "Product",
			flex: 1,
			minWidth: isMobile ? 120 : 150,
		},
		{
			field: "price",
			headerName: "Price",
			width: isMobile ? 80 : 100,
			renderCell: (params) => <b>${params.row.price}</b>,
		},
		{
			field: "category",
			headerName: "Category",
			width: isMobile ? 100 : 150,
		},
		{
			field: "action",
			headerName: "",
			width: isMobile ? 100 : 150,
			renderCell: (params) => (
				<Link
					style={{ fontSize: isMobile ? 12 : 14 }}
					to={`/product/${params.row.id}`}
				>
					Details
				</Link>
			),
		},
	];

	if (loading) return <Loader />;
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
					{categories.map((ele, i) => (
						<option key={i} value={ele}>
							{ele}
						</option>
					))}
				</select>
				<label>Price:</label>
				<select value={sort} onChange={(e) => setSort(e.target.value)}>
					<option value="none">None</option>
					<option value="low">Low to High</option>
					<option value="high">High to Low</option>
				</select>
			</div>

			<div style={{ overflowX: "auto" }}>
				<DataGrid
					rows={filteredProducts}
					columns={columns}
					pagination
					pageSizeOptions={[5, 10]}
					autoHeight
					rowHeight={isMobile ? 120 : 280}
					initialState={{
						pagination: {
							paginationModel: { page: 0, pageSize: 5 },
						},
					}}
				/>
			</div>
		</div>
	);
};

export default Products;

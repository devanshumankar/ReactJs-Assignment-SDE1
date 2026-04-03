import React from "react";
import Loader from "./components/Loader";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { Suspense } from "react";
import "./App.css";

const Product = lazy(() => {
	return import("./components/Product");
});

const Products = lazy(() => {
	return import("./components/Products");
});

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<Suspense fallback={<Loader></Loader>}>
					<Products></Products>
				</Suspense>
			),
		},
		{
			path: "/product/:id",
			element: (
				<Suspense fallback={<Loader />}>
					<Product></Product>
				</Suspense>
			),
		},
	]);
	return <RouterProvider router={router}></RouterProvider>;
};

export default App;

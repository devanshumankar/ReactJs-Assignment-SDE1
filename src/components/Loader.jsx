import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
	return (
		<Box>
			<CircularProgress size={60}></CircularProgress>
		</Box>
	);
};

export default Loader;

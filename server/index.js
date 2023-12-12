import express from "express";

// Instantiates an express server
const app = express();

// Serves static files from the public folder
app.use(express.static("public"));

// Starts listening on the specified port
app.listen(process.env.PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});

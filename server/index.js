import fs from "node:fs/promises";
import express from "express";

// Instantiates an express server
const app = express();

// Serves static files from the public folder
app.use(express.static("public"));

// Import all routes
const routes = await fs.readdir(new URL("./routes", import.meta.url));

for (const route of routes) {
	console.log(`Loading route ${route}`);
	const { router } = await import(`./routes/${route}`);
	app.use(router);
}

// Starts listening on the specified port
app.listen(process.env.PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});

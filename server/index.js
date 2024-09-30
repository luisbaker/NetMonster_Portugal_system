import fs from "node:fs/promises";
import express from "express";

// Instantiates an express server
const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta public
app.use(express.static("public"));

// Importa todas as rotas
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

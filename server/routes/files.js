import fs from "node:fs/promises";
import path from "node:path";
import express from "express";
import multer from "multer";

// Configura��o do multer para armazenar arquivos
const upload = multer({ dest: "public/upload" });

// Cria o roteador
const router = express.Router();

// Rota para upload
router.post("/upload", upload.single("file"), async (req, res) => {
	if (!req.file) {
		return res.status(400).send("Nenhum arquivo foi enviado.");
	}

	const name = path.basename(req.file.path);
	const metadata = JSON.stringify({
		name,
		original: req.file.originalname,
		size: req.file.size,
		mimetype: req.file.mimetype,
		date: new Date(),
	});
	const metaFilePath = `${path.resolve(req.file.path)}.meta.json`;

	await fs.writeFile(metaFilePath, Buffer.from(metadata));
	return res.json({ success: `Arquivo ${req.file.originalname} enviado com sucesso!` });
});

// Faz o download de um único upload
router.get("/upload/:file", async (req, res) => {
	return res.sendFile(path.resolve("public/upload", req.params.file));
});

// Rota para listar uploads
router.get("/uploads", async (_req, res) => {
	try {
		const files = await fs.readdir("public/upload");
		const meta = await Promise.all(
			files
				.filter((file) => file.endsWith(".meta.json"))
				.map(async (file) => {
					const metaFilePath = path.resolve("public/upload", file);
					const data = await fs.readFile(metaFilePath, "utf-8");
					return JSON.parse(data);
				}),
		);

		res.json(meta);
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao listar arquivos.");
	}
});

export { router };

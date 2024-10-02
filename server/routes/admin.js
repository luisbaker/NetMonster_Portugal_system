import fs, { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import bloom from "bloom-filters";
import express from "express";
import handler from "express-async-handler";
import basicAuth from "express-basic-auth";
import multer from "multer";

async function* concatFiles(files) {
	for (const file of files) {
		const handler = await fs.open(file, "r");

		try {
			for await (const line of handler.readLines()) {
				const result = line.trim();

				if (result.length) {
					yield result;
				}
			}
		} finally {
			await handler.close();
		}
	}
}

async function firstLine(path) {
	const file = await fs.open(path, "r");

	try {
		for await (const line of file.readLines()) {
			return line;
		}

		return "";
	} finally {
		await file.close();
	}
}

// Configuração do multer para armazenar arquivos
const upload = multer({ dest: tmpdir() });

// Cria o roteador
const router = express.Router();

router.get("/admin", basicAuth({ users: { baker: "12345" }, challenge: true, realm: "NetMonster" }), (_req, res) => {
	res.sendFile(resolve(process.cwd(), "public/csv-view.html"));
});

// Rota para upload
router.post(
	"/admin/merge/:file",
	upload.single("file"),
	handler(async (req, res) => {
		try {
			const filter = new bloom.ScalableBloomFilter();
			const original = resolve("public/database", req.params.file);
			const columns = Math.max(
				...(await Promise.all([
					firstLine(original).then((line) => line.split(";").length),
					firstLine(req.file.path).then((line) => line.split(";").length),
				])),
			);

			const stream = Readable.from(concatFiles([original, req.file.path]))
				.filter((line) => {
					if (filter.has(line)) {
						return false;
					}

					filter.add(line);
					return true;
				})
				.map((line) => {
					const data = line.split(";");
					const missing = line.split(";").length - columns;
					const result = data.concat(Array(missing).fill("")).join(";");

					return Buffer.from(`${result}\n`, "utf-8");
				});

			res.type("application/octet-stream");
			await pipeline(stream, res);
		} finally {
			await rm(req.file.path).catch(() => {});
		}
	}),
);

export { router };

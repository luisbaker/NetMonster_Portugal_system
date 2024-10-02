import fs from "node:fs";
import path from "node:path";
import { parse, stringify } from "csv/sync";
import express from "express";

// Inicializa o roteador do Express
const router = express.Router();

// Função para obter o caminho do diret�rio atual
const _getDirname = (metaUrl) => {
	return path.dirname(new URL(metaUrl).pathname);
};

// Defina o caminho para o diretório onde os arquivos .ntm ser�o armazenados
const filesDirPath = path.resolve(process.cwd(), "public/database");

// Função para ler o CSV (arquivo NTM)
const readCSV = (filePath) => {
	const data = fs.readFileSync(filePath, "utf-8");
	return parse(data, { delimiter: ";" });
};

// Função para escrever no CSV (arquivo NTM)
const writeCSV = (filePath, data) => {
	const csvString = stringify(data, { delimiter: ";" });
	fs.writeFileSync(filePath, csvString);
};

// Rota para listar todos os arquivos .ntm no diretório database
router.get("/files", (_req, res) => {
	try {
		const files = fs.readdirSync(filesDirPath).filter((file) => file.endsWith(".ntm"));
		res.json(files);
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao listar os arquivos");
	}
});

// Rota para obter o conteúdo de um arquivo específico .ntm
router.get("/files/:filename", (req, res) => {
	const { filename } = req.params;
	const filePath = path.join(filesDirPath, filename);

	try {
		if (fs.existsSync(filePath)) {
			const data = fs.readFileSync(filePath, "utf-8");
			res.json({ content: data });
		} else {
			res.status(404).send("Arquivo n�o encontrado");
		}
	} catch (_error) {
		res.status(500).send("Erro ao ler o arquivo");
	}
});

// Rota para salvar as alterações feitas em um arquivo .ntm
router.post("/files/:filename", (req, res) => {
	const { filename } = req.params;
	const filePath = path.join(filesDirPath, filename);
	const { content } = req.body;

	try {
		if (fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, content, "utf-8");
			res.send("Arquivo salvo com sucesso");
		} else {
			res.status(404).send("Arquivo n�o encontrado");
		}
	} catch (_error) {
		res.status(500).send("Erro ao salvar o arquivo");
	}
});

// Rota para adicionar uma nova linha ao arquivo CSV
router.post("/data", (req, res) => {
	const { filename, newRow } = req.body;
	const filePath = path.join(filesDirPath, filename);

	try {
		const data = readCSV(filePath);
		data.push(newRow); // Adiciona a nova linha ao conteúdo existente
		writeCSV(filePath, data);
		res.status(201).send("Registro adicionado com sucesso");
	} catch (_error) {
		res.status(500).send("Erro ao adicionar o registro");
	}
});

// Rota para atualizar uma linha existente no arquivo CSV
router.put("/data/:filename/:id", (req, res) => {
	const { filename, id } = req.params;
	const filePath = path.join(filesDirPath, filename);
	const updatedRow = req.body; // Supondo que o registro atualizado seja enviado no corpo da requisição

	try {
		const data = readCSV(filePath);
		if (data[id]) {
			data[id] = updatedRow; // Atualiza a linha correspondente
			writeCSV(filePath, data);
			res.send("Registro atualizado com sucesso");
		} else {
			res.status(404).send("Linha n�o encontrada");
		}
	} catch (_error) {
		res.status(500).send("Erro ao atualizar o registro");
	}
});

// Rota para deletar uma linha no arquivo CSV
router.delete("/data/:filename/:id", (req, res) => {
	const { filename, id } = req.params;
	const filePath = path.join(filesDirPath, filename);

	try {
		const data = readCSV(filePath);
		if (data[id]) {
			data.splice(id, 1); // Remove a linha correspondente
			writeCSV(filePath, data);
			res.send("Registro deletado com sucesso");
		} else {
			res.status(404).send("Linha n�o encontrada");
		}
	} catch (_error) {
		res.status(500).send("Erro ao deletar o registro");
	}
});

export { router };

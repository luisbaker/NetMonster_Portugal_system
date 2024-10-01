import express from "express";
import multer from "multer";
import fs from "node:fs/promises";
import path from "node:path";

// Configuração do multer para armazenar arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Certifique-se de que esta pasta exista
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Usa o nome original do arquivo
    }
});

const upload = multer({ storage: storage });

// Cria o roteador
const router = express.Router();

// Rota para upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }
    res.send(`Arquivo ${req.file.originalname} enviado com sucesso!`);
});

// Rota para listar arquivos
router.get('/files', async (req, res) => {
    try {
        const files = await fs.readdir('public/uploads');
        res.json(files);
    } catch (error) {
        res.status(500).send('Erro ao listar arquivos.');
    }
});

export { router };

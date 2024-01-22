// map.js
// Importing 'readFile' and 'join' directly from 'fs' and 'path' modules
import { readFile } from "fs/promises";
import { getAllDataForMapFromNetworkCodes } from '../libs/map-points.js';

// Importing the required function from 'map-points.js'
import { getAllDataForMap } from "../libs/map-points.js"; // Corrected import statement

// Função para obter dados brutos do mapa a partir de um arquivo local
const getRawMapData = async (networkCode) => {
	const fileName = `${networkCode}-268.ntm`;
	const rawDataPath = join(__dirname, "public", "database", fileName);

	try {
		// Leia o conteúdo do arquivo
		const data = await readFile(rawDataPath, "utf-8");
		// Supondo que o conteúdo do arquivo contém os dados brutos do mapa
		return data.split("\n").filter((line) => line.trim() !== ""); // Remove linhas em branco
	} catch (error) {
		console.error(
			`Erro ao obter dados brutos do mapa para ${networkCode}:`,
			error,
		);
		throw error;
	}
};

// Função principal para obter dados formatados do mapa
export const getAllDataForMapFromNetworkCodes = async () => {
	const networkCodes = ["01", "02", "03", "06"]; // Códigos de rede para VDF, DIGI, NOS, MEO

	try {
		const allMappedData = [];

		// Itera sobre cada código de rede
		for (const networkCode of networkCodes) {
			const rawMapData = await getRawMapData(networkCode);

			// Faça o mapeamento para o formato desejado
			const mappedData = rawMapData
				.map((point) => {
					const fields = point.split(";");

					// Lógica de mapeamento específica para cada tipo de ponto
					// ... (restante do código)
				})
				.filter((point) => point !== null);

			allMappedData.push(mappedData);
		}

		return allMappedData;
	} catch (error) {
		console.error("Erro ao obter dados do mapa:", error);
		throw error;
	}
};

// Exemplo de uso
const allData = await getAllDataForMap();
console.log(allData);

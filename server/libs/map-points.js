// mapa-points.js
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url'; // Adicionado import

// Use fileURLToPath para converter import.meta.url para um caminho
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Função para obter dados brutos do mapa a partir de um arquivo local
const getRawMapData = async (networkCode) => {
    const fileName = `${networkCode}-268.ntm`;
    const rawDataPath = join(__dirname, 'public', 'database', fileName);

    try {
        // Leia o conteúdo do arquivo
        const data = await readFile(rawDataPath, 'utf-8');
        // Supondo que o conteúdo do arquivo contém os dados brutos do mapa
        return data.split('\n').filter(line => line.trim() !== '');  // Remove linhas em branco
    } catch (error) {
        console.error(`Erro ao obter dados brutos do mapa para ${networkCode}:`, error);
        throw error;
    }
};

// Função principal para obter dados formatados do mapa
export async function getAllDataForMap() {
    const networkCodes = ['01', '02', '03', '06']; // Códigos de rede para VDF, DIGI, NOS, MEO

    try {
        const allMappedData = [];

        // Itera sobre cada código de rede
        for (const networkCode of networkCodes) {
            const rawMapData = await getRawMapData(networkCode);

            // Faça o mapeamento para o formato desejado
            const mappedData = rawMapData.map((point) => {
                const fields = point.split(';');

                // Lógica de mapeamento específica para cada tipo de ponto
                if (fields[0] === '2G') {
                    return {
                        Technology: '2G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CID: fields[3],
                        LAC: fields[4],
                        BSIC: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        ARFCN: fields[10],
                    };
                } else if (fields[0] === '3G') {
                    return {
                        Technology: '3G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CID: fields[3],
                        LAC: fields[4],
                        RNC: fields[5],
                        PSC: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        UARFCN: fields[10],
                    };
                } else if (fields[0] === '4G') {
                    return {
                        Technology: '4G',
                        MCC: fields[1],
                        MNC: fields[2],
                        CI: fields[3],
                        TAC: fields[4],
                        eNB: fields[5],
                        PCI: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        EARFCN: fields[10],
                    };
                } else if (fields[0] === '5G') {
                    return {
                        Technology: '5G',
                        MCC: fields[1],
                        MNC: fields[2],
                        NCI: fields[3],
                        TAC: fields[4],
                        PCI: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                        ARFCN: fields[10],
                    };
                } else if (fields[0] === 'CD') {
                    return {
                        Technology: 'CDMA',
                        MCC: fields[1],
                        MNC: fields[2],
                        BID: fields[3],
                        NID: fields[4],
                        SID: fields[6],
                        Lat: parseFloat(fields[7]),
                        Lon: parseFloat(fields[8]),
                        Location: fields[9],
                    };
                }

                // Adicione mais condições para outros tipos de pontos
                return null; // ou um valor padrão para tipos desconhecidos
            }).filter(point => point !== null);

            allMappedData.push(mappedData);
        }

        return allMappedData;
    } catch (error) {
        console.error('Erro ao obter dados do mapa:', error);
        throw error;
    }
}

// Exemplo de uso
const allData = await getAllDataForMap();
console.log(allData);

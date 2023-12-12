import fs from "node:fs/promises";
import { cellToNtm, getFieldValue } from "./cell-to-ntm.js";

const STORAGE_PATH = new URL("../../public/database/", import.meta.url);

/**
 * Returns the file path for a given filename.
 * @param {string} filename - The name of the file.
 * @returns {URL} - The URL representing the file path.
 */
export function getFilePath(filename) {
	return new URL(filename, STORAGE_PATH);
}

/**
 * Stores an update in the system.
 *
 * @param {Object} update - The update object to be stored.
 * @returns {Promise<void>} - A promise that resolves when the update is stored.
 */
export async function storeUpdate(update) {
	// Writes a log file with the entire update
	const log = JSON.stringify(update);
	const logPath = getFilePath("./updates-beta.log");
	await fs.appendFile(logPath, `${log}\n`);

	// Writes each cell to its own file
	for (const cell of update?.cells || []) {
		const mnc = getFieldValue("MNC", cell);
		const mcc = getFieldValue("MCC", cell);
		const path = getFilePath(`./${mnc}-${mcc}-beta.ntm`);
		const entry = cellToNtm(cell);

		await fs.appendFile(path, `${entry}\n`);
	}
}

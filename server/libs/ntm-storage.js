import fs from "node:fs/promises";
import { cellToNtm, getFieldValue } from "./cell-to-ntm.js";

// Define the base storage path
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
    // Convert the update object to a JSON string and append it to the log file
    const log = JSON.stringify(update);
    const logPath = getFilePath("./updates-quarantine.log");
    await fs.appendFile(logPath, `${log}\n`);

    // Check if the nick is in the whitelist
    const nickInWhitelist = await checkWhitelist(update.nick);

    // Write each cell to its own file
    for (const cell of update?.cells || []) {
        const mnc = getFieldValue("MNC", cell);
        const mcc = getFieldValue("MCC", cell);

        // Determine the filename based on whitelist status
        const fileName = nickInWhitelist ? `./${mnc}-${mcc}.ntm` : `./${mnc}-${mcc}-quarantine.ntm`;
        
        // Get the full file path
        const path = getFilePath(fileName);
        
        // Convert the cell to the appropriate format
        const entry = cellToNtm(cell);

        // Append the entry to the file
        await fs.appendFile(path, `${entry}\n`);
    }
}

/**
 * Checks if the nick is present in the whitelist.
 *
 * @param {string} nick - The nick to be checked.
 * @returns {boolean} - True if the nick is in the whitelist, false otherwise.
 */
async function checkWhitelist(nick) {
    const whitelistPath = getFilePath("whitelist.csv");

    try {
        // Read the content of the whitelist file
        const whitelistContent = await fs.readFile(whitelistPath, "utf-8");

        // Check if the nick is in the whitelist
        return whitelistContent.includes(nick);
    } catch (error) {
        // If an error occurs while reading the file, assume the nick is not in the whitelist
        return false;
    }
}
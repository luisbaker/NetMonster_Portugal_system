/**
 * Represents the storage path for the database.
 * @type {URL}
 */
const STORAGE_PATH = new URL("../../public/database/", import.meta.url);

/**
 * Returns the URL of the specified filename within the storage path.
 * @param {string} filename - The name of the file.
 * @returns {URL} The URL of the file within the storage path.
 */
export function getPath(filename) {
	return new URL(filename, STORAGE_PATH);
}

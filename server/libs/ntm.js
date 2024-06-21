/**
 * @typedef {Object} NetworkTechnology
 * @property {string} format - A string that defines the format for the network technology.
 *                             It includes the technology type and various identifiers separated by semicolons.
 * @property {string[]} technology - An array of strings that represents the different names or versions of the network technology.
 */

/**
 * MAPPING is an object that defines the format and technology types for different network technologies.
 * Each key in the MAPPING object represents a network technology (e.g., 'gsm', 'wcdma', 'lte', 'nr', 'cdma').
 * Each value is an object with two properties: 'format' and 'technology'.
 *
 * @type {Object.<string, NetworkTechnology>}
 */
export const MAPPING = {
	gsm: {
		format: "2G;MCC;MNC;CID;LAC;XXX;BSIC;Lat;Lon;Location;ARFCN",
		technology: ["gsm", "2g", "gprs", "edge"],
	},
	wcdma: {
		format: "3G;MCC;MNC;CID;LAC;RNC;PSC;Lat;Lon;Location;UARFCN",
		technology: ["wcdma", "3g", "umts", "hsdpa", "hsupa", "hspa", "hspa+", "hspa+42"],
	},
	lte: {
		format: "4G;MCC;MNC;CI;TAC;eNB;PCI;Lat;Lon;Location;EARFCN",
		technology: ["lte", "4g", "lte", "lte-a", "lte-a-pro"],
	},
	nr: {
		format: "5G;MCC;MNC;NCI;TAC;gNB;PCI;Lat;Lon;Location;ARFCN",
		technology: ["nr", "5g"],
	},
	cdma: {
		format: "CD2;MCC;MNC;BID;NID;XX1;SID;Lat;Lon;Loc;XX2",
		technology: ["cdma", "cd", "cd2", "evdo"],
	},
};

/**tyu
 * Normalizes the given technology string by converting it to lowercase and removing non-word characters.
 *
 * @param {string} technology - The technology string to be normalized.
 * @returns {string} The normalized technology string.
 */
export function normalizeTechnology(technology) {
	return technology?.toLowerCase?.().replace(/[\W_]+/g, "") || "unknown";
}

/**
 * Represents an error that occurs when an unknown technology is encountered.
 * @class
 * @extends Error
 */
export class UnknownTechnologyError extends Error {
	/**
	 * Creates a new instance of the UnknownTechnologyError class.
	 * @param {string} technology - The unknown technology.
	 */
	constructor(technology) {
		super(`Unknown technology "${technology}"`);
	}
}

/**
 * Represents an error that occurs when an unknown field is encountered.
 * @class
 * @extends Error
 */
export class UnknownFieldError extends Error {
	/**
	 * Creates a new instance of the UnknownFieldError class.
	 * @param {string} field - The unknown field.
	 */
	constructor(field) {
		super(`Unknown field "${field}"`);
	}
}

/**
 * Represents an error that occurs when an invalid field value is encountered.
 * @class
 * @extends Error
 */
export class InvalidFieldValueError extends Error {
	/**
	 * Creates a new instance of InvalidFieldValueError.
	 * @param {string} field - The name of the field.
	 * @param {any} value - The invalid value.
	 */
	constructor(field, value) {
		super(`Invalid value "${value}" for field "${field}"`);
	}
}

/**
 * Retrieves the format for the given technology.
 *
 * @param {string} technology - The technology for which to retrieve the format.
 * @returns {string} The format for the given technology.
 * @throws {UnknownTechnologyError} If the technology is not found in the mapping.
 */
export function getFormat(technology) {
	const needle = normalizeTechnology(technology);

	for (const value of Object.values(MAPPING)) {
		if (value.technology.map(normalizeTechnology).includes(needle)) {
			return value.format;
		}
	}

	throw new UnknownTechnologyError(technology);
}

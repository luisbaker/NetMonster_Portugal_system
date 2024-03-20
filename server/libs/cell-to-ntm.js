const MAPPING = {
	gsm: {
		format: "2G;MCC;MNC;CID;LAC;XXX;BSIC;Lat;Lon;Location;ARFCN",
		technology: ["gsm", "2g", "gprs", "edge"],
	},
	wcdma: {
		format: "3G;MCC;MNC;CID;LAC;RNC;PSC;Lat;Lon;Location;UARFCN",
		technology: [
			"wcdma",
			"3g",
			"umts",
			"hsdpa",
			"hsupa",
			"hspa",
			"hspa+",
			"hspa+42",
		],
	},
	lte: {
		format: "4G;MCC;MNC;CI;TAC;eNB;PCI;Lat;Lon;Location;EARFCN",
		technology: ["lte", "4g", "lte", "lte-a", "lte-a-pro"],
	},
	nr: {
		format: "5G;MCC;MNC;NCI;TAC;XXX;PCI;Lat;Lon;Location;ARFCN",
		technology: ["nr", "5g"],
	},
	cdma: {
		format: "CD2;MCC;MNC;BID;NID;XX1;SID;Lat;Lon;Loc;XX2",
		technology: ["cdma", "cd", "cd2", "evdo"],
	},
};

const FIELD_MAPPING = {
	// Constant value
	"2G": () => "2G",
	// Constant value
	"3G": () => "3G",
	// Constant value
	"4G": () => "4G",
	// Constant value
	"5G": () => "5G",
	// Constant value
	CD2: () => "CD2",
	// Mobile country code
	MCC: (cell) => cell?.network?.mcc?.toString?.(),
	// Mobile network code
	MNC: (cell) => cell?.network?.mnc?.toString?.().padStart(2, "0"),
	// Cell identifier
	CID: (cell) => cell?.cid?.toString?.(),
	// Location area code
	LAC: (cell) => cell?.area?.toString?.(),
	// Ignored value
	XXX: () => "",
	// Base station identity code
	BSIC: (cell) => cell?.code?.toString?.(),
	// Latitude - GPS coordinate
	Lat: (cell) => cell?.latitude?.toString?.(),
	// Longitude - GPS coordinate
	Lon: (cell) => cell?.longitude?.toString?.(),
	// Description of the location
	Location: (cell) => cell?.location?.toString?.(),
	// Radio frequency channel number
	ARFCN: (cell) => cell?.frequency?.toString?.(),
	// Radio network controller
	// TODO: there's no documentation about this `rnc` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 1
	RNC: (cell) => cell?.rnc?.toString?.() || "1",
	// Primary scrambling code
	PSC: (cell) => cell?.code?.toString?.(),
	// Radio frequency tracking number
	UARFCN: (cell) => cell?.frequency?.toString?.(),
	// Cell identifier
	CI: (cell) => cell?.cid?.toString?.(),
	// Tracking area code
	TAC: (cell) => cell?.area?.toString?.(),
	// Evolved node B
	// TODO: there's no documentation about this `enb` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	eNB: (cell) => cell?.enb?.toString?.() || "0",
	// Physical cell identifier
	PCI: (cell) => cell?.code?.toString?.(),
	// Radio frequency channel number
	EARFCN: (cell) => cell?.frequency?.toString?.(),
	// Cell identiry
	NCI: (cell) => cell?.cid?.toString?.(),
	// Base station identifier
	// TODO: there's no documentation about this `bid` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 1
	BID: () => "1",
	// Network identifier
	// TODO: there's no documentation about this `nid` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	NID: () => "0",
	// Ignored value
	XX1: () => "",
	// System identifier
	// TODO: there's no documentation about this `SID` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	SID: () => "0",
	Loc: (cell) => cell?.location?.toString?.(),
	// Ignored value
	XX2: () => "",
};

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
 * Retrieves the value of a specific field from a cell object.
 *
 * @param {string} field - The field to retrieve the value from.
 * @param {object} cell - The cell object.
 * @returns {string} - The value of the field as a string.
 * @throws {UnknownFieldError} - If the field is not found in the field mapping.
 * @throws {InvalidFieldValueError} - If the retrieved value is not a string.
 */
export function getFieldValue(field, cell) {
	if (!FIELD_MAPPING[field]) {
		throw new UnknownFieldError(field);
	}

	const value = FIELD_MAPPING[field](cell);

	if (typeof value !== "string") {
		throw new InvalidFieldValueError(field, value);
	}

	return value.replaceAll(";", " ").trim();
}

/**
 * Normalizes the given technology string by converting it to lowercase and removing non-word characters.
 *
 * @param {string} technology - The technology string to be normalized.
 * @returns {string} The normalized technology string.
 */
export function normalizeTechnology(technology) {
	return technology?.toLowerCase?.().replace(/[\W_]+/g, "") || "unknown";
}

/**
 * Retrieves the cell format based on the provided cell object.
 *
 * @param {Object} cell - The cell object.
 * @returns {string} The cell format.
 * @throws {UnknownTechnologyError} If the technology of the cell is unknown.
 */
export function getCellFormat(cell) {
	const technology = normalizeTechnology(cell?.technology);

	for (const value of Object.values(MAPPING)) {
		if (value.technology.map(normalizeTechnology).includes(technology)) {
			return value.format;
		}
	}

	throw new UnknownTechnologyError(cell.technology);
}

/**
 * Converts a cell object to a formatted string in the NetMonster (NTM) format.
 *
 * @param {Object} cell - The cell object to convert.
 * @returns {string} The formatted string in the NTM format.
 */
export function cellToNtm(cell) {
	const format = getCellFormat(cell);

	return format
		.split(";")
		.map((field) => getFieldValue(field, cell))
		.join(";");
}

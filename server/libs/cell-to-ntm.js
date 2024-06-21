import { InvalidFieldValueError, UnknownFieldError, getFormat } from "./ntm.js";

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
	// Calculating eNB from CID
	eNB: (cell) => {
		const cid = parseInt(cell?.cid, 10);
		return cid ? Math.floor(cid / 256).toString() : "0";
	},
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
 * Retrieves the value of a given field from a cell object.
 * @param {string} field - The name of the field to retrieve.
 * @param {object} cell - The cell object to retrieve the field value from.
 * @throws {UnknownFieldError} If the field does not exist in the FIELD_MAPPING.
 * @throws {InvalidFieldValueError} If the field value is not a string.
 * @returns {string} The value of the field, with all semicolons replaced with spaces and trimmed.
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
 * Converts a cell object to a NTM string.
 * @param {object} cell - The cell object to convert.
 * @returns {string} The NTM string representation of the cell.
 */
export function cellToNtm(cell) {
	const format = getFormat(cell?.technology);

	return format
		.split(";")
		.map((field) => getFieldValue(field, cell))
		.join(";");
}

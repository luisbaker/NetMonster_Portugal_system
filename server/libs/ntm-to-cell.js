import _ from "lodash";
import { UnknownFieldError, getFormat } from "./ntm.js";

const FIELD_MAPPING = {
	// Constant value
	"2G": () => ({ technology: "2G" }),
	// Constant value
	"3G": () => ({ technology: "3G" }),
	// Constant value
	"4G": () => ({ technology: "4G" }),
	// Constant value
	"5G": () => ({ technology: "5G" }),
	// Constant value
	CD2: (entries) => ({ cd2: Number(entries.find(([key, _]) => key === "CD2")?.at(1)) || 0 }),
	// Mobile country code
	MCC: (entries) => ({ network: { mcc: Number(entries.find(([key, _]) => key === "MCC")?.at(1)) || 0 } }),
	// Mobile network code
	MNC: (entries) => ({ network: { mnc: Number(entries.find(([key, _]) => key === "MNC")?.at(1)) || 0 } }),
	// Cell identifier
	CID: (entries) => ({ cid: Number(entries.find(([key, _]) => key === "CID")?.at(1)) || 0 }),
	// Location area code
	LAC: (entries) => ({ area: Number(entries.find(([key, _]) => key === "LAC")?.at(1)) || 0 }),
	// Ignored value
	XXX: () => ({}),
	// Base station identity code
	BSIC: (entries) => ({ code: Number(entries.find(([key, _]) => key === "BSIC")?.at(1)) || 0 }),
	// Latitude - GPS coordinate
	Lat: (entries) => ({ latitude: Number(entries.find(([key, _]) => key === "Lat")?.at(1)) || 0 }),
	// Longitude - GPS coordinate
	Lon: (entries) => ({ longitude: Number(entries.find(([key, _]) => key === "Lon")?.at(1)) || 0 }),
	// Description of the location
	Location: (entries) => ({ location: entries.find(([key, _]) => key === "Location")?.at(1) || "" }),
	// Radio frequency channel number
	ARFCN: (entries) => ({ frequency: Number(entries.find(([key, _]) => key === "ARFCN")?.at(1)) || 0 }),
	// Radio network controller
	// TODO: there's no documentation about this `rnc` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 1
	RNC: (entries) => ({ rnc: Number(entries.find(([key, _]) => key === "RNC")?.at(1)) || 1 }),
	// Primary scrambling code
	PSC: (entries) => ({ code: Number(entries.find(([key, _]) => key === "PSC")?.at(1)) || 0 }),
	// Radio frequency tracking number
	UARFCN: (entries) => ({ frequency: Number(entries.find(([key, _]) => key === "UARFCN")?.at(1)) || 0 }),
	// Cell identifier
	CI: (entries) => ({ cid: Number(entries.find(([key, _]) => key === "CI")?.at(1)) || 0 }),
	// Tracking area code
	TAC: (entries) => ({ area: Number(entries.find(([key, _]) => key === "TAC")?.at(1)) || 0 }),
	// Evolved node B
	// TODO: there's no documentation about this `enb` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	eNB: (entries) => ({ enb: Number(entries.find(([key, _]) => key === "eNB")?.at(1)) || 0 }),
        // gNB is the same as ENB outside the Nokia area.
        gNB: (entries) => ({ gnb: Number(entries.find(([key, _]) => key === "gNB")?.at(1)) || 0 }),
	// Physical cell identifier
	PCI: (entries) => ({ code: Number(entries.find(([key, _]) => key === "PCI")?.at(1)) || 0 }),
	// Radio frequency channel number
	EARFCN: (entries) => ({ frequency: Number(entries.find(([key, _]) => key === "EARFCN")?.at(1)) || 0 }),
	// Cell identiry
	NCI: (entries) => ({ cid: Number(entries.find(([key, _]) => key === "NCI")?.at(1)) || 0 }),
	// Base station identifier
	// TODO: there's no documentation about this `bid` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 1
	BID: () => ({ bid: 1 }),
	// Network identifier
	// TODO: there's no documentation about this `nid` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	NID: () => ({ nid: 0 }),
	// Ignored value
	XX1: () => ({}),
	// System identifier
	// TODO: there's no documentation about this `SID` field
	// so we'll have to check if it's correct, in the meanwhile
	// we'll default it to 0
	SID: () => ({ sid: 0 }),
	Loc: (entries) => ({ location: entries.find(([key, _]) => key === "Loc")?.at(1) || "" }),
	// Ignored value
	XX2: () => ({}),
};

/**
 * Converts a NetMonster string to a cell object.
 * @param {string} ntm - The NetMonster string to convert.
 * @returns {Object} - The converted cell object.
 * @throws {UnknownFieldError} - If an unknown field is encountered.
 */
export function ntmToCell(ntm) {
	const fields = ntm.split(";");
	const technology = fields.at(0);
	const format = getFormat(technology);
	const entries = format.split(";").map((field, index) => [field, fields.at(index)]);

	const result = entries.map(([key]) => {
		if (!FIELD_MAPPING[key]) {
			throw new UnknownFieldError(key);
		}

		return FIELD_MAPPING[key](entries);
	});

	return _.merge({}, ...result);
}

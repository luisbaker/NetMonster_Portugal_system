import assert from "node:assert";
import { describe, it } from "node:test";
import { FIELD_MAPPING, cellToNtm, getFieldValue } from "./cell-to-ntm.js";
import { InvalidFieldValueError, UnknownFieldError } from "./ntm.js";

const TEST_CELL = {
	area: 48290,
	cid: 1792553,
	code: 21,
	frequency: 500,
	latitude: 39.219198573285,
	longitude: -9.295696914196,
	network: { mcc: 268, mnc: 6 },
	technology: "LTE",
	location: "Capelas, Lourinhã ",
	caught: "12. 03. 2024 20:59",
	timestamp: 1710277141367,
};

describe("cellToNtm", () => {
	it("should convert a cell object to a formatted string in the NTM format", () => {
		const expected = "4G;268;06;1792553;48290;7002;21;39.219198573285;-9.295696914196;Capelas, Lourinhã;500";
		const result = cellToNtm(TEST_CELL);

		assert.strictEqual(result, expected);
	});

	it("should throw an UnknownFieldError if the field is not found in the field mapping", () => {
		assert.throws(() => {
			getFieldValue("invalid", TEST_CELL);
		}, new UnknownFieldError("invalid"));
	});

	it("should throw an InvalidFieldValueError if the retrieved value is not a string", () => {
		assert.throws(() => {
			cellToNtm({ ...TEST_CELL, cid: undefined });
		}, new InvalidFieldValueError("CI", undefined));
	});
});
describe("FIELD_MAPPING", () => {
	it("should return '2G' for the '2G' field", () => {
		const result = FIELD_MAPPING["2G"]();
		assert.strictEqual(result, "2G");
	});

	it("should return '3G' for the '3G' field", () => {
		const result = FIELD_MAPPING["3G"]();
		assert.strictEqual(result, "3G");
	});

	it("should return '4G' for the '4G' field", () => {
		const result = FIELD_MAPPING["4G"]();
		assert.strictEqual(result, "4G");
	});

	it("should return '5G' for the '5G' field", () => {
		const result = FIELD_MAPPING["5G"]();
		assert.strictEqual(result, "5G");
	});

	it("should return 'CD2' for the 'CD2' field", () => {
		const result = FIELD_MAPPING.CD2();
		assert.strictEqual(result, "CD2");
	});

	it("should return the MCC value as a string for the 'MCC' field", () => {
		const cell = { network: { mcc: 268 } };
		const result = FIELD_MAPPING.MCC(cell);
		assert.strictEqual(result, "268");
	});

	it("should return the MNC value as a string padded with zeros for the 'MNC' field", () => {
		const cell = { network: { mnc: 6 } };
		const result = FIELD_MAPPING.MNC(cell);
		assert.strictEqual(result, "06");
	});

	it("should return the CID value as a string for the 'CID' field", () => {
		const cell = { cid: 1792553 };
		const result = FIELD_MAPPING.CID(cell);
		assert.strictEqual(result, "1792553");
	});

	it("should return the area value as a string for the 'LAC' field", () => {
		const cell = { area: 48290 };
		const result = FIELD_MAPPING.LAC(cell);
		assert.strictEqual(result, "48290");
	});

	it("should return an empty string for the 'XXX' field", () => {
		const result = FIELD_MAPPING.XXX();
		assert.strictEqual(result, "");
	});

	it("should return the code value as a string for the 'BSIC' field", () => {
		const cell = { code: 21 };
		const result = FIELD_MAPPING.BSIC(cell);
		assert.strictEqual(result, "21");
	});

	it("should return the longitude value as a string for the 'Lon' field", () => {
		const cell = { longitude: -9.295696914196 };
		const result = FIELD_MAPPING.Lon(cell);
		assert.strictEqual(result, "-9.295696914196");
	});

	it("should return '0' for the 'Lon' field if the longitude field is not present", () => {
		const result = FIELD_MAPPING.Lon({});
		assert.strictEqual(result, "0");
	});

	it("should return '0' for the 'Lon' field if the longituide field is not present", () => {
		const result = FIELD_MAPPING.Lon({ longituide: -9.295696914196 });
		assert.strictEqual(result, "-9.295696914196");
	});

	it("should return the location value as a string for the 'Location' field", () => {
		const cell = { location: "Capelas, Lourinhã" };
		const result = FIELD_MAPPING.Location(cell);
		assert.strictEqual(result, "Capelas, Lourinhã");
	});

	it("should return the frequency value as a string for the 'ARFCN' field", () => {
		const cell = { frequency: 500 };
		const result = FIELD_MAPPING.ARFCN(cell);
		assert.strictEqual(result, "500");
	});

	it("should return '1' for the 'RNC' field if the rnc field is not present", () => {
		const result = FIELD_MAPPING.RNC();
		assert.strictEqual(result, "1");
	});

	it("should return the code value as a string for the 'PSC' field", () => {
		const cell = { code: 21 };
		const result = FIELD_MAPPING.PSC(cell);
		assert.strictEqual(result, "21");
	});

	it("should return the frequency value as a string for the 'UARFCN' field", () => {
		const cell = { frequency: 500 };
		const result = FIELD_MAPPING.UARFCN(cell);
		assert.strictEqual(result, "500");
	});

	it("should return the CID value as a string for the 'CI' field", () => {
		const cell = { cid: 1792553 };
		const result = FIELD_MAPPING.CI(cell);
		assert.strictEqual(result, "1792553");
	});

	it("should return the area value as a string for the 'TAC' field", () => {
		const cell = { area: 48290 };
		const result = FIELD_MAPPING.TAC(cell);
		assert.strictEqual(result, "48290");
	});

	it("should calculate and return the eNB value as a string for the 'eNB' field", () => {
		const cell = { cid: 1792553 };
		const result = FIELD_MAPPING.eNB(cell);
		assert.strictEqual(result, "7002");
	});

	it("should return the code value as a string for the 'PCI' field", () => {
		const cell = { code: 21 };
		const result = FIELD_MAPPING.PCI(cell);
		assert.strictEqual(result, "21");
	});

	it("should return the frequency value as a string for the 'EARFCN' field", () => {
		const cell = { frequency: 500 };
		const result = FIELD_MAPPING.EARFCN(cell);
		assert.strictEqual(result, "500");
	});

	it("should return the CID value as a string for the 'NCI' field", () => {
		const cell = { cid: 1792553 };
		const result = FIELD_MAPPING.NCI(cell);
		assert.strictEqual(result, "1792553");
	});

	it("should return '1' for the 'BID' field if the bid field is not present", () => {
		const result = FIELD_MAPPING.BID();
		assert.strictEqual(result, "1");
	});

	it("should return '0' for the 'NID' field if the nid field is not present", () => {
		const result = FIELD_MAPPING.NID();
		assert.strictEqual(result, "0");
	});

	it("should return an empty string for the 'XX1' field", () => {
		const result = FIELD_MAPPING.XX1();
		assert.strictEqual(result, "");
	});

	it("should return '0' for the 'SID' field if the SID field is not present", () => {
		const result = FIELD_MAPPING.SID();
		assert.strictEqual(result, "0");
	});

	it("should return the location value as a string for the 'Loc' field", () => {
		const cell = { location: "Capelas, Lourinhã" };
		const result = FIELD_MAPPING.Loc(cell);
		assert.strictEqual(result, "Capelas, Lourinhã");
	});

	it("should return an empty string for the 'XX2' field", () => {
		const result = FIELD_MAPPING.XX2();
		assert.strictEqual(result, "");
	});
});

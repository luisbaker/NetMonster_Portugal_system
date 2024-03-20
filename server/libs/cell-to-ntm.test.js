import assert from "node:assert";
import { describe, it } from "node:test";
import { cellToNtm, getFieldValue } from "./cell-to-ntm.js";
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
		const expected = "4G;268;06;1792553;48290;0;21;39.219198573285;-9.295696914196;Capelas, Lourinhã;500";
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

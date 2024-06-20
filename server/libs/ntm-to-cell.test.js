import assert from "node:assert";
import { describe, it } from "node:test";
import { ntmToCell } from "./ntm-to-cell.js";

const TEST_NTM = "4G;268;06;1792553;48290;0;21;39.219198573285;-9.295696914196;Capelas, Lourinhã;500";

describe("ntmToCell", () => {
	it("should convert a NTM entry to a cell object", () => {
		const result = ntmToCell(TEST_NTM);

		assert.deepStrictEqual(result, {
			area: 48290,
			cid: 1792553,
			code: 21,
			frequency: 500,
			latitude: 39.219198573285,
			longitude: -9.295696914196,
			network: { mcc: 268, mnc: 6 },
			technology: "4G",
			enb: 0,
			location: "Capelas, Lourinhã",
		});
	});
});

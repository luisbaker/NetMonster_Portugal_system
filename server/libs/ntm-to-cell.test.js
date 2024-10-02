import assert from "node:assert";
import { describe, it } from "node:test";
import { ntmToCell } from "./ntm-to-cell.js";

const TEST_NTM = "4G;268;06;1792553;48290;0;21;39.219198573285;-9.295696914196;Capelas, Lourinhã;500";
const TEST_5G = "5G;268;03;544964740;265;2128768;156;41.2142;-8.1711;R. Bairro Pinheiro Manso 295, Constance;156750";

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

	it("should convert 5G ntm entry to a cell object", () => {
		const result = ntmToCell(TEST_5G);

		assert.deepStrictEqual(result, {
			area: 265,
			cid: 544964740,
			code: 156,
			frequency: 156750,
			latitude: 41.2142,
			longitude: -8.1711,
			network: { mcc: 268, mnc: 3 },
			technology: "5G",
			gnb: 2128768,
			location: "R. Bairro Pinheiro Manso 295, Constance",
		});
	});
});

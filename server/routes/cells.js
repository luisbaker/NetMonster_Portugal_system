import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Router, json } from "express";
import handler from "express-async-handler";
import { getPath } from "../libs/database.js";
import { storeUpdate } from "../libs/ntm-storage.js";
import { ntmToCell } from "../libs/ntm-to-cell.js";

export const router = Router();

router.post(
	"/api/cell",
	json(),
	handler(async (req, res) => {
		if (!Array.isArray(req.body?.cells)) {
			return res.status(400).json({
				error: "Invalid request body",
			});
		}

		try {
			await storeUpdate(req.body);
			res.json({ success: true });
		} catch (err) {
			console.error(err);
			return res.status(400).json({ error: err?.message || "Unknown error" });
		}
	}),
);

router.get(
	"/api/cell/:mnc/:mcc",
	handler(async (req, res) => {
		const { mcc, mnc } = req.params;

		// MCC and MNC must be numbers only
		if (!/^\d+$/.test(mcc) || !/^\d+$/.test(mnc)) {
			return res.status(400).json({ error: "Invalid MCC or MNC" });
		}

		const path = getPath(`./${mnc}-${mcc}.ntm`);

		// Return an empty array if the file does not exist
		if (!(await fs.stat(path).catch(() => false))) {
			return res.json([]);
		}

		const fd = await fs.open(path, "r");

		try {
			const transform = async function* () {
				yield Buffer.from("[");
				let first = true;

				for await (const line of fd.readLines()) {
					if (!first) {
						yield Buffer.from(",");
					} else {
						first = false;
					}

					const entry = ntmToCell(line);
					yield Buffer.from(`${JSON.stringify(entry)}`);
				}

				yield Buffer.from("]");
			};

			res.setHeader("Content-Type", "application/json");
			await pipeline(transform(), res);
		} finally {
			await fd.close();
		}
	}),
);

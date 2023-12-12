import { Router, json } from "express";
import handler from "express-async-handler";
import { storeUpdate } from "../libs/ntm-storage.js";

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

		await storeUpdate(req.body);
		res.json({ success: true });
	}),
);

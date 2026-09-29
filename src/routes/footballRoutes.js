import { Router } from "express";
import { getTodayGames } from "../controller/footballController.js";
import { getTimes } from "../controller/footballController.js";

const router = Router();

router.get("/jogos-hoje", getTodayGames);
router.get("/times", getTimes);

export default router;

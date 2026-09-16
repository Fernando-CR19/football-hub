import { Router } from "express";
import { getTodayGames } from "../controller/footballController.js";

const router = Router();

router.get("/jogos-hoje", getTodayGames);

export default router;

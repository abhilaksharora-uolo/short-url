import { Router } from "express";
import { getLongUrl, shortenUrl } from "../controllers/shortUrl";

const router = Router();

router.post("/shorten", shortenUrl);
router.get("/shorten/:shortUrl", getLongUrl);

export default router;

import express from "express";
import { storeData, generatePdf, generateZIP, test } from "../controllers/mediterrance.controller.js";
const router = express.Router();
import { upload } from "../middleware/multer.middleware.js";

router.post("/storeData", upload.single("sheet"), storeData);
router.get("/test", test);
router.get("/generatePdf", generatePdf);
router.get("/generateZIP", generateZIP);

export default router;
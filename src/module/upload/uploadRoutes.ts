import { Router } from "express";
import { upload } from "../../config/multerCloudinary.js";

const router = Router();
router.post(  "/upload",  upload.single("image"),  (req, res) => {
        res.json({
            success: true,
            imageUrl: req.file?.path,
        });
    }
);

export default router;

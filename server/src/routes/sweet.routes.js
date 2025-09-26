import { Router } from "express";
import {
    getAllSweets,
    searchSweets,
    getSweetById,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    getUserPurchases,
    getAllPurchases
} from "../controllers/sweet.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/").get(getAllSweets);
router.route("/search").get(searchSweets);
router.route("/:id").get(getSweetById);

router.route("/:id/purchase").post(verifyJWT, purchaseSweet);
router.route("/purchases/my").get(verifyJWT, getUserPurchases);

router.route("/").post(verifyJWT, verifyAdmin, upload.single('image'), createSweet);
router.route("/:id").put(verifyJWT, verifyAdmin, upload.single('image'), updateSweet);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteSweet);
router.route("/:id/restock").post(verifyJWT, verifyAdmin, restockSweet);
router.route("/purchases/all").get(verifyJWT, verifyAdmin, getAllPurchases);

export default router;
import express from "express";
import { signin, signup, google, signOut } from "../controllers/auth.controller.js";

//Create router
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signOut)
//

export default router;

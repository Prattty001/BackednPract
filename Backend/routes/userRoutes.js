import express from "express";
import { loginUser, signupUser, getUsers, handleDelete, editUser, checkEmail, updatePassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.delete("/users/:userId", handleDelete);
router.put("/users/:userId", editUser);
router.post("/check-email",checkEmail);
router.post("/update-password", updatePassword);


export default router;

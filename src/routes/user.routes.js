import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, loginUser } from "../controllers/user.controllers.js";

const router = Router();

router.get("/users", getUsers);

router.get("/user/:Id", getUser);

router.post("/users", createUser);

router.put("/users/:Id", updateUser);

router.delete("/users/:Id", deleteUser);

router.post("/login", loginUser);


export default router
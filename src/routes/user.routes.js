import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, loginUser, putPassword, BuscarUserMatricula, getBuscarCheckers } from "../controllers/user.controllers.js";

const router = Router();

router.get("/users", getUsers);

router.get("/user/:Id", getUser);

router.get("/userMatricula/:Matricula", BuscarUserMatricula);

router.post("/users", createUser);

router.put("/users/:Id", updateUser);

router.delete("/users/:Id", deleteUser);

router.post("/login", loginUser);

router.put("/password/:Correo", putPassword);

router.get("/userChecks/:EmailAsignador", getBuscarCheckers,)

export default router;
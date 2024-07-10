import { Router } from "express";
import { cancelpermission, createPermission, deletePermission, getPermission, getPermissionsByUser } from "../controllers/permission.controller.js";

const router = Router();

router.get("/permission/:Id", getPermissionsByUser);

//router.get("/permission/:Id", getPermission);

router.post("/permission", createPermission);

router.delete("/permission/:Id", deletePermission);

router.put("/permission/:Id", cancelpermission)

export default router;

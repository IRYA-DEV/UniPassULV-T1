import { Router } from "express";
import { cancelPermission, createPermission, deletePermission, getPermission, getPermissionForAutorizacion, getPermissionsByUser } from "../controllers/permission.controller.js";

const router = Router();

router.get("/permission/:Id", getPermissionsByUser);

router.get("/permissionsEmployee/:Id", getPermissionForAutorizacion);

router.post("/permission", createPermission);

router.delete("/permission/:Id", deletePermission);

router.put("/permission/:Id", cancelPermission)

export default router;

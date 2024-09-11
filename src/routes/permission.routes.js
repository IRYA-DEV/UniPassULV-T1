import { Router } from "express";
import { autorizarPermiso, cancelPermission, createPermission, deletePermission, getPermission, getPermissionForAutorizacion, getPermissionForAutorizacionPrece, getPermissionsByUser } from "../controllers/permission.controller.js";

const router = Router();

router.get("/permission/:Id", getPermissionsByUser);

router.get("/PermissionsPreceptor/:Id", getPermissionForAutorizacionPrece);

router.get("/permissionsEmployee/:Id", getPermissionForAutorizacion);

router.post("/permission", createPermission);

router.delete("/permission/:Id", deletePermission);

router.put("/permission/:Id", cancelPermission);

router.put("/permissionValorado/:Id", autorizarPermiso);



export default router;

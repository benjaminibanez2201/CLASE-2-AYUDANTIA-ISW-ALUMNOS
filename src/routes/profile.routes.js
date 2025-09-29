import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPublicProfile,
  getPrivateProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/public", getPublicProfile);

// Ruta para obtener perfil privado
router.get("/private", authMiddleware, getPrivateProfile);

// Ruta para actualizar perfil (PATCH)
router.patch("/private", authMiddleware, updateProfile);

// Ruta para eliminar perfil (DELETE)
router.delete("/private", authMiddleware, deleteProfile);

export default router;
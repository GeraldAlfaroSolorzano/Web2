import { Router } from "express";

import {
  listarPrestamos,
  obtenerPrestamo,
  registrarPrestamo,
  devolverEquipoPrestamo,
  devolverPrestamoCompleto,
} from "../controllers/prestamos.controller.js";

import { verificarSesion } from "../middlewares/sesion.middleware.js";

import {
  validarCrearPrestamo,
  validarIdPrestamo,
  validarDevolucionEquipo,
} from "../middlewares/prestamos.middleware.js";

const router = Router();

router.get("/", verificarSesion, listarPrestamos);

router.get("/:id", verificarSesion, validarIdPrestamo, obtenerPrestamo);

router.post("/", verificarSesion, validarCrearPrestamo, registrarPrestamo);

router.put(
  "/:prestamoId/detalle/:detalleId/devolver",
  verificarSesion,
  validarDevolucionEquipo,
  devolverEquipoPrestamo,
);

router.put(
  "/:id/devolver-completo",
  verificarSesion,
  validarIdPrestamo,
  devolverPrestamoCompleto,
);

export default router;

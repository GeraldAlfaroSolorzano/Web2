import { Router } from "express";

import {
  listarPrestamos,
  obtenerPrestamo,
  registrarPrestamo,
  devolverEquipoPrestamo,
  devolverPrestamoCompleto,
} from "../controllers/prestamos.controller.js";

import { verificarSesion } from "../middlewares/sesion.middleware.js";

import { verificarAdministrador } from "../middlewares/rol.middleware.js";

import {
  validarCrearPrestamo,
  validarIdPrestamo,
  validarDevolucionEquipo,
} from "../middlewares/prestamos.middleware.js";

const router = Router();

router.get("/", verificarSesion, verificarAdministrador, listarPrestamos);

router.get(
  "/:id",
  verificarSesion,
  verificarAdministrador,
  validarIdPrestamo,
  obtenerPrestamo,
);

router.post(
  "/",
  verificarSesion,
  verificarAdministrador,
  validarCrearPrestamo,
  registrarPrestamo,
);

router.put(
  "/:prestamoId/detalle/:detalleId/devolver",
  verificarSesion,
  verificarAdministrador,
  validarDevolucionEquipo,
  devolverEquipoPrestamo,
);

router.put(
  "/:id/devolver-completo",
  verificarSesion,
  verificarAdministrador,
  validarIdPrestamo,
  devolverPrestamoCompleto,
);

export default router;

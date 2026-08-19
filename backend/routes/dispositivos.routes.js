import { Router } from "express";

import {
  listarDispositivos,
  consultarDispositivo,
  registrarDispositivo,
  cambiarEstadoDispositivo,
} from "../controllers/dispositivos.controller.js";

import {
  validarRegistroDispositivo,
  validarDispositivoId,
  validarEstadoDispositivo,
} from "../middlewares/dispositivos.middleware.js";

import { verificarSesion } from "../middlewares/sesion.middleware.js";

const router = Router();

router.get("/", verificarSesion, listarDispositivos);

router.get("/:id", verificarSesion, validarDispositivoId, consultarDispositivo);

router.post(
  "/",
  verificarSesion,
  validarRegistroDispositivo,
  registrarDispositivo,
);

router.put(
  "/:id/estado",
  verificarSesion,
  validarEstadoDispositivo,
  cambiarEstadoDispositivo,
);

export default router;

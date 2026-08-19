import { Router } from "express";

import {
  listarMarcasUsuario,
  registrarMarca,
} from "../controllers/marcas.controller.js";

import { validarRegistroMarca } from "../middlewares/marcas.middleware.js";

import { verificarSesion } from "../middlewares/sesion.middleware.js";

const router = Router();

router.get("/", verificarSesion, listarMarcasUsuario);

router.post("/", verificarSesion, validarRegistroMarca, registrarMarca);

export default router;

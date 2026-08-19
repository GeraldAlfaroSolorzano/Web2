import { body, param, validationResult } from "express-validator";

export function validarErroresDispositivo(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: "Los datos enviados no son validos",
      errores: errores.array(),
    });
  }

  next();
}

export const validarRegistroDispositivo = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del dispositivo es requerido")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar 100 caracteres"),

  body("descripcion")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("La descripcion no puede superar 255 caracteres"),

  validarErroresDispositivo,
];

export const validarDispositivoId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id del dispositivo no es valido"),

  validarErroresDispositivo,
];

export const validarEstadoDispositivo = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id del dispositivo no es valido"),

  body("estado")
    .trim()
    .notEmpty()
    .withMessage("El estado del dispositivo es requerido")
    .isIn(["ACTIVO", "INACTIVO"])
    .withMessage("El estado del dispositivo no es valido"),

  validarErroresDispositivo,
];

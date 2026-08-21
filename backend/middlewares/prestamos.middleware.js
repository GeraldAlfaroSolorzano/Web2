import { body, param, validationResult } from "express-validator";

export function validarErroresPrestamo(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos invalidos",
      errores: errores.array(),
    });
  }

  next();
}

export const validarCrearPrestamo = [
  body("numero_prestamo")
    .notEmpty()
    .withMessage("El numero de prestamo es requerido")
    .isLength({ max: 50 })
    .withMessage("El numero de prestamo no puede superar 50 caracteres"),

  body("usuario_id")
    .notEmpty()
    .withMessage("El usuario es requerido")
    .isInt({ min: 1 })
    .withMessage("El usuario debe ser valido"),

  body("equipos")
    .isArray({ min: 1 })
    .withMessage("Debe seleccionar al menos un equipo"),

  body("equipos.*.equipo_id")
    .notEmpty()
    .withMessage("El equipo es requerido")
    .isInt({ min: 1 })
    .withMessage("El equipo debe ser valido"),

  validarErroresPrestamo,
];

export const validarIdPrestamo = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id del prestamo debe ser valido"),

  validarErroresPrestamo,
];

export const validarDevolucionEquipo = [
  param("prestamoId")
    .isInt({ min: 1 })
    .withMessage("El id del prestamo debe ser valido"),

  param("detalleId")
    .isInt({ min: 1 })
    .withMessage("El id del detalle debe ser valido"),

  validarErroresPrestamo,
];

import { body, validationResult } from "express-validator";

export function validarErroresMarca(req, res, next) {
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

export const validarRegistroMarca = [
  body("identificador_dispositivo")
    .trim()
    .notEmpty()
    .withMessage("El identificador del dispositivo es requerido")
    .isLength({ max: 100 })
    .withMessage("El identificador del dispositivo no es valido"),

  validarErroresMarca,
];

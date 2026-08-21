import {
  obtenerPrestamos,
  obtenerPrestamoPorId,
  obtenerPrestamoPorNumero,
  crearPrestamo,
  agregarEquipoPrestamo,
  obtenerDetallePrestamo,
  obtenerDetallePorId,
  devolverEquipo,
  contarEquiposPendientes,
  finalizarPrestamo,
} from "../models/prestamos.model.js";

import {
  obtenerEquipoPorId,
  actualizarEstadoEquipo,
} from "../models/equipos.model.js";

import { obtenerUsuarioPorId } from "../models/usuarios.model.js";

export async function listarPrestamos(req, res) {
  try {
    const prestamos = await obtenerPrestamos();

    return res.status(200).json({
      exito: true,
      mensaje: "Prestamos obtenidos correctamente",
      datos: prestamos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al obtener los prestamos",
    });
  }
}

export async function obtenerPrestamo(req, res) {
  try {
    const prestamoId = Number(req.params.id);

    const prestamo = await obtenerPrestamoPorId(prestamoId);

    if (!prestamo) {
      return res.status(404).json({
        exito: false,
        mensaje: "Prestamo no encontrado",
      });
    }

    const detalle = await obtenerDetallePrestamo(prestamoId);

    const datos = {
      ...prestamo,
      equipos: detalle,
    };

    return res.status(200).json({
      exito: true,
      mensaje: "Prestamo obtenido correctamente",
      datos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al obtener el prestamo",
    });
  }
}

export async function registrarPrestamo(req, res) {
  try {
    const { numero_prestamo, usuario_id, equipos } = req.body;

    const encargadoId = req.session.usuario.id;

    const usuario = await obtenerUsuarioPorId(usuario_id);

    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: "El usuario seleccionado no existe",
      });
    }

    const prestamoExistente = await obtenerPrestamoPorNumero(numero_prestamo);

    if (prestamoExistente) {
      return res.status(409).json({
        exito: false,
        mensaje: "El numero de prestamo ya existe",
      });
    }

    const equiposValidados = [];
    const equiposIds = [];

    for (const item of equipos) {
      const equipoId = Number(item.equipo_id);

      if (equiposIds.includes(equipoId)) {
        return res.status(400).json({
          exito: false,
          mensaje: "El mismo equipo no puede aparecer dos veces",
        });
      }

      const equipo = await obtenerEquipoPorId(equipoId);

      if (!equipo) {
        return res.status(404).json({
          exito: false,
          mensaje: "Uno de los equipos seleccionados no existe",
        });
      }

      if (equipo.estado !== "DISPONIBLE") {
        return res.status(409).json({
          exito: false,
          mensaje: "Uno de los equipos no esta disponible",
        });
      }

      equiposIds.push(equipoId);
      equiposValidados.push(equipo);
    }

    const prestamoId = await crearPrestamo(
      numero_prestamo,
      usuario_id,
      encargadoId,
    );

    for (const equipo of equiposValidados) {
      await agregarEquipoPrestamo(prestamoId, equipo.id, equipo.descripcion);

      await actualizarEstadoEquipo(equipo.id, "PRESTADO");
    }

    const prestamo = await obtenerPrestamoPorId(prestamoId);

    const detalle = await obtenerDetallePrestamo(prestamoId);

    const datos = {
      ...prestamo,
      equipos: detalle,
    };

    return res.status(201).json({
      exito: true,
      mensaje: "Prestamo registrado correctamente",
      datos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al registrar el prestamo",
    });
  }
}

export async function devolverEquipoPrestamo(req, res) {
  try {
    const prestamoId = Number(req.params.prestamoId);

    const detalleId = Number(req.params.detalleId);

    const prestamo = await obtenerPrestamoPorId(prestamoId);

    if (!prestamo) {
      return res.status(404).json({
        exito: false,
        mensaje: "Prestamo no encontrado",
      });
    }

    if (prestamo.estado === "FINALIZADO") {
      return res.status(409).json({
        exito: false,
        mensaje: "El prestamo ya esta finalizado",
      });
    }

    const detalle = await obtenerDetallePorId(detalleId);

    if (!detalle) {
      return res.status(404).json({
        exito: false,
        mensaje: "Equipo del prestamo no encontrado",
      });
    }

    if (detalle.prestamo_id !== prestamoId) {
      return res.status(400).json({
        exito: false,
        mensaje: "El equipo no pertenece a este prestamo",
      });
    }

    if (detalle.estado_devolucion === "DEVUELTO") {
      return res.status(409).json({
        exito: false,
        mensaje: "El equipo ya fue devuelto",
      });
    }

    await devolverEquipo(detalleId);

    await actualizarEstadoEquipo(detalle.equipo_id, "DISPONIBLE");

    const pendientes = await contarEquiposPendientes(prestamoId);

    if (pendientes === 0) {
      await finalizarPrestamo(prestamoId);
    }

    const prestamoActualizado = await obtenerPrestamoPorId(prestamoId);

    const detalleActualizado = await obtenerDetallePrestamo(prestamoId);

    const datos = {
      ...prestamoActualizado,
      equipos: detalleActualizado,
    };

    return res.status(200).json({
      exito: true,
      mensaje: "Equipo devuelto correctamente",
      datos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al devolver el equipo",
    });
  }
}

export async function devolverPrestamoCompleto(req, res) {
  try {
    const prestamoId = Number(req.params.id);

    const prestamo = await obtenerPrestamoPorId(prestamoId);

    if (!prestamo) {
      return res.status(404).json({
        exito: false,
        mensaje: "Prestamo no encontrado",
      });
    }

    if (prestamo.estado === "FINALIZADO") {
      return res.status(409).json({
        exito: false,
        mensaje: "El prestamo ya esta finalizado",
      });
    }

    const detalles = await obtenerDetallePrestamo(prestamoId);

    for (const detalle of detalles) {
      if (detalle.estado_devolucion === "PENDIENTE") {
        await devolverEquipo(detalle.id);

        await actualizarEstadoEquipo(detalle.equipo_id, "DISPONIBLE");
      }
    }

    await finalizarPrestamo(prestamoId);

    const prestamoActualizado = await obtenerPrestamoPorId(prestamoId);

    const detalleActualizado = await obtenerDetallePrestamo(prestamoId);

    const datos = {
      ...prestamoActualizado,
      equipos: detalleActualizado,
    };

    return res.status(200).json({
      exito: true,
      mensaje: "Prestamo devuelto completamente",
      datos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Error al realizar la devolucion completa",
    });
  }
}

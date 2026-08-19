import crypto from "crypto";

import {
  obtenerDispositivosPorUsuario,
  obtenerDispositivoPorId,
  obtenerDispositivoPorIdentificador,
  crearDispositivo,
  actualizarEstadoDispositivo,
} from "../models/dispositivos.model.js";

export async function listarDispositivos(req, res) {
  try {
    const usuarioId = req.session.usuario.id;

    const dispositivos = await obtenerDispositivosPorUsuario(usuarioId);

    return res.status(200).json({
      exito: true,
      mensaje: "Dispositivos obtenidos correctamente",
      datos: dispositivos,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al consultar los dispositivos",
    });
  }
}

export async function consultarDispositivo(req, res) {
  try {
    const usuarioId = req.session.usuario.id;
    const dispositivoId = Number(req.params.id);

    const dispositivo = await obtenerDispositivoPorId(dispositivoId, usuarioId);

    if (!dispositivo) {
      return res.status(404).json({
        exito: false,
        mensaje: "El dispositivo no existe",
      });
    }

    return res.status(200).json({
      exito: true,
      mensaje: "Dispositivo obtenido correctamente",
      datos: dispositivo,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al consultar el dispositivo",
    });
  }
}

export async function registrarDispositivo(req, res) {
  try {
    const usuarioId = req.session.usuario.id;

    const { nombre, descripcion } = req.body;

    let identificador = crypto.randomUUID();

    let dispositivoExistente =
      await obtenerDispositivoPorIdentificador(identificador);

    while (dispositivoExistente) {
      identificador = crypto.randomUUID();

      dispositivoExistente =
        await obtenerDispositivoPorIdentificador(identificador);
    }

    const datosDispositivo = {
      identificador,
      nombre,
      descripcion,
      usuario_id: usuarioId,
    };

    const dispositivoId = await crearDispositivo(datosDispositivo);

    return res.status(201).json({
      exito: true,
      mensaje: "Dispositivo registrado correctamente",
      datos: {
        id: dispositivoId,
        identificador,
        nombre,
        descripcion,
        estado: "ACTIVO",
      },
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al registrar el dispositivo",
    });
  }
}

export async function cambiarEstadoDispositivo(req, res) {
  try {
    const usuarioId = req.session.usuario.id;
    const dispositivoId = Number(req.params.id);

    const { estado } = req.body;

    const dispositivo = await obtenerDispositivoPorId(dispositivoId, usuarioId);

    if (!dispositivo) {
      return res.status(404).json({
        exito: false,
        mensaje: "El dispositivo no existe",
      });
    }

    const filasAfectadas = await actualizarEstadoDispositivo(
      dispositivoId,
      usuarioId,
      estado,
    );

    if (filasAfectadas === 0) {
      return res.status(400).json({
        exito: false,
        mensaje: "No se pudo actualizar el dispositivo",
      });
    }

    const dispositivoActualizado = await obtenerDispositivoPorId(
      dispositivoId,
      usuarioId,
    );

    return res.status(200).json({
      exito: true,
      mensaje: "Estado del dispositivo actualizado correctamente",
      datos: dispositivoActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al actualizar el dispositivo",
    });
  }
}

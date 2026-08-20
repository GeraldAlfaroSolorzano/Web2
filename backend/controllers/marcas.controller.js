import { obtenerDispositivoActivo } from "../models/dispositivos.model.js";

import {
  obtenerUltimaMarcaUsuario,
  crearMarca,
  obtenerMarcaPorId,
  obtenerMarcasPorUsuario,
  obtenerConfiguracionRed,
} from "../models/marcas.model.js";

function obtenerFechaActual() {
  const fecha = new Date();

  const ano = fecha.getFullYear();

  const mes = String(fecha.getMonth() + 1).padStart(2, "0");

  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function obtenerHoraActual() {
  const fecha = new Date();

  const horas = String(fecha.getHours()).padStart(2, "0");

  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  const segundos = String(fecha.getSeconds()).padStart(2, "0");

  return `${horas}:${minutos}:${segundos}`;
}

function normalizarIp(ip) {
  if (ip === "::1") {
    return "127.0.0.1";
  }

  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}

function convertirIpNumero(ip) {
  const partes = ip.split(".");

  if (partes.length !== 4) {
    return null;
  }

  let numero = 0;

  for (let i = 0; i < partes.length; i += 1) {
    const parte = Number(partes[i]);

    if (Number.isNaN(parte) || parte < 0 || parte > 255) {
      return null;
    }

    numero = numero * 256 + parte;
  }

  return numero;
}

function ipPermitida(ip, rangoInicio, rangoFin) {
  if (!rangoInicio || !rangoFin) {
    return true;
  }

  const ipNumero = convertirIpNumero(ip);

  const inicioNumero = convertirIpNumero(rangoInicio);

  const finNumero = convertirIpNumero(rangoFin);

  if (ipNumero === null || inicioNumero === null || finNumero === null) {
    return false;
  }

  if (ipNumero < inicioNumero || ipNumero > finNumero) {
    return false;
  }

  return true;
}

function determinarTipoMarca(ultimaMarca) {
  if (!ultimaMarca) {
    return "ENTRADA";
  }

  if (ultimaMarca.tipo_marca === "ENTRADA") {
    return "SALIDA";
  }

  return "ENTRADA";
}

export async function listarMarcasUsuario(req, res) {
  try {
    const usuarioId = req.session.usuario.id;

    const marcas = await obtenerMarcasPorUsuario(usuarioId);

    return res.status(200).json({
      exito: true,
      mensaje: "Marcas obtenidas correctamente",
      datos: marcas,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al consultar las marcas",
    });
  }
}

export async function registrarMarca(req, res) {
  try {
    const usuarioId = req.session.usuario.id;

    const { identificador_dispositivo } = req.body;

    const dispositivo = await obtenerDispositivoActivo(
      usuarioId,
      identificador_dispositivo,
    );

    if (!dispositivo) {
      return res.status(403).json({
        exito: false,
        mensaje: "El dispositivo no esta autorizado",
      });
    }

    let direccionIp = req.ip;

    direccionIp = normalizarIp(direccionIp);

    const configuracion = await obtenerConfiguracionRed();

    if (configuracion) {
      const accesoPermitido = ipPermitida(
        direccionIp,
        configuracion.rango_ip_inicio,
        configuracion.rango_ip_fin,
      );

      if (!accesoPermitido) {
        return res.status(403).json({
          exito: false,
          mensaje: "No es posible realizar la marca desde la red actual",
        });
      }
    }

    const ultimaMarca = await obtenerUltimaMarcaUsuario(usuarioId);

    const tipoMarca = determinarTipoMarca(ultimaMarca);

    const fecha = obtenerFechaActual();
    const hora = obtenerHoraActual();

    const datosMarca = {
      usuario_id: usuarioId,
      fecha,
      hora,
      tipo_marca: tipoMarca,
      direccion_ip: direccionIp,
      dispositivo_id: dispositivo.id,
    };

    const marcaId = await crearMarca(datosMarca);

    const marca = await obtenerMarcaPorId(marcaId, usuarioId);

    return res.status(201).json({
      exito: true,
      mensaje: "Marca registrada correctamente",
      datos: marca,
    });
  } catch (error) {
    return res.status(500).json({
      exito: false,
      mensaje: "Ocurrio un error al registrar la marca",
    });
  }
}

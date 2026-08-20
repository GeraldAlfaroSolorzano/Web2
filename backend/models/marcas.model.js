import pool from "../config/database.js";

export async function obtenerUltimaMarcaUsuario(usuarioId) {
  const sql = `
        SELECT
            id,
            usuario_id,
            fecha,
            hora,
            tipo_marca,
            direccion_ip,
            dispositivo_id
        FROM marcas
        WHERE usuario_id = ?
        ORDER BY fecha DESC, hora DESC, id DESC
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql, [usuarioId]);

  return filas[0];
}

export async function crearMarca(datosMarca) {
  const sql = `
        INSERT INTO marcas (
            usuario_id,
            fecha,
            hora,
            tipo_marca,
            direccion_ip,
            dispositivo_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

  const valores = [
    datosMarca.usuario_id,
    datosMarca.fecha,
    datosMarca.hora,
    datosMarca.tipo_marca,
    datosMarca.direccion_ip,
    datosMarca.dispositivo_id,
  ];

  const [resultado] = await pool.execute(sql, valores);

  return resultado.insertId;
}

export async function obtenerMarcaPorId(marcaId, usuarioId) {
  const sql = `
        SELECT
            marcas.id,
            marcas.fecha,
            marcas.hora,
            marcas.tipo_marca,
            marcas.direccion_ip,
            dispositivos.nombre AS dispositivo
        FROM marcas
        INNER JOIN dispositivos
            ON marcas.dispositivo_id = dispositivos.id
        WHERE marcas.id = ?
        AND marcas.usuario_id = ?
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql, [marcaId, usuarioId]);

  return filas[0];
}

export async function obtenerMarcasPorUsuario(usuarioId) {
  const sql = `
        SELECT
            marcas.id,
            marcas.fecha,
            marcas.hora,
            marcas.tipo_marca,
            marcas.direccion_ip,
            marcas.dispositivo_id,
            dispositivos.nombre AS dispositivo
        FROM marcas
        INNER JOIN dispositivos
            ON marcas.dispositivo_id = dispositivos.id
        WHERE marcas.usuario_id = ?
        ORDER BY marcas.fecha DESC, marcas.hora DESC
    `;

  const [filas] = await pool.execute(sql, [usuarioId]);

  return filas;
}

export async function obtenerConfiguracionRed() {
  const sql = `
        SELECT
            rango_ip_inicio,
            rango_ip_fin
        FROM configuracion
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql);

  return filas[0];
}

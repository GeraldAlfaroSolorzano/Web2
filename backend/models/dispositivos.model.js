import pool from "../config/database.js";

export async function obtenerDispositivosPorUsuario(usuarioId) {
  const sql = `
        SELECT
            id,
            identificador,
            nombre,
            descripcion,
            fecha_registro,
            usuario_id,
            estado
        FROM dispositivos
        WHERE usuario_id = ?
        ORDER BY fecha_registro DESC
    `;

  const [filas] = await pool.execute(sql, [usuarioId]);

  return filas;
}

export async function obtenerDispositivoPorId(dispositivoId, usuarioId) {
  const sql = `
        SELECT
            id,
            identificador,
            nombre,
            descripcion,
            fecha_registro,
            usuario_id,
            estado
        FROM dispositivos
        WHERE id = ?
        AND usuario_id = ?
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql, [dispositivoId, usuarioId]);

  return filas[0];
}

export async function obtenerDispositivoPorIdentificador(identificador) {
  const sql = `
        SELECT
            id,
            identificador,
            nombre,
            descripcion,
            fecha_registro,
            usuario_id,
            estado
        FROM dispositivos
        WHERE identificador = ?
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql, [identificador]);

  return filas[0];
}

export async function obtenerDispositivoActivo(usuarioId, identificador) {
  const sql = `
        SELECT
            id,
            identificador,
            nombre,
            descripcion,
            fecha_registro,
            usuario_id,
            estado
        FROM dispositivos
        WHERE usuario_id = ?
        AND identificador = ?
        AND estado = 'ACTIVO'
        LIMIT 1
    `;

  const [filas] = await pool.execute(sql, [usuarioId, identificador]);

  return filas[0];
}

export async function crearDispositivo(datosDispositivo) {
  const sql = `
        INSERT INTO dispositivos (
            identificador,
            nombre,
            descripcion,
            usuario_id,
            estado
        )
        VALUES (?, ?, ?, ?, 'ACTIVO')
    `;

  const valores = [
    datosDispositivo.identificador,
    datosDispositivo.nombre,
    datosDispositivo.descripcion,
    datosDispositivo.usuario_id,
  ];

  const [resultado] = await pool.execute(sql, valores);

  return resultado.insertId;
}

export async function actualizarEstadoDispositivo(
  dispositivoId,
  usuarioId,
  estado,
) {
  const sql = `
        UPDATE dispositivos
        SET estado = ?
        WHERE id = ?
        AND usuario_id = ?
    `;

  const valores = [estado, dispositivoId, usuarioId];

  const [resultado] = await pool.execute(sql, valores);

  return resultado.affectedRows;
}

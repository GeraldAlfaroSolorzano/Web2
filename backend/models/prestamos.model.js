import pool from "../config/database.js";

export async function obtenerPrestamos() {
  const sql = `
    SELECT
      p.id,
      p.numero_prestamo,
      p.usuario_id,
      u.nombre_completo AS usuario,
      p.fecha,
      p.encargado_id,
      e.nombre_completo AS encargado,
      p.estado
    FROM prestamos p
    INNER JOIN usuarios u
      ON p.usuario_id = u.id
    INNER JOIN usuarios e
      ON p.encargado_id = e.id
    ORDER BY p.fecha DESC
  `;

  const [filas] = await pool.execute(sql);

  return filas;
}

export async function obtenerPrestamoPorId(id) {
  const sql = `
    SELECT
      p.id,
      p.numero_prestamo,
      p.usuario_id,
      u.nombre_completo AS usuario,
      p.fecha,
      p.encargado_id,
      e.nombre_completo AS encargado,
      p.estado
    FROM prestamos p
    INNER JOIN usuarios u
      ON p.usuario_id = u.id
    INNER JOIN usuarios e
      ON p.encargado_id = e.id
    WHERE p.id = ?
  `;

  const [filas] = await pool.execute(sql, [id]);

  return filas[0];
}

export async function obtenerPrestamoPorNumero(numeroPrestamo) {
  const sql = `
    SELECT
      id,
      numero_prestamo,
      usuario_id,
      fecha,
      encargado_id,
      estado
    FROM prestamos
    WHERE numero_prestamo = ?
  `;

  const [filas] = await pool.execute(sql, [numeroPrestamo]);

  return filas[0];
}

export async function crearPrestamo(numeroPrestamo, usuarioId, encargadoId) {
  const sql = `
    INSERT INTO prestamos (
      numero_prestamo,
      usuario_id,
      fecha,
      encargado_id,
      estado
    )
    VALUES (?, ?, CURDATE(), ?, 'ACTIVO')
  `;

  const valores = [numeroPrestamo, usuarioId, encargadoId];

  const [resultado] = await pool.execute(sql, valores);

  return resultado.insertId;
}

export async function agregarEquipoPrestamo(prestamoId, equipoId, descripcion) {
  const sql = `
    INSERT INTO prestamo_detalle (
      prestamo_id,
      equipo_id,
      descripcion,
      estado_devolucion
    )
    VALUES (?, ?, ?, 'PENDIENTE')
  `;

  const valores = [prestamoId, equipoId, descripcion];

  const [resultado] = await pool.execute(sql, valores);

  return resultado.insertId;
}

export async function obtenerDetallePrestamo(prestamoId) {
  const sql = `
    SELECT
      pd.id,
      pd.prestamo_id,
      pd.equipo_id,
      eq.codigo,
      pd.descripcion,
      pd.estado_devolucion
    FROM prestamo_detalle pd
    INNER JOIN equipos eq
      ON pd.equipo_id = eq.id
    WHERE pd.prestamo_id = ?
    ORDER BY pd.id ASC
  `;

  const [filas] = await pool.execute(sql, [prestamoId]);

  return filas;
}

export async function obtenerDetallePorId(id) {
  const sql = `
    SELECT
      pd.id,
      pd.prestamo_id,
      pd.equipo_id,
      eq.codigo,
      pd.descripcion,
      pd.estado_devolucion
    FROM prestamo_detalle pd
    INNER JOIN equipos eq
      ON pd.equipo_id = eq.id
    WHERE pd.id = ?
  `;

  const [filas] = await pool.execute(sql, [id]);

  return filas[0];
}

export async function obtenerDetallePorPrestamoYEquipo(prestamoId, equipoId) {
  const sql = `
    SELECT
      id,
      prestamo_id,
      equipo_id,
      descripcion,
      estado_devolucion
    FROM prestamo_detalle
    WHERE prestamo_id = ?
      AND equipo_id = ?
  `;

  const [filas] = await pool.execute(sql, [prestamoId, equipoId]);

  return filas[0];
}

export async function devolverEquipo(id) {
  const sql = `
    UPDATE prestamo_detalle
    SET estado_devolucion = 'DEVUELTO'
    WHERE id = ?
      AND estado_devolucion = 'PENDIENTE'
  `;

  const [resultado] = await pool.execute(sql, [id]);

  return resultado.affectedRows;
}

export async function contarEquiposPendientes(prestamoId) {
  const sql = `
    SELECT COUNT(*) AS total
    FROM prestamo_detalle
    WHERE prestamo_id = ?
      AND estado_devolucion = 'PENDIENTE'
  `;

  const [filas] = await pool.execute(sql, [prestamoId]);

  return filas[0].total;
}

export async function finalizarPrestamo(prestamoId) {
  const sql = `
    UPDATE prestamos
    SET estado = 'FINALIZADO'
    WHERE id = ?
  `;

  const [resultado] = await pool.execute(sql, [prestamoId]);

  return resultado.affectedRows;
}

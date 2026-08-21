import pool from '../config/database.js';


export async function obtenerEquipos() {
    const sql = `
        SELECT
            id,
            codigo,
            descripcion,
            imagen,
            estado
        FROM equipos
        ORDER BY codigo
    `;

    const [filas] = await pool.execute(sql);

    return filas;
}


export async function obtenerEquipoPorId(equipoId) {
    const sql = `
        SELECT
            id,
            codigo,
            descripcion,
            imagen,
            estado
        FROM equipos
        WHERE id = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [equipoId]
    );

    return filas[0];
}


export async function obtenerEquipoPorCodigo(codigo) {
    const sql = `
        SELECT
            id,
            codigo,
            descripcion,
            imagen,
            estado
        FROM equipos
        WHERE codigo = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [codigo]
    );

    return filas[0];
}


export async function crearEquipo(datosEquipo) {
    const sql = `
        INSERT INTO equipos (
            codigo,
            descripcion,
            imagen,
            estado
        )
        VALUES (?, ?, ?, ?)
    `;

    const valores = [
        datosEquipo.codigo,
        datosEquipo.descripcion,
        datosEquipo.imagen,
        datosEquipo.estado
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.insertId;
}


export async function actualizarEquipoConImagen(
    equipoId,
    datosEquipo
) {
    const sql = `
        UPDATE equipos
        SET
            codigo = ?,
            descripcion = ?,
            imagen = ?,
            estado = ?
        WHERE id = ?
    `;

    const valores = [
        datosEquipo.codigo,
        datosEquipo.descripcion,
        datosEquipo.imagen,
        datosEquipo.estado,
        equipoId
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.affectedRows;
}


export async function actualizarEquipoSinImagen(
    equipoId,
    datosEquipo
) {
    const sql = `
        UPDATE equipos
        SET
            codigo = ?,
            descripcion = ?,
            estado = ?
        WHERE id = ?
    `;

    const valores = [
        datosEquipo.codigo,
        datosEquipo.descripcion,
        datosEquipo.estado,
        equipoId
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.affectedRows;
}


export async function actualizarEstadoEquipo(
    equipoId,
    estado
) {
    const sql = `
        UPDATE equipos
        SET estado = ?
        WHERE id = ?
    `;

    const [resultado] = await pool.execute(
        sql,
        [
            estado,
            equipoId
        ]
    );

    return resultado.affectedRows;
}


export async function contarPrestamosEquipo(equipoId) {
    const sql = `
        SELECT COUNT(*) AS total
        FROM prestamo_detalle
        WHERE equipo_id = ?
    `;

    const [filas] = await pool.execute(
        sql,
        [equipoId]
    );

    return filas[0].total;
}


export async function eliminarEquipo(equipoId) {
    const sql = `
        DELETE FROM equipos
        WHERE id = ?
    `;

    const [resultado] = await pool.execute(
        sql,
        [equipoId]
    );

    return resultado.affectedRows;
}